# Findings Register

Produced 2026-08-27 by a 9-lens multi-agent review with adversarial verification, then extended on
2026-08-28 by a **manual end-to-end run of the live application** and a **second adversarial audit in
which every card was re-checked against the code**. Every issue is a card on the Trello board; this
file is the in-repo index so the codebase and the board stay in step.

**Split: 14 Must Fix Now, 63 After MVP Release — 77 issues.**

A ✅ marks an issue **confirmed by running the application**, not by reading the code. Ten issues
carry that mark. Everything unmarked is static analysis of the frontend and the recovered Cloud
Functions backend, plus live inspection of the deployed Firestore/Storage rules
(docs/DEPLOYED-RULES.md) and the deployed function list.

## What the end-to-end run changed (2026-08-28)

The run drove the real app against the live Firebase project: signup, login, a full 50-question
exam, certificate creation, the payment page, the public verification form, My Account, and every
admin page.

**Launch blocker — payments have been dead since 26 June 2026.** `processPayment` and
`refundPayment` return HTTP 500 to every request, including a bodyless preflight; the container
aborts before any code runs. The Stripe secret was **rotated, not lost**: `STRIPE_API_KEY` v1
(created 2025-06-09) is DISABLED, and v2 was created **2026-06-26 16:12 UTC** and is ENABLED. Both
functions were last deployed 2025-06-09 and are still **pinned to version 1** — Firebase binds a
secret version at deploy time, so the rotation silently broke them.

The revenue data corroborates the date exactly: the **last successful transaction was 2026-06-26**,
and in the two months since, **30 exam attempts have been completed with zero successful payments**.
The fix is a redeploy (`firebase deploy --only functions:processPayment,functions:refundPayment`),
which re-pins to v2 — **not** re-enabling v1, which would restore a key retired for a reason. Every
other Cloud Function answered normally, and did so with **no auth header of any kind**, which
independently confirms the unauthenticated-endpoint findings below as deployed.

**The inverted results screen is worse than the static read suggested.** A deliberate fail (24/100)
produced _"Congratulations! You have successfully passed ACPT"_ together with the $50 certificate
upsell, and clicking it created a real certificate. Firestore had stored `passed: false` correctly.
So the platform currently **sells certificates to candidates who failed** and, by the same inverted
branch, **never offers one to candidates who passed** — which is the symptom you reported.

**`/admin` is genuinely open.** Signed in as an ordinary `type:'user'` account, the admin dashboard
and user list rendered in full: earnings, exam counts, and a roster of every registered user with
real names and email addresses. This is a live personal-data exposure, not a theoretical one.

**The same certificate has sold at two different prices.** All 60 historic transactions split
**39 at $100 and 21 at $50**, and the two prices interleave on the same days for the same English
exam. It is not a price change: `TestTable.tsx:65` hard-codes `price: 50` on the My Account purchase
path while the results-screen path uses the exam's configured price. About twenty customers paid half
price. It is invisible today only because the exam price now happens to be $50.

**Two things could not be tested** because the payment functions are down: the Stripe 4242 payment
and the admin refund. Both need re-running once the secret is fixed — and the deployed Stripe
**test-vs-live mode is still unknown** (the frontend key is `pk_test…`, and we deliberately never
read the secret's value; `transactions` records no mode flag, so only the Stripe dashboard can say).

## Card audit (2026-08-28)

Because this register is going to a non-technical reader, every card was independently re-checked
against the code by a second pass, with anything not cleanly confirmed sent to an adversarial
reviewer. Outcome across 79 cards: **56 confirmed as written, 18 confirmed with a correction to a
detail, 3 overstated, 2 invalid**. The two invalid ones were withdrawn (below), and the two
overstated ones were rewritten and moved out of Must Fix Now. Corrections to the remaining cards are
recorded in the card text and are to be applied when each fix is implemented.

Each card also now opens with a short plain-English paragraph for a non-technical reader.

## Fixed

Findings closed since the review. The register below is kept as written so the numbering stays
stable; this table is the status overlay. The matching Trello cards sit in the Completed list.

| #     | Area         | Issue                                                                     | Where                                |
| ----- | ------------ | ------------------------------------------------------------------------- | ------------------------------------ |
| MF-4  | Build/Deploy | Lingui catalogs not compiled during build                                 | branch `fix/lingui-build`            |
| MF-3  | Exam         | Inverted pass/fail branches on the exam result screen                     | branch `fix/exam-result-screen`      |
| AM-6  | Exam         | "Retake now" hangs on an infinite loading spinner                         | branch `fix/exam-result-screen`      |
| AM-51 | Build/Deploy | NEXTAUTH_SECRET / NEXTAUTH_URL missing from .env.example (and the README) | branch `chore/environments-and-deps` |
| AM-52 | Build/Deploy | functions/package.json missing its cors dependency                        | branch `chore/environments-and-deps` |
| AM-63 | Build/Deploy | Dependency upgrade pass                                                   | branch `chore/environments-and-deps` |

## Must Fix Now

| #   | Severity | Area         | Issue                                                                                         | Effort |
| --- | -------- | ------------ | --------------------------------------------------------------------------------------------- | ------ |
| 1   | -        | Auth         | Give the browser a Firebase identity — Firestore rules cannot work without one                | -      |
| 2   | -        | Data/Rules   | Production database is open to the internet - deploy real Firestore rules                     | -      |
| 3   | -        | Exam         | ~~Fix inverted pass/fail branches on the exam result screen~~ ✅ **fixed**                    | -      |
| 4   | -        | Build/Deploy | ~~Compile Lingui catalogs during build - every page currently returns HTTP 500~~ ✅ **fixed** | -      |
| 5   | -        | Certificates | Clients create certificates and set paid=true directly in Firestore                           | -      |
| 6   | -        | Payments     | Compute the charge amount server-side in processPayment and require auth                      | -      |
| 7   | -        | Payments     | Verify payment on the server instead of letting the browser set certificates.paid             | -      |
| 8   | -        | Payments     | Restrict refundPayment to authenticated admins and to this app's own charges                  | -      |
| 9   | -        | Auth         | Stop storing bcrypt password hashes in a browser-readable collection                          | -      |
| 10  | -        | Admin        | Enforce an admin role check on every /admin page ✅                                           | -      |
| 11  | -        | Auth         | Authenticate updateUser — anyone can set any account's email and password                     | -      |
| 12  | -        | Exam         | Stop a stale localStorage flag from hijacking the /welcome exam page ✅                       | -      |
| 13  | -        | Auth         | Build a working password reset for Firestore-only accounts ✅                                 | -      |
| 14  | -        | Payments     | Payments have been dead since 26 June — functions pinned to a retired Stripe key ✅           | -      |

## After MVP Release

| #   | Severity | Area         | Issue                                                                                      | Effort |
| --- | -------- | ------------ | ------------------------------------------------------------------------------------------ | ------ |
| 1   | -        | Data/Rules   | The admin role field lives in a user document the client must be able to write             | -      |
| 2   | -        | Certificates | Check ownership before rendering or selling a certificate by URL id                        | -      |
| 3   | -        | Admin        | Every row of a user's exam table shows the first attempt - refunds hit the wrong record    | -      |
| 4   | -        | Backend      | Lock down sendFrontEndMail — it is an unauthenticated open email relay                     | -      |
| 5   | -        | Exam         | Grade and record the attempt when the exam timer expires                                   | -      |
| 6   | -        | Exam         | ~~Fix "Retake now" - it hangs on an infinite loading spinner~~ **fixed**                   | -      |
| 7   | -        | Certificates | Certificates created from a re-entered result screen have empty examId, score and price ✅ | -      |
| 8   | -        | Payments     | Make the certificate price single-sourced and remove the $1 fallback                       | -      |
| 9   | -        | Payments     | Guard the payment page on paid/owner and add idempotency to stop repeat charges            | -      |
| 10  | high     | Admin        | Stop treating a failed refund as success before deleting the certificate                   | S      |
| 11  | high     | Auth         | updateUser silently does nothing for every account created by the current signup flow      | M      |
| 12  | high     | Admin        | Fix the null-deref race that white-screens the admin dashboard on load                     | S      |
| 13  | high     | Admin        | Clear loading state when a Firestore query returns zero rows or throws                     | S      |
| 14  | high     | Exam         | The Hide Timer button switches off the exam time limit ✅                                  | S      |
| 15  | high     | Certificates | Reuse an existing unpaid certificate instead of creating a duplicate on every click        | S      |
| 16  | high     | Certificates | Show the certificate's real issue and expiry dates instead of the page-load date           | M      |
| 17  | high     | Certificates | The Certificate URL sold to paying users renders as .../certificate/undefined              | S      |
| 18  | medium   | Auth         | Block archived users at login and end their live sessions                                  | S      |
| 19  | medium   | Auth         | Return one generic error instead of confirming which emails are registered                 | S      |
| 20  | medium   | Auth         | Validate the post-login redirect target                                                    | S      |
| 21  | medium   | Backend      | Delete addIncompleteExam — unauthenticated writes to any user document                     | S      |
| 22  | medium   | Payments     | Soft-delete refunds instead of destroying the certificate and transaction records          | S      |
| 23  | medium   | Privacy      | Account deletion leaves certificates, transactions and the Auth record behind              | M      |
| 24  | high     | Privacy      | Privacy policy describes device monitoring and analytics the app never performs            | S      |
| 25  | medium   | Backend      | resetAttemptedExams breaks at 500 users and locks everyone out of retakes                  | S      |
| 26  | medium   | Backend      | Authenticate and cap the analytics endpoints — unauthenticated full-collection scans       | S      |
| 27  | medium   | Exam         | Retake limiting is implemented three ways and the UI promises no limit                     | M      |
| 28  | medium   | Exam         | Countdown starts when the page loads, not when the candidate clicks Start                  | S      |
| 29  | low      | Certificates | Make the certificate number unique and stop trusting the first query hit                   | M      |
| 30  | high     | Admin        | Registered-Accounts metric is permanently zero: createdAt format mismatch                  | S      |
| 31  | medium   | UX           | A transient query error tells a paying user they have taken no tests                       | S      |
| 32  | medium   | Certificates | Distinguish unknown, unpaid and expired certificates in the verification result            | S      |
| 33  | medium   | Admin        | onSnapshot listeners on whole collections are never unsubscribed                           | S      |
| 34  | medium   | Privacy      | Nothing records that a user ever accepted the Terms or Privacy Policy                      | S      |
| 35  | medium   | Privacy      | No working channel for privacy requests; policy points at features that do not exist       | S      |
| 36  | low      | Build/Deploy | Remove debug console.log calls, including one that prints a plaintext password             | S      |
| 37  | low      | Backend      | Cloud Functions write names and email addresses into Cloud Logging                         | S      |
| 38  | medium   | Backend      | sendFrontEndMail sends every recipient a template addressed "Test Test"                    | S      |
| 39  | medium   | Certificates | Print the certificate ID number on the certificate itself                                  | S      |
| 40  | low      | Backend      | Stop returning raw internal error objects to unauthenticated callers                       | S      |
| 41  | low      | Backend      | Remove checkAccountExists — an unused, unauthenticated account-existence oracle            | S      |
| 42  | medium   | Auth         | Normalize email addresses at signup and login                                              | S      |
| 43  | low      | Admin        | Join certificates by exam attempt, not by user, in the admin lists                         | S      |
| 44  | low      | Performance  | Certificate lookups run one Firestore query per exam row (N+1)                             | S      |
| 45  | low      | Exam         | Question shuffle is biased, so candidates keep seeing the same questions                   | S      |
| 46  | medium   | Exam         | Welcome screen shows hardcoded rules instead of the admin's exam config                    | S      |
| 47  | low      | Exam         | Exam clock drops the hours, so long exams show the wrong time                              | S      |
| 48  | low      | Admin        | Nightly analytics job duplicates the day's registrations document                          | S      |
| 49  | low      | Admin        | Exam analytics never match a user — docId is not a stored field                            | S      |
| 50  | low      | Admin        | Earnings chart merges every year into the same twelve month buckets                        | S      |
| 51  | low      | Build/Deploy | ~~Add NEXTAUTH_SECRET and NEXTAUTH_URL to .env.example~~ **fixed**                         | S      |
| 52  | low      | Build/Deploy | ~~functions/package.json is missing the cors dependency it requires at runtime~~ **fixed** | S      |
| 53  | low      | Build/Deploy | No tests, no CI, and the lint rules that would catch these bugs are disabled               | M      |
| 54  | low      | Performance  | App-level getInitialProps disables static optimization for every page                      | M      |
| 55  | low      | Build/Deploy | Delete dead modules that imply features the product does not have                          | S      |
| 56  | low      | UX           | Spanish and Turkish sites are largely untranslated and the certificate is English-only     | L      |
| 57  | low      | UX           | Name fields reject input with the message "Invalid email"                                  | S      |
| 58  | low      | Payments     | Remove the unused stripe.createToken round trip before every purchase                      | S      |
| 59  | low      | Admin        | Stray "0" rendered in the History page toolbar                                             | S      |
| 60  | low      | Backend      | Retire or fix verifyCertificate - unwired and validates unpaid certificates ✅             | S      |
| 61  | medium   | Exam         | The abandoned-exam record is written from an unload handler, so it usually never lands ✅  | S      |
| 62  | -        | Payments     | Every failed payment shows the same generic error, with Stripe's reason discarded          | -      |
| 63  | -        | Build/Deploy | ~~Dependency upgrade pass before launch (next, next-auth, firebase, lodash)~~ **fixed**    | -      |

## Runtime evidence for the ✅ issues

Recorded so the fixes can be verified against what was actually observed, and so nobody re-derives
these from the code.

| Issue                             | What was observed on 2026-08-28                                                                                                                                                                                                                                      |
| --------------------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Payments dead since 26 June       | HTTP 500 on GET _and_ OPTIONS from Google Frontend; logs: `Secret Version [STRIPE_API_KEY/versions/1] is in DISABLED state. Instance startup will now abort`. All other functions: 204 preflight / 200 GET, with no auth header.                                     |
| Inverted pass/fail                | Score 24 → "Congratulations! You have successfully passed ACPT" + $50 upsell → certificate `294998712` created. `exams_completed` stored `score:24, passed:false, status:Complete`.                                                                                  |
| Lingui build blocker              | Clean checkout, plain `yarn dev`: `/`, `/login`, `/signup`, `/faq` all HTTP 500; server error `_app.tsx:41 Module not found: Can't resolve '../locales/' <dynamic> '/messages.ts'`. After `yarn compile`: all 200.                                                   |
| /admin role check                 | Plain `type:'user'` account reached `/admin/dashboard` and `/admin/users` with no redirect — earnings, exam counts and the full user roster (real names + emails) rendered.                                                                                          |
| localStorage `/welcome` hijack    | After "Upgrade now", a fresh visit to `/welcome` showed the stale result screen instead of the exam; the user could not start another attempt. Clearing `isShowResultScreen` restored it.                                                                            |
| Password reset                    | `/forgot-password` on a signup-created account reported "Password reset link has been sent" — but the account has no Firebase Auth record, so no mail can ever be sent. `/reset-password` submit handler is `console.log(values); setSuccess(true)`.                 |
| Hide Timer disables the limit     | Clicking "Hide Timer" removed the countdown from the DOM entirely; `TestTimer` owns the only `useTimer`/`onExpire`, so no expiry can fire while hidden.                                                                                                              |
| Duplicate / empty certificates    | Clicking Upgrade from the re-entered result screen minted a **second** certificate (`330173150`) with empty `examId`, `score` and `price`; its payment page then crashed with `IntegrationError: Invalid value for elements() amount: value must be greater than 0`. |
| verifyCertificate ignores payment | The deployed endpoint returned `{"status":true}` for an **unpaid** certificate. (Correction to the original card: the composite index it needs _does_ exist in production — that part was repo-vs-prod drift, not a runtime break.)                                  |
| Certificate sold at two prices    | All 60 transactions split 39 @ $100 / 21 @ $50, interleaved on the same days for the same exam. `TestTable.tsx:65` hard-codes `price: 50` on the My Account path; the results-screen path uses the exam's configured price.                                          |
| Abandoned-exam record             | Baseline 0 `exams_completed`; started an exam, navigated away, re-checked twice over ~12 s: still 0. The `unload` write does not land.                                                                                                                               |

Two further observations, already covered by existing cards, were confirmed in passing: the exam
countdown is created at page fetch rather than at Start (clicking Start after ~70 s on the welcome
screen opened the clock at **38:50** of 40:00), and the public certificate page renders "Acquired
on" as the page-load date while showing a +2-year validity against a stored +5-year expiry.

**Test records left in the live project.** Two accounts `zz-test-e2e-*@acpt-qa.invalid`, one
`exams_completed` (score 24) and two unpaid `certificates` (`294998712`, `330173150`). They are
labelled rather than deleted, since the project is live; remove them whenever convenient.

## Withdrawn after the card audit (3)

Claims that did not survive re-checking. Recorded so nobody re-raises them.

- **[Payments] A failed payment shows the user nothing — Buy Now silently dies** — **My error.** I
  raised this during the end-to-end run after watching a failed payment produce no visible reaction.
  That was a mistake in how I observed it. `PaymentForm.tsx:120-127` does show a red "An unknown error
  occurred." toast and re-enables the button, `:113-118` shows "Payment failed. Please try again.",
  and `<Notifications />` is correctly mounted at `_app.tsx:30`. Mantine's default auto-close is
  4 seconds and I took my screenshot 10 seconds after clicking, so the message had already gone. Card
  archived. The only real residue — every failure showing the same generic wording, with Stripe's
  actual reason discarded to the console — is now covered by the reworked "Every failed payment shows
  the same generic error" card.

- **[Certificates] Keep the app header out of the printed certificate** — Disproved. `AuthHeader.tsx:17`
  already carries `no-print`, and `globals.css:102-107` hides `.no-print` and its descendants under
  `@media print`, so the header is already excluded from the printout and the proposed fix was a no-op.
  Two thin truths remain (Download PDF is `window.print()` rather than a generated file; no
  `@page { margin: 0 }`, so the browser prints its own URL/date header) — too minor for their own card.

- **[Admin] Users page throws RangeError on any user document without a usable createdAt** — The code
  fragility is real: `UsersPage.tsx:81-84` defaults a missing `createdAt` to `''` and then calls
  `format(new Date(''), …)`, which throws. But the premise does not exist in the data. All **123** user
  documents carry a parseable string `createdAt`; **zero** would throw, and the page rendered all seven
  pages of results with no console error. Withdrawn as a defect.

## Downgraded after the card audit (2)

- **3D Secure / SCA** — the card claimed European and UK cardholders cannot pay. That is wrong:
  `PaymentForm.tsx:84` calls `confirmCardPayment` with no options, so `handleActions` defaults to true
  and Stripe.js renders the 3DS challenge itself. Rewritten around the defect that does exist — every
  failure shows one identical generic message and `resp.error.message` is thrown away — and moved to
  After MVP as MEDIUM.

- **Dependency advisories** — re-checked against this app's actual configuration. The next-auth
  "critical" is in the Email/magic-link normaliser (this app registers only CredentialsProvider), and
  the next "high" advisories are App-Router/RSC issues that a Pages-Router app with no middleware
  cannot hit. Retitled as a pre-launch upgrade pass, downgraded to MEDIUM, moved to After MVP. What
  genuinely applies (next/image optimiser, protobufjs/grpc under the Firebase SDK, and a
  major-version-behind `functions/`) is listed on the card.

## Refuted during the original review (2)

Claims raised by a review lens that did not survive adversarial checking at the time.

- **[Auth] Verify email ownership before issuing a certificate** — The code facts are accurate (signup.ts:42-49 stores no verification flag and sends no mail; RegisterPage.tsx:65 signs in immediately; TestCertificate.tsx:37-42 copies user.firstName/lastName/email onto the certificate) but they do not describe a defect — they describe an absent feature, and nothing in the stated product flow (admin creates exam -> user takes it -> passer buys a certificate -> anyone verifies it) calls for email verification. The claimed impact also does not follow from the fix: the name printed on the certificate is free text on the user document regardless of whether the address was verified, so verifying the mailbox does not make the certificate's identity claim any truer. And the proposed remedy is new work, not a minimal fix: a verified flag, a signed one-time link, a new mail template, and a purchase-time gate — while the only mailer in the codebase is the unauthenticated open-relay sendFrontEndMail (functions/src/index.ts:464) that would first have to be secured. If identity on certificates is a genuine product requirement it belongs in a product conversation with the client (and would need ID verification, not email verification), not on an MVP defect board. The proposed playwright test also asserts behavior that was never specified.
- **[Build/Deploy] Exclude functions/ from the Next.js typecheck - yarn build fails today** — The type error is an artifact of this engagement, not of the client's codebase. `git ls-tree -r abd0043 --name-only | grep ^functions` is EMPTY — the entire functions/ directory (including src/index.ts) was added later by the review team in commit 8f60611 ("functions: add recovered backend source"), as functions/PROVENANCE.md states. In the shipped repo there is no .ts file outside src/, so `**/*.ts` picks up nothing that breaks. I confirmed both halves: `npx tsc --noEmit -p tsconfig.json` reports exactly one error, `functions/src/index.ts(7,28) TS2307`, and with `functions` excluded `npx next build` completes and emits all 25 routes. Claiming a critical launch blocker for a break the audit itself introduced is misleading.

## Gaps this review did not cover

Updated after the end-to-end run — items the run closed have been removed or narrowed.

- **Stripe mode is still unconfirmed.** The frontend key is `pk_test…`. The backend key could not be
  checked because the `STRIPE_API_KEY` secret is disabled and `processPayment` never starts. Re-check
  test-vs-live as soon as the secret is restored, before go-live (report env var _names_ only).
- **SCA / 3D Secure is untested and unhandled.** `confirmCardPayment` can return `requires_action`;
  PaymentForm treats anything other than `succeeded` as a generic failure, so European and UK
  cardholders would silently fail to pay. Now its own Must Fix card, but it could not be exercised
  while payments are down.
- No lens asked whether a paying customer ever receives their certificate by email. SendGrid sends
  from `admin@lacmal.com`, a domain unrelated to ACPT, and no SPF/DKIM/DMARC or deliverability posture
  was reviewed. Certificate delivery appears to be on-screen only.
- No backup or disaster-recovery posture was assessed. There is no evidence of Firestore scheduled
  backups or point-in-time recovery, on a product that stores payment records and certificates that
  must remain verifiable for years. Combined with the client-SDK deletes and the allow-all rules, a
  single bad actor or bad script is unrecoverable.
- No accessibility review at all: keyboard navigation through the exam, form labels, focus management
  in Mantine modals, colour contrast on the certificate, and screen-reader behaviour of the timer. For
  a certification product this is frequently a contractual or statutory requirement, not a nicety.
  (One incidental datapoint from the run: pressing Enter or Space on a focused Next/Submit button did
  not advance the exam — worth a proper keyboard pass.)
- Admin-side data validation was not reviewed. Nothing covers what happens when an admin saves an exam
  with number_of_questions greater than the question pool, zero questions, a missing timer, a missing
  price, or a question with no correctAnswer. The exam runtime assumes all of these are well formed.
- Referential integrity across admin deletes was not covered. Admins can delete exams and
  exams_questions from the browser, but certificates and exams_completed hold examId references; no
  finding asks what a certificate verifies as after its exam is deleted.
- **Exam content quality was not assessed.** The run read the live question bank to drive the exam and
  noticed at least one English question whose stored `correctAnswer` points at an implausible option.
  The overall distribution looks healthy and spot checks were fine, so this is not raised as a defect —
  but nobody has subject-matter-reviewed the 1,230 questions or their answer keys, and a wrong key
  silently mis-grades every candidate who sees it.
- No lens reviewed the SSR hosting runtime configuration (Cloud Functions region, memory, timeout,
  min/max instances, cache-control) for the Next.js frameworksBackend, which every request now hits
  because of the app-level getInitialProps.

## Added after the main review (2026-08-27, session 3)

Both are now numbered Must Fix Now items (rows 1 and 14); the detail is kept here because it does not
fit on a card.

### 1. The browser has no Firebase identity — rules cannot be tightened without fixing this first

Firestore rules can only evaluate `request.auth`, which is populated **only** by a Firebase Auth ID
token. This app authenticates with NextAuth (JWT cookie) and never signs the Firebase JS SDK in, so
`request.auth` is null on every client-side Firestore call. Any ruleset stricter than `allow read,
write: if true` therefore denies the entire application — which is very likely _why_ the open ruleset
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

`yarn audit` flags a long list, but a re-check on 2026-08-28 against this app's actual configuration
found nothing clearly exploitable, so the card was downgraded to MEDIUM and moved to After MVP.
Being accurate here matters more than the card looking urgent.

**What genuinely applies**

| Package                                              | Installed  | Issue                                                                                                                                                                                             | Fixed in       |
| ---------------------------------------------------- | ---------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | -------------- |
| next (`next/image`)                                  | 15.3.8     | Image Optimization DoS and unbounded optimiser disk-cache growth. `NextImage.tsx` wraps next/image on ~13 screens and the App Hosting frameworks backend runs the optimiser on your own instance. | 15.5.21        |
| protobufjs, @grpc/grpc-js                            | transitive | critical / high, under the Firebase client SDK which the API routes use server-side                                                                                                               | bump firebase  |
| firebase-admin, firebase-functions (in `functions/`) | 11.x / 4.x | a full major version behind; this is the real server-side surface                                                                                                                                 | current majors |

**What does NOT apply — do not present these as exposure**

- The next-auth "critical" is in the Email/magic-link normaliser. This app registers only
  `CredentialsProvider`, has no Email or OAuth provider, and never calls `getToken`. All four
  next-auth advisories sit in unused code paths.
- The next "high" advisories are React Server Components / Server Actions / rewrite-SSRF /
  i18n-middleware-bypass. This is Pages Router with no `app` dir, no middleware and no rewrites, so
  all of them are inert here.
- The lodash `_.template` injection: the app imports only `padStart`.

All within-major bumps. Sequence them _after_ the launch blockers so any regression is easy to
attribute, and re-run the full user journey afterwards — there is no test suite to catch a break.
