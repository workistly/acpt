# ACPT — Tutor Certification Platform

Next.js 15 (pages router) + Firebase (project `tutorcert-324d6`). Prospective tutors take a certification exam and buy a certificate; anyone can verify a certificate by its ID number or URL. Pre-launch.

This file is the canonical instructions for both humans and coding agents. `CLAUDE.md` points here — keep the content in one place.

## Read first

- [docs/ONBOARDING.md](docs/ONBOARDING.md) — day one: access, environment, first run. Start here if you just joined.
- [docs/ARCHITECTURE.md](docs/ARCHITECTURE.md) — how the app actually fits together: routes, auth, exam engine, payments, certificates, data model, and the deployed Cloud Functions.
- [docs/FINDINGS.md](docs/FINDINGS.md) — the code review register: 77 issues, 14 must-fix, with the split between launch blockers and post-MVP work. Ten are confirmed by a manual end-to-end run (2026-08-28); that run also found **payments have been dead since 2026-06-26** — the Stripe key was rotated but `processPayment`/`refundPayment` are still pinned to the now-disabled secret version 1, so both 500 on every request. Fix is a redeploy, not re-enabling v1.
- [docs/DEPLOYED-RULES.md](docs/DEPLOYED-RULES.md) — the security rules actually deployed to production, which differ from the ones committed here.

## Hard rules

- **Never commit `.env`.** It is git-ignored; keep it that way. Never paste its values into code, docs, logs, or issue trackers — reference variable _names_ only.
- **Stripe stays in test mode** for all development (`4242 4242 4242 4242`). The frontend key is `pk_test…`.
- The Firebase project is **live and may hold real user data**. Reads are fine; be deliberate about writes, label test records clearly (`zz-test-*`), and never run bulk deletes.
- `firestore.rules` and `storage.rules` in this repo **do not match production** and `firebase.json` declares no rules targets, so `firebase deploy` never updates them. Check the console before reasoning about security. See docs/DEPLOYED-RULES.md.

## Commands

Yarn Classic — this is not an npm or pnpm project; never generate a `package-lock.json`.

```
yarn                                  # install (corepack may need an elevated shell; npm i -g yarn also works)
yarn dev                              # dev server on http://localhost:3060 (compiles i18n first)
yarn build                            # production build (compiles i18n first)
yarn typecheck                        # tsc --noEmit
yarn lint                             # manual only; the pre-commit hook is prettier-only
yarn test                             # vitest, single run
yarn test:watch                       # vitest, watch mode
yarn extract                          # only after adding or changing UI strings; rewrites the .po files
```

**Do not take `lingui compile` back out of `dev` and `build`.** `_app.tsx` imports the compiled
catalogs (`src/locales/<locale>/messages.ts`) at request time, and those files are git-ignored.
Until 2026-08-28 neither script generated them, so a clean checkout built successfully and then
returned HTTP 500 on *every* page — the state acpt.org was left in. See docs/FINDINGS.md #4.

## How we work

- **One Trello card per PR.** The card URL goes in the PR description. If a fix genuinely needs two cards closed at once, say why.
- **Branch off `main`**: `fix/…`, `feat/…`, `chore/…`. Keep PRs small enough to review in one sitting.
- **CI must be green before merge** — `.github/workflows/ci.yml` runs typecheck, lint, test and build on every PR.
- **Verification is part of the change, not an afterthought.** Every PR says how it was verified. Where the code path is testable, add a test that fails before the fix and passes after; where it is not, say what you ran and what you saw.
- **When you close a numbered finding**, update `docs/FINDINGS.md` and move the Trello card with a comment saying what changed and how it was verified.
- Anything touching payments, certificates, Firestore rules or Cloud Functions gets a second pair of eyes. See `.github/CODEOWNERS`.

## Tests

Vitest + React Testing Library, jsdom environment. Specs live next to the code (`*.test.tsx`) or in `test/`.

- `test/setup.ts` polyfills `matchMedia` and `ResizeObserver`, which Mantine needs and jsdom lacks.
- `test/stubs/` replaces the Lingui macros and image imports, neither of which survives outside the Next build. `test/harness.test.tsx` is a smoke test for exactly that wiring — **if it fails, the harness is broken, not your code.**
- There is no coverage gate. The point is a regression test per bug fixed, not a number.

## Architecture in one paragraph

Every page under `src/pages/` is a thin wrapper around a module in `src/modules/`; layouts and _client-side-only_ auth guards (`useLoginRedirect`) live with the modules. All data access uses the Firebase **client** SDK directly from the browser — including inside the two API routes, so Firestore rules cannot distinguish server from browser. Collections: `users` (holds bcrypt password hashes and the `type: 'user'|'admin'` role), `exams`, `exams_questions` (holds `correctAnswer`), `exams_completed`, `certificates`, `transactions`, `analytics_*`. Auth is NextAuth v4 credentials + JWT with a legacy Firebase-Auth fallback; **the browser never signs in to Firebase**, which is why `request.auth` is null in every rule. Privileged operations (Stripe PaymentIntent/refund, email, analytics, certificate lookup) are HTTP calls to Cloud Functions in [functions/](functions/src/index.ts), reached by URL from `NEXT_PUBLIC_*` env vars.

## Gotchas

- `functions/` was recovered from the deployed bundles, not the original archive — see [functions/PROVENANCE.md](functions/PROVENANCE.md). If a canonical functions repo exists elsewhere, it supersedes this copy. The root `tsconfig.json` excludes it; it has its own.
- `.env.example` is missing `NEXTAUTH_URL` and `NEXTAUTH_SECRET`, which the app requires. README calls the file `.env.sample`; it is `.env.example`.
- i18n is Lingui with locale-prefixed routing (`/es/...`). Spanish is ~50% untranslated, Turkish ~29%; missing strings silently fall back to English.
- `reactStrictMode` is off and several ESLint safety rules are disabled, so a class of bugs will not surface locally.
