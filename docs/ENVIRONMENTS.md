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
firebase emulators:start --only firestore,auth,functions --project demo-acpt
yarn dev                                 # second terminal
```

The emulator UI is at http://localhost:4000.

**The `demo-` prefix is the safety mechanism.** For a project id starting with `demo-`, the
Firebase SDKs refuse to contact any real cloud service — so a misconfigured emulator connection
fails loudly instead of quietly writing to production. Do not replace it with the real project id.

### Prerequisites

- **JDK 21 or newer.** firebase-tools rejects anything older. `java -version` must report 21+ —
  having it installed is not enough if an older JDK comes first on `PATH`.
- **The `webframeworks` experiment**, once per machine:
  `firebase experiments:enable webframeworks`. `firebase.json` declares a framework-aware
  `hosting` block, and the emulator refuses to start without this even when you ask only for
  Firestore.

### Known failure on some Windows machines

The Firestore emulator can die immediately with `Unable to establish loopback connection` /
`SocketException: Invalid argument: connect` in `firestore-debug.log`. That is the JVM failing to
open its internal loopback pipe, usually because security software is intercepting local sockets.
It is not a configuration problem — the same config works elsewhere. If you hit it, work against
production **reads** only, keep writes to `zz-test-*` records, and flag it so we can sort the
machine out.

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

## Adding a cloud dev project

When the product owner decides who owns it and where billing sits:

1. Create the project (suggested id `tutorcert-dev`), enable Firestore, Storage and Blaze billing.
2. `firebase use --add` and alias it `dev`, so `.firebaserc` reads
   `{"default": ..., "dev": "tutorcert-dev", "prod": "tutorcert-324d6"}`.
3. Deploy the functions to it: `firebase deploy --only functions --project dev`.
4. Add a `.env.dev.example` with that project's config and the new function URLs.
5. Point CI's build at `dev`, and preview deploys at `dev` hosting channels.

Until then, local emulators are the only safe place to write.
