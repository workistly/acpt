# Findings Register

Produced 2026-08-27 by a 9-lens multi-agent review with adversarial verification (125 raw findings
-> 75 distinct issues after refutation and de-duplication). Every issue is a card on the Trello
board; this file is the in-repo index so the codebase and the board stay in step.

**Split: 12 Must Fix Now, 63 After MVP Release.**

Scope note: static analysis of the full frontend and the recovered Cloud Functions backend, plus
live inspection of the deployed Firestore/Storage rules (docs/DEPLOYED-RULES.md) and the deployed
function list. The end-to-end manual run (test user, admin account, Stripe 4242 payment) had not
been performed when this register was written; items depending on it are marked *needs runtime check*.


## Must Fix Now

| # | Severity | Area | Issue | Effort |
|---|---|---|---|---|
| 1 | critical | Data/Rules | Production database is open to the internet - deploy real Firestore rules | M |
| 2 | critical | Exam | Fix inverted pass/fail branches on the exam result screen | S |
| 3 | critical | Build/Deploy | Compile Lingui catalogs during build - every page currently returns HTTP 500 | S |
| 4 | critical | Certificates | Clients create certificates and set paid=true directly in Firestore | M |
| 5 | critical | Payments | Compute the charge amount server-side in processPayment and require auth | M |
| 6 | critical | Payments | Verify payment on the server instead of letting the browser set certificates.paid | L |
| 7 | critical | Payments | Restrict refundPayment to authenticated admins and to this app's own charges | S |
| 8 | critical | Auth | Stop storing bcrypt password hashes in a browser-readable collection | L |
| 9 | critical | Admin | Enforce an admin role check on every /admin page | M |
| 10 | critical | Auth | Authenticate updateUser — anyone can set any account's email and password | S |
| 11 | medium | Exam | Stop a stale localStorage flag from hijacking the /welcome exam page | M |
| 12 | high | Auth | Build a working password reset for Firestore-only accounts | L |

## After MVP Release

| # | Severity | Area | Issue | Effort |
|---|---|---|---|---|
| 1 | high | Data/Rules | The admin role field lives in a user document the client must be able to write | S |
| 2 | high | Certificates | Check ownership before rendering or selling a certificate by URL id | S |
| 3 | high | Admin | Every row of a user's exam table shows the first attempt - refunds hit the wrong record | S |
| 4 | high | Backend | Lock down sendFrontEndMail — it is an unauthenticated open email relay | S |
| 5 | high | Exam | Grade and record the attempt when the exam timer expires | S |
| 6 | high | Exam | Fix "Retake now" - it hangs on an infinite loading spinner | S |
| 7 | high | Certificates | Stop creating certificates with empty examId, score and price from a re-entered re... | M |
| 8 | medium | Payments | Make the certificate price single-sourced and remove the $1 fallback | M |
| 9 | high | Payments | Guard the payment page on paid/owner and add idempotency to stop repeat charges | S |
| 10 | high | Admin | Stop treating a failed refund as success before deleting the certificate | S |
| 11 | high | Auth | updateUser silently does nothing for every account created by the current signup flow | M |
| 12 | high | Admin | Fix the null-deref race that white-screens the admin dashboard on load | S |
| 13 | high | Admin | Clear loading state when a Firestore query returns zero rows or throws | S |
| 14 | high | Exam | The Hide Timer button switches off the exam time limit | S |
| 15 | high | Certificates | Reuse an existing unpaid certificate instead of creating a duplicate on every click | S |
| 16 | high | Certificates | Show the certificate's real issue and expiry dates instead of the page-load date | M |
| 17 | high | Certificates | The Certificate URL sold to paying users renders as .../certificate/undefined | S |
| 18 | medium | Auth | Block archived users at login and end their live sessions | S |
| 19 | medium | Auth | Return one generic error instead of confirming which emails are registered | S |
| 20 | medium | Auth | Validate the post-login redirect target | S |
| 21 | medium | Backend | Delete addIncompleteExam — unauthenticated writes to any user document | S |
| 22 | medium | Payments | Soft-delete refunds instead of destroying the certificate and transaction records | S |
| 23 | medium | Privacy | Account deletion leaves certificates, transactions and the Auth record behind | M |
| 24 | high | Privacy | Privacy policy describes device monitoring and analytics the app never performs | S |
| 25 | medium | Backend | resetAttemptedExams breaks at 500 users and locks everyone out of retakes | S |
| 26 | medium | Backend | Authenticate and cap the analytics endpoints — unauthenticated full-collection scans | S |
| 27 | medium | Exam | Retake limiting is implemented three ways and the UI promises no limit | M |
| 28 | medium | Exam | Countdown starts when the page loads, not when the candidate clicks Start | S |
| 29 | low | Certificates | Make the certificate number unique and stop trusting the first query hit | M |
| 30 | low | Backend | Retire or fix verifyCertificate - unwired, ignores payment, needs an undeclared index | S |
| 31 | high | Admin | Registered-Accounts metric is permanently zero: createdAt format mismatch | S |
| 32 | low | Admin | Users page throws RangeError on any user document without a usable createdAt | S |
| 33 | medium | UX | A transient query error tells a paying user they have taken no tests | S |
| 34 | medium | Certificates | Distinguish unknown, unpaid and expired certificates in the verification result | S |
| 35 | medium | Admin | onSnapshot listeners on whole collections are never unsubscribed | S |
| 36 | medium | Exam | The abandoned-exam record is written from an unload handler, so it usually never lands | S |
| 37 | medium | Privacy | Nothing records that a user ever accepted the Terms or Privacy Policy | S |
| 38 | medium | Privacy | No working channel for privacy requests; policy points at features that do not exist | S |
| 39 | low | Build/Deploy | Remove debug console.log calls, including one that prints a plaintext password | S |
| 40 | low | Backend | Cloud Functions write names and email addresses into Cloud Logging | S |
| 41 | medium | Backend | sendFrontEndMail sends every recipient a template addressed "Test Test" | S |
| 42 | medium | Certificates | Print the certificate ID number on the certificate itself | S |
| 43 | low | Backend | Stop returning raw internal error objects to unauthenticated callers | S |
| 44 | low | Backend | Remove checkAccountExists — an unused, unauthenticated account-existence oracle | S |
| 45 | medium | Auth | Normalize email addresses at signup and login | S |
| 46 | low | Admin | Join certificates by exam attempt, not by user, in the admin lists | S |
| 47 | low | Admin | Certificate lookups run one Firestore query per exam row (N+1) | S |
| 48 | low | Exam | Question shuffle is biased, so candidates keep seeing the same questions | S |
| 49 | medium | Exam | Welcome screen shows hardcoded rules instead of the admin's exam config | S |
| 50 | low | Exam | Exam clock drops the hours, so long exams show the wrong time | S |
| 51 | low | Admin | Nightly analytics job duplicates the day's registrations document | S |
| 52 | low | Admin | Exam analytics never match a user — docId is not a stored field | S |
| 53 | low | Admin | Earnings chart merges every year into the same twelve month buckets | S |
| 54 | low | Certificates | Keep the app header out of the printed certificate | S |
| 55 | low | Build/Deploy | Add NEXTAUTH_SECRET and NEXTAUTH_URL to .env.example | S |
| 56 | low | Build/Deploy | functions/package.json is missing the cors dependency it requires at runtime | S |
| 57 | low | Build/Deploy | No tests, no CI, and the lint rules that would catch these bugs are disabled | M |
| 58 | low | Build/Deploy | App-level getInitialProps disables static optimization for every page | M |
| 59 | low | Build/Deploy | Delete dead modules that imply features the product does not have | S |
| 60 | low | UX | Spanish and Turkish sites are largely untranslated and the certificate is English-only | L |
| 61 | low | UX | Name fields reject input with the message "Invalid email" | S |
| 62 | low | Payments | Remove the unused stripe.createToken round trip before every purchase | S |
| 63 | low | Admin | Stray "0" rendered in the History page toolbar | S |

## Refuted during verification (2)

Claims raised by a review lens that did not survive adversarial checking. Recorded so they are not re-raised.

- **[Auth] Verify email ownership before issuing a certificate** — The code facts are accurate (signup.ts:42-49 stores no verification flag and sends no mail; RegisterPage.tsx:65 signs in immediately; TestCertificate.tsx:37-42 copies user.firstName/lastName/email onto the certificate) but they do not describe a defect — they describe an absent feature, and nothing in the stated product flow (admin creates exam -> user takes it -> passer buys a certificate -> anyone verifies it) calls for email verification. The claimed impact also does not follow from the fix: the name printed on the certificate is free text on the user document regardless of whether the address was verified, so verifying the mailbox does not make the certificate's identity claim any truer. And the proposed remedy is new work, not a minimal fix: a verified flag, a signed one-time link, a new mail template, and a purchase-time gate — while the only mailer in the codebase is the unauthenticated open-relay sendFrontEndMail (functions/src/index.ts:464) that would first have to be secured. If identity on certificates is a genuine product requirement it belongs in a product conversation with the client (and would need ID verification, not email verification), not on an MVP defect board. The proposed playwright test also asserts behavior that was never specified.
- **[Build/Deploy] Exclude functions/ from the Next.js typecheck - yarn build fails today** — The type error is an artifact of this engagement, not of the client's codebase. `git ls-tree -r abd0043 --name-only | grep ^functions` is EMPTY — the entire functions/ directory (including src/index.ts) was added later by the review team in commit 8f60611 ("functions: add recovered backend source"), as functions/PROVENANCE.md states. In the shipped repo there is no .ts file outside src/, so `**/*.ts` picks up nothing that breaks. I confirmed both halves: `npx tsc --noEmit -p tsconfig.json` reports exactly one error, `functions/src/index.ts(7,28) TS2307`, and with `functions` excluded `npx next build` completes and emits all 25 routes. Claiming a critical launch blocker for a break the audit itself introduced is misleading.

## Gaps this review did not cover

- Stripe key handling was never audited. No lens confirmed which key lives where: whether NEXT_PUBLIC_STRIPE_* is publishable-only, whether the secret key in Cloud Functions comes from Firebase Secret Manager or functions config rather than a committed file, and whether any sk_live/sk_test literal appears in functions/ or the deployed bundles. That is a launch-gating check on a payments product and should be done before go-live (report env var names only).
- Nobody checked whether the integration is in Stripe test mode or live mode, and no finding covers SCA/3DS: confirmCardPayment can return requires_action, and PaymentForm has no handling for it. European or UK cardholders would silently fail to pay.
- No lens asked whether a paying customer ever receives their certificate by email. SendGrid sends from admin@lacmal.com, a domain unrelated to ACPT, and no SPF/DKIM/DMARC or deliverability posture was reviewed. Certificate delivery appears to be on-screen only.
- No backup or disaster-recovery posture was assessed. There is no evidence of Firestore scheduled backups or point-in-time recovery, on a product that stores payment records and certificates that must remain verifiable for years. Combined with the client-SDK deletes and the allow-all rules, a single bad actor or bad script is unrecoverable.
- No accessibility review at all: keyboard navigation through the exam, form labels, focus management in Mantine modals, colour contrast on the certificate, and screen-reader behaviour of the timer. For a certification product this is frequently a contractual or statutory requirement, not a nicety.
- Admin-side data validation was not reviewed. Nothing covers what happens when an admin saves an exam with number_of_questions greater than the question pool, zero questions, a missing timer, a missing price, or a question with no correctAnswer. The exam runtime assumes all of these are well formed.
- Referential integrity across admin deletes was not covered. Admins can delete exams and exams_questions from the browser, but certificates and exams_completed hold examId references; no finding asks what a certificate verifies as after its exam is deleted.
- No dependency or supply-chain check was run (yarn audit / npm audit) against next 15.3.8, next-auth 4, firebase 11 and firebase-admin 13, and no lens reviewed the SSR hosting runtime configuration (Cloud Functions region, memory, timeout, min/max instances, cache-control) for the Next.js frameworksBackend, which every request now hits because of the app-level getInitialProps.

## Added after the main review (2026-08-27, session 3)

Two issues identified after the main pass. Both are now Must Fix Now cards.

### 1. The browser has no Firebase identity — rules cannot be tightened without fixing this first

Firestore rules can only evaluate `request.auth`, which is populated **only** by a Firebase Auth ID
token. This app authenticates with NextAuth (JWT cookie) and never signs the Firebase JS SDK in, so
`request.auth` is null on every client-side Firestore call. Any ruleset stricter than `allow read,
write: if true` therefore denies the entire application — which is very likely *why* the open ruleset
is deployed. **The "deploy real Firestore rules" card cannot be completed on its own; this is its
prerequisite.**

Two routes, decision needed:
- **A (bridge, ~half a day):** keep NextAuth; add an API route that verifies the session and returns
  `getAuth().createCustomToken(uid, {admin})` via firebase-admin; client calls `signInWithCustomToken()`.
  Mint with `uid` == the Firestore users doc id so `users/{uid}` rules line up.
- **B (move identity to Firebase Auth, better):** migrate the bcrypt users with `firebase auth:import`
  and a bcrypt hash config — no password resets required. Collapses four Must Fix items into one:
  rules become writable, hashes leave Firestore, password reset works out of the box, and admin
  becomes a custom claim instead of a client-writable document field.

B is the destination; A is a valid first step and nothing is wasted by taking it.

### 2. Dependency audit (never previously run)

`yarn audit`: 165 advisories over 575 packages (10 critical, 75 high). `npm audit` in `functions/`:
33 more (4 critical). Most of the Next.js advisories are App-Router/Server-Actions-only and do not
apply to this Pages-Router app with no middleware. What does apply:

| Package | Installed | Issue | Fixed in |
|---|---|---|---|
| next-auth | 4.24.11 | **critical** homoglyph `@` bypass in email normalizer; uncaught exception in `getToken()` | 4.24.15 |
| next | 15.3.8 | **high** DoS via HTTP request deserialization (React Server Components) — one patch short; SSRF in rewrites; Image Optimization DoS/content injection; Pages-Router-i18n middleware bypass | 15.3.9 / 15.5.21 |
| lodash | 4.17.x | **high** code injection via `_.template` | 4.18.0 |
| protobufjs, websocket-driver, fast-xml-parser, form-data | transitive | critical/high, via firebase and firebase-admin | bump both parents |

All within-major bumps. Sequence them *after* the two launch blockers so any regression is easy to
attribute, and re-run the full user journey afterwards — there is no test suite to catch a break.
