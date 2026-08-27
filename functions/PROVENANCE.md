# functions/ — provenance

This backend source was **not** in the original `acpt.zip` archive, even though
`firebase.json` declares a `default` functions codebase at `functions/`. It was recovered
on 2026-08-27 by downloading the deployed source bundles from the Cloud Functions API for
project `tutorcert-324d6` (using the local `firebase-tools` login). All 14 backend functions
share one identical bundle — this is that bundle's source (`src/index.ts`), minus the
compiled `lib/` output.

No secrets are contained here: Stripe/SendGrid keys are Secret Manager references
(`defineSecret(...)`), whose values live in GCP, not in this code.

If the functions are maintained in a separate canonical repo, that repo supersedes this
copy — flag it and reconcile. Until then, this is the source of truth for the deployed backend
and completes what `firebase.json` already expects.

Deployed functions (all v2, us-central1, nodejs18): updateUser, resetAttemptedExams (cron
`0 0 * * *`), checkAccountExists, setRegistrationsAnalytics (cron `50 23 * * *`),
updateRegistrationsAnalytics, updateExamsAnalytics, setExamsAnalytics (cron `50 23 * * *`),
sendFrontEndMail, getCertificateData, getCertificateDataById, processPayment, refundPayment,
addIncompleteExam, verifyCertificate. (The 15th, `ssrtutorcert324d6`, is the Next.js SSR
hosting bundle, not part of this codebase.)
