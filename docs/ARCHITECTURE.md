# ACPT Architecture Map

Produced 2026-08-27 by an 8-agent mapping pass over the full codebase. Facts below were read from code; anything uncertain is phrased as such. Unverified _issue_ leads live in [REVIEW-LEADS.md](REVIEW-LEADS.md).

## Stack

Next.js 15.3.8 (pages router, built-in i18n en/es/tr, Turbopack dev on **port 3060**) · React 19 · TypeScript 5.8 strict · Mantine 8 + Tailwind 4 (PostCSS) · Lingui 5 i18n (.po catalogs, compiled TS output git-ignored) · NextAuth v4 (credentials + JWT) · Firebase JS client SDK 11 (Firestore, Auth, Storage) · Stripe via `@stripe/react-stripe-js` (legacy Card Elements) · Chart.js · TanStack Query/Table · Yarn Classic v1. No tests, no CI, no error monitoring (SENTRY_AUTH_TOKEN env name is vestigial — no @sentry package installed).

## Page structure & guarding

`src/pages/**` are thin wrappers; the real page lives in `src/modules/**` and picks its layout (`PublicLayout`, `PublicSidebarLayout`, `AuthLayout`, `AppLayout`, `AdminLayout`). Guarding is **entirely client-side**: protected modules call `useLoginRedirect()` (redirects unauthenticated → `/login?url=…`; `/welcome` variant → `/signup`). There is no middleware.ts, no getServerSideProps guard, and **no admin-role check on any /admin page** — `user.type === 'admin'` only shows/hides the Admin menu link (`src/components/Header/UserMenu.tsx`). `ProtectedRoute.tsx` + `useAuthStatus.ts` (archived/deleted-user lockout) are dead code — imported nowhere.

Routes: public — `/`, `/organizations`, `/contact`, `/faq`, `/terms`, `/privacy`, `/cookie`, `/login`, `/signup`, `/forgot-password`, `/reset-password` (stub — submit only console.logs), `/user/certificate/[id]` (public on purpose: certificate share/verify). Authenticated — `/welcome` (the exam), `/certificate/[id]` (post-exam), `/payment/[id]`, `/user/my-account`. Admin-intended (auth-only enforced) — `/admin/dashboard|history|users|users/[id]|question-bank|exams`. API — `/api/auth/[...nextauth]`, `/api/auth/signup`.

## Auth

Hybrid, mid-migration. Signup (`/api/auth/signup`): bcrypt(12) hash stored **in the Firestore `users` doc** (random doc id); no Firebase Auth record created. Login (`[...nextauth].ts` authorize): Firestore query by email → bcrypt compare if `password` field exists, else legacy fallback to Firebase Auth `signInWithEmailAndPassword` (legacy docs are keyed by Firebase uid). JWT session carries id/email/names — **role is NOT in the token**; `UserProvider` re-reads `users/{id}` client-side for `type`, counters, profile. Password reset = Firebase Auth email flow only (breaks for bcrypt-only signups — they have no Auth record); local `/reset-password` page is a non-functional stub. All server-side Firestore access uses the **client** SDK (firebase-admin is a dependency but never imported), so Firestore rules cannot distinguish our API routes from any browser.

## Exam engine

All client-side in `TestProvider` (`src/contexts/TestProvider.tsx`): loads the active `exams` doc for the locale (timer, number_of_questions, price), downloads ALL `exams_questions` for the language **including `correctAnswer`**, shuffles (biased `sort(() => 0.5 - Math.random())`), slices N. Countdown expiry is created at **fetch** time, not Start click; `useTimer` lives inside `TestTimer` which unmounts when hidden (timer starts hidden), so on-expiry auto-submit only fires while visible. Grading, 75% pass mark, and 2-attempts-per-24h limit are all client-side; results batch-written to `exams_completed` + counters merged onto `users`. `react-webcam`/`TestImageUpload` are dead code — **no proctoring exists**. Completion screen (`TestCompletion.tsx` ~line 114) has the pass/fail branches inverted (`!hasPassed` renders "Congratulations") — **confirmed at runtime 2026-08-28**: a 24/100 attempt was congratulated and sold a certificate, while `exams_completed` correctly stored `passed:false`.

## Payments

`/payment/[id]` (id = certificateNumber) → `PaymentPage` loads Stripe.js with `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY` (currently `pk_test…`) → `PaymentForm`: unused `stripe.createToken` call, then POST `{amount: <client-side dollar price>, currency:'usd'}` **with no auth header** to the Cloud Function at `NEXT_PUBLIC_PROCESS_PAYMENT` → expects `{paymentIntent: <client_secret>}` → `stripe.confirmCardPayment` in browser → on success the **client** writes `transactions`, sets `exams_completed.payment='Paid'`, `certificates.paid=true` (three separate writes, no webhook, no server verification visible). Price source: exam doc's `price`, but `TestTable.tsx` hard-codes 50 and `PaymentPage` falls back to 1 if missing. Refund (admin): POST `{paymentIntent}` to `NEXT_PUBLIC_REFUND_PAYMENT` (no auth), then client batch-deletes the certificate + transaction docs (audit trail destroyed).

## Certificates

Created client-side on pass (3 duplicated code paths: `TestCompletion`, `TestCertificate`, `TestTable`): random 9-digit `certificateNumber` (Math.random, no uniqueness check), `paid:false`, `expiryDateTime = +5y` (but rendered "Valid until" = +2y, and "Acquired on" = render date). Public verify: footer form POSTs to `NEXT_PUBLIC_GET_CERTIFICATE`; view page POSTs docId to `NEXT_PUBLIC_GET_CERTIFICATE_BY_ID`. "Download PDF" = `window.print()`.

## Data model (Firestore, project tutorcert-324d6)

| Collection                | Purpose / key fields                                                                                                                                                                                                          |
| ------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `users`                   | doc id = Auth uid (legacy) OR random (bcrypt signups). email, **password (bcrypt hash)**, names, `type` ('user'/'admin'), provider, is_archived, attempted_exams, completed_exams, img_*, email_sent. createdAt in 3 formats. |
| `exams`                   | per-language exam config: language, number_of_questions, timer, price, marketing copy, is_active, is_archived                                                                                                                 |
| `exams_questions`         | question, answer1..4, **correctAnswer (field name, delivered to client)**, language, is_archived                                                                                                                              |
| `exams_completed`         | per attempt: score, user_id, examId, completed_at, status Complete/Incomplete, passed, payment Paid/Unpaid, language                                                                                                          |
| `certificates`            | examId (**actually → exams_completed doc id**), userId, userName, certificateNumber, certificateEmail, score, price, paid, expiryDateTime, image* (always empty)                                                              |
| `transactions`            | transactionId (Stripe PI id), certificateNumber, amount, language, transactionDate, month                                                                                                                                     |
| `analytics_registrations` | dashboard rollups, recomputed via UPDATE_USER_ANALYTICS endpoint                                                                                                                                                              |

Admin pages stream **entire collections** to the browser (`getAllDocs` / unbounded `onSnapshot`, listeners never unsubscribed) and join/aggregate in React.

## External Cloud Functions (deployed on tutorcert-324d6; source NOT in this repo)

Called by URL from `NEXT_PUBLIC_*` env vars, **no auth headers**. `firebase functions:list` (2026-08-27) shows 15 deployed functions, all v2 us-central1, nodejs18 unless noted:

| Function                                                        | Trigger          | Maps to env var / purpose                                                                                        |
| --------------------------------------------------------------- | ---------------- | ---------------------------------------------------------------------------------------------------------------- |
| processPayment                                                  | https            | NEXT_PUBLIC_PROCESS_PAYMENT — Stripe PaymentIntent creation                                                      |
| refundPayment                                                   | https            | NEXT_PUBLIC_REFUND_PAYMENT                                                                                       |
| updateUser                                                      | https            | NEXT_PUBLIC_UPDATE_USER (receives uid + new password!)                                                           |
| checkAccountExists                                              | https            | NEXT_PUBLIC_CHECK_ACCOUNT_EXISTS (unreferenced in src)                                                           |
| getCertificateData / getCertificateDataById / verifyCertificate | https            | NEXT_PUBLIC_GET_CERTIFICATE / _BY_ID / footer verification                                                       |
| sendFrontEndMail                                                | https            | NEXT_PUBLIC_SEND_FRONT_MAIL_URL                                                                                  |
| updateRegistrationsAnalytics / updateExamsAnalytics             | https            | NEXT_PUBLIC_UPDATE_USER_ANALYTICS / _EXAM_ANALYTICS                                                              |
| setRegistrationsAnalytics / setExamsAnalytics                   | **scheduled**    | periodic analytics rollups                                                                                       |
| resetAttemptedExams                                             | **scheduled**    | periodically resets users' attempt counters — likely how the "2 attempts" limit is meant to reset daily          |
| ssrtutorcert324d6                                               | https (nodejs20) | Firebase Hosting web-frameworks SSR backend — the site was (also?) deployed on Firebase Hosting, not just Vercel |

**UPDATE 2026-08-27: source recovered** and committed to `functions/` (see functions/PROVENANCE.md). One shared codebase, `functions/src/index.ts`. Key confirmed facts: all HTTPS functions are **unauthenticated** with `cors({origin:true})`; `processPayment` charges a **client-supplied amount** (`Number(amount)*100`) with no price check or webhook; `updateUser` lets any caller set any uid's email+password (account takeover); `refundPayment` refunds any PaymentIntent; `sendFrontEndMail` is an open SendGrid relay from `admin@lacmal.com`. Stripe/SendGrid keys are Secret Manager secrets (not in source). Full breakdown: the ⭐ section of docs/REVIEW-LEADS.md.

## Config & deployment

`firestore.rules` committed = expired allow-all starter (open until 2024-04-25); `storage.rules` = deny-all and not wired into firebase.json; `firestore.indexes.json` empty. Deployed rules must differ from committed — check the Firebase console. README deploy target is Vercel (env values "from Vercel project settings"); no vercel.json; real build command must chain `lingui extract && lingui compile && next build`. reactStrictMode is off; ESLint config disables `no-explicit-any` etc.; pre-commit = prettier only.
