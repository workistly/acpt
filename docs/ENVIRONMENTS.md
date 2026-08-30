# Environments

There are two, and only one of them exists in the cloud today.

|                | Where                                                           | Data                                          | Who uses it              |
| -------------- | --------------------------------------------------------------- | --------------------------------------------- | ------------------------ |
| **Local**      | Firebase emulator suite on your machine, project id `demo-acpt` | throwaway, resets on restart                  | every developer, all day |
| **Production** | Firebase project `tutorcert-324d6`                              | **real users, real certificates, real money** | the deployed site        |

**There is no cloud staging project yet.** Creating one is a decision for the product owner —
it needs a Google account to own it and a Blaze billing account for Cloud Functions. Until it
exists, treat local-vs-production as the whole story, and see "Adding a cloud dev project" below.

## Local

The emulators give you Firestore, Auth and Cloud Functions on localhost. Nothing you do reaches
the cloud.

```bash
cp .env.development.example .env.local   # Next loads .env.local ahead of .env
yarn emulators                           # builds functions/, then starts the suite
yarn dev                                 # second terminal
```

The emulator UI is at http://localhost:4000.

**The `demo-` prefix is the safety mechanism.** For a project id starting with `demo-`, the
Firebase SDKs refuse to contact any real cloud service — so a misconfigured emulator connection
fails loudly instead of quietly writing to production. Do not replace it with the real project id.

### Prerequisites

- **firebase-tools** (`npm i -g firebase-tools`) and the functions dependencies
  (`npm --prefix functions install`, once). No `firebase login` is needed for the demo project.
- **JDK 21 or newer.** firebase-tools rejects anything older. `java -version` must report 21+ —
  having it installed is not enough if an older JDK comes first on `PATH`.
- **The `webframeworks` experiment**, once per machine:
  `firebase experiments:enable webframeworks`. `firebase.json` declares a framework-aware
  `hosting` block, and the emulator refuses to start without this even when you ask only for
  Firestore.

### First start and expected warnings

The first start downloads the emulator jars and the UI. These messages are normal:

- `Did not find a Cloud Firestore rules file ... allowing all reads and writes` - deliberate; see
  "The rules landmine" below.
- `package.json indicates an outdated version of firebase-functions` - spurious; functions are on
  v6, the CLI version check is just blunt.
- `Your requested "node" version "22" doesn't match your global version` - the emulator runs the
  functions with your host Node, which is fine locally.
- `function ignored because the pubsub emulator does not exist` - the three scheduled jobs do not
  run locally. Add `pubsub` to the `--only` list in the script if you ever need them.

`yarn emulators` recompiles `functions/` before starting, so TypeScript changes there are picked up
on restart. While iterating on functions, `npm --prefix functions run build:watch` in a third
terminal keeps the emulator loading fresh output.

The emulators hold data in memory only. To keep what you create across restarts:

```bash
yarn emulators --import=./.emulator-data --export-on-exit
```

`.emulator-data/` is git-ignored.

### Seeding local data

The emulators start empty, so the candidate journey dead-ends at "An exam of this language does not
exist" until an exam exists. Fastest path is the app's own admin pages:

1. Sign up at http://localhost:3060/signup - any details; it writes only to the emulator.
2. If `/admin` redirects you (today it does not - finding MF-10), open the emulator UI's Firestore
   tab (http://localhost:4000/firestore) and set `type` to `"admin"` on your `users` document.
3. Create questions in http://localhost:3060/admin/question-bank (language English), then the exam
   in http://localhost:3060/admin/exams, and mark it active.

Run with `--import`/`--export-on-exit` (above) so you only do this once.

### If the Firestore emulator dies on startup

Symptom: it exits immediately, and `firestore-debug.log` ends with
`Unable to establish loopback connection` / `SocketException: Invalid argument: connect`. That is
the JVM failing to open its internal loopback pipe over an AF_UNIX socket, before any Firebase code
runs — so it tells you nothing about your Firebase config.

Reproduce it without Firebase in the picture. Save this as `Probe.java` and run
`java Probe.java`:

```java
import java.nio.channels.Selector;

public class Probe {
  public static void main(String[] a) throws Exception {
    try (Selector s = Selector.open()) {
      System.out.println("OK");
    }
  }
}
```

If that prints `OK`, the JVM is fine and the emulator is failing for some other reason. If it throws
the same error, the restriction is on the process or environment you launched it from — we hit this
once inside a sandboxed agent process, where the identical probe passed in an ordinary terminal on
the same machine seconds later. Try a plain terminal before suspecting your security software.

### Secrets in the functions emulator

`processPayment` and the mail functions read Secret Manager values. The emulator reads them from
`functions/.secret.local` (git-ignored), one `KEY=value` per line. Use Stripe **test** keys only.

## Production

`tutorcert-324d6`. Read freely; be deliberate about writes. Deployed rules are
`allow read, write: if true` (see [DEPLOYED-RULES.md](DEPLOYED-RULES.md)), so your dev machine can
write anything to it and nothing will stop you. Label anything you create `zz-test-*`.

`.firebaserc` aliases `default` and `prod` both point at it, so `firebase use prod` is explicit
about what you are aiming at.

### The rules landmine

`firebase.json` deliberately declares **no `firestore` or `storage` targets**. If you add one, a
bare `firebase deploy` will push this repo's `firestore.rules` — the expired starter ruleset — over
production and lock every user out. The committed rules are not the deployed rules and are not
meant to be deployed as they stand.

When finding MF-2 (deploy real Firestore rules) is picked up, the rules in this repo have to be
made correct _first_, and only then wired into `firebase.json`. Doing it in the other order takes
the site down.

This is also why the Storage emulator is not configured: it requires a `storage` rules target,
which is the same landmine.

## Deploying

Firebase Hosting already serves this app and has since June 2025 - `tutorcert-324d6.web.app`
returns the built site today. It uses Firebase's **framework-aware Hosting**: `firebase.json`
declares `hosting.source: "."` with a `frameworksBackend`, so the CLI builds the Next.js app,
uploads the static output to the CDN, and deploys the server half to a Cloud Function named
`ssrtutorcert324d6` (v2, us-central1, **nodejs20**).

**No adapter is involved.** Cloud Functions v2 runs on Cloud Run - a real Node container - so the
standard Next.js server runs unmodified. This is the difference from Cloudflare Workers, which is a
V8 isolate rather than Node and therefore needs a build-time adapter (`next-on-pages`, OpenNext).
The constraint there is the runtime, not the hosting provider.

Confirmed against the live site rather than assumed: `/`, `/login` and `/welcome` come from the CDN
with a June 2025 `Last-Modified` and a cache HIT, while `/faq` and `/certificate/123` are generated
per request with no `Last-Modified` at all - so the SSR function is genuinely handling dynamic
routes.

```bash
firebase use prod
yarn build                      # never deploy without this - see finding MF-4
firebase deploy --only hosting
```

**Three things to know before relying on this:**

- Framework-aware Hosting is still behind the `webframeworks` experiment flag - the same flag the
  emulators need. Google's GA answer for SSR frameworks is now **App Hosting** (`apphosting.yaml`,
  git-connected, per-PR preview builds), which this repo does not use. Migrating is a deliberate
  decision, not a default.
- The deployed build is from **June 2025**, and `/es/faq` returns **404** while `/faq` returns 200.
  Locale-prefixed routing must be re-tested on the first fresh deploy; if it stays broken, Spanish
  and Turkish visitors get nothing. Both languages are partly untranslated anyway (see Gotchas in
  AGENTS.md).
- `ssrtutorcert324d6` runs nodejs20, so unlike the fourteen backend functions it is **not** blocked
  by the nodejs18 decommission.

Note that acpt.org does not point here - it still points at Vercel, which has disabled the
deployment. See docs/FINDINGS.md.

## Adding a cloud dev project

When the product owner decides who owns it and where billing sits:

1. Create the project (suggested id `tutorcert-dev`), enable Firestore, Storage and Blaze billing.
2. `firebase use --add` and alias it `dev`, so `.firebaserc` reads
   `{"default": ..., "dev": "tutorcert-dev", "prod": "tutorcert-324d6"}`.
3. Deploy the functions to it: `firebase deploy --only functions --project dev`.
4. Add a `.env.dev.example` with that project's config and the new function URLs.
5. Point CI's build at `dev`, and preview deploys at `dev` hosting channels.

Until then, local emulators are the only safe place to write.
