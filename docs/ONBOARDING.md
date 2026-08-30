# Onboarding — day one

Target: the app running on your machine and one green PR by the end of the day. Read
[AGENTS.md](../AGENTS.md) first — this file only covers getting started.

## 1. Access you need

Ask the product owner for each of these; none of them can be self-served.

| What                               | Why                                | Notes                                             |
| ---------------------------------- | ---------------------------------- | ------------------------------------------------- |
| GitHub `workistly/acpt`            | the code                           | write access, not admin                           |
| Firebase project `tutorcert-324d6` | the database, functions, hosting   | **this is production** — see the warning below    |
| Trello board "ACPT"                | the work queue                     | every PR references a card                        |
| Slack                              | the client channel                 | the client reviews at end of day, in his timezone |
| `.env` values                      | the app does not boot without them | **via a password manager, never Slack or email**  |

Stripe dashboard access is not currently granted to the team. If you need to confirm whether a
payment is live or test mode, that has to go through the product owner.

## 2. Work against the emulators, not production

`tutorcert-324d6` holds real users, real certificates and real transactions, and there is no cloud
staging project yet. Your default should be the local Firebase emulator suite, which is set up and
documented in [ENVIRONMENTS.md](ENVIRONMENTS.md) — it needs JDK 21+ and one `firebase experiments`
command, and then nothing you do can reach the cloud.

When you do have to touch production:

- **Reads are fine.** Writes are not routine — think before each one.
- Label every test record you create with a `zz-test-` prefix so it can be found and removed later.
- Never run a bulk update or delete.
- The deployed Firestore rules are `allow read, write: if true`. Your dev machine can write anything
  to production, and nothing will stop you. This is finding #2 in [FINDINGS.md](FINDINGS.md).

## 3. Environment

```bash
git clone https://github.com/workistly/acpt.git
cd acpt
npm i -g yarn firebase-tools    # Yarn Classic + Firebase CLI (corepack needs an elevated shell)
yarn                            # app dependencies
npm --prefix functions install  # Cloud Functions dependencies, for the emulator
firebase experiments:enable webframeworks   # once per machine
cp .env.development.example .env.local      # local emulator setup; see ENVIRONMENTS.md
yarn emulators                  # Firebase emulator suite - keep this terminal open
yarn dev                        # second terminal -> http://localhost:3060
```

To point at production instead, use `.env.example` -> `.env` and fill in the real values from the
password manager.

Node 22 (see `.nvmrc`) and JDK 21+ for the emulators.

`yarn dev` and `yarn build` both run `lingui compile` first, which generates the git-ignored
`src/locales/**/*.ts` catalogs. If you ever invoke `next dev` or `next build` directly and every
page returns HTTP 500, that is why — run `yarn compile` and try again.

Then check the rest works:

```bash
yarn typecheck && yarn lint && yarn test
```

## 4. How the code is laid out

`src/pages/` are thin wrappers; the real components live in `src/modules/<area>/`. Data access goes
through `src/api/*`, which uses the Firebase **client** SDK — including from the two API routes, so
there is no server/client trust boundary today. The backend is Cloud Functions in `functions/`,
called over plain HTTP using URLs from `NEXT_PUBLIC_*` variables.

[ARCHITECTURE.md](ARCHITECTURE.md) has the full map. Read it before your first non-trivial change —
several things in this codebase are not what they look like.

## 5. Your first PR

1. Take a card from **Must Fix Now** on Trello, or ask which one is yours.
2. Branch: `fix/short-description`.
3. Make the change. Add a test if the code path can be tested — see `test/harness.test.tsx` for the
   wiring and any `*.test.tsx` for the pattern.
4. Open the PR. The template asks how you verified it; that section is the point of the review.
5. CI must be green. Then move the card with a comment saying what changed and how you checked it.

## 6. Known traps

- The committed `firestore.rules` / `storage.rules` are **not** what is deployed, and `firebase.json`
  declares no rules target, so `firebase deploy` will not update them. See
  [DEPLOYED-RULES.md](DEPLOYED-RULES.md).
- `functions/` was reconstructed from the deployed bundles, not from an original repo. Diff before
  you redeploy anything. See [../functions/PROVENANCE.md](../functions/PROVENANCE.md).
- `reactStrictMode` is off and several ESLint safety rules are disabled — double-render and
  dependency bugs will not show up locally.
- Payments are down in production (finding #14) and have been since 26 June 2026. Do not spend time
  debugging the payment UI until that is resolved; the failure is server-side.
