# Deployed Security Rules — tutorcert-324d6

Retrieved 2026-08-27 from the Firebase Rules API (live release channels), **not** from the repo.
This is what is actually enforced in production right now.

## Firestore — release `cloud.firestore`, ruleset `70500bd6…`, deployed **2025-06-11**

```
rules_version = '2';
// Allow read/write access to all users under any conditions
// Warning: **NEVER** use this rule set in production; it allows
// anyone to overwrite your entire database.
service cloud.firestore {
  match /databases/{database}/documents {
    match /{document=**} {
      allow read, write, list, update, create: if true;
    }
  }
}
```

**The database is fully open to the public internet — read AND write, no authentication, no expiry.**

Note this is _worse_ than the file committed at `firestore.rules`, which is the Firebase starter
template whose `if request.time < timestamp.date(2024, 4, 25)` clause would now DENY everything.
The deployed version has had that time limit removed and is dated after it — i.e. an open ruleset
was deliberately deployed, not merely left un-updated. The committed file has never matched production.

### What this means concretely

The project ID is public (it ships in the client bundle as `NEXT_PUBLIC_FIREBASE_PROJECT_ID`), so
anyone on the internet can use the public Firebase SDK against this database and:

- **Read** every `users` document — names, emails, and the **bcrypt password hashes** stored there
- **Read** all `transactions` (payment records), `certificates`, and `exams_completed` (scores)
- **Read** `exams_questions` including the `correctAnswer` field for every exam question
- **Write** anything: grant themselves `type: 'admin'`, flip `certificates.paid` to true without
  paying, edit exam scores, or delete every document in the project

Combined with the unauthenticated `updateUser` Cloud Function (which can set any uid's email and
password), the platform currently has no meaningful access control at any layer.

### Status

This is a **live exposure today**, independent of whether the website is up — the database is
reachable regardless of acpt.org being down. It is the single highest-priority item on the board.
No user data was extracted while confirming this; the deployed ruleset text above is sufficient proof.

## Storage — release `tutorcert-324d6.appspot.com`, ruleset `dcfa368a…`, deployed **2024-04-25**

```
rules_version = '2';
service firebase.storage {
  match /b/{bucket}/o {
    match /{allPaths=**} {
      allow read: if true;
      allow write: if request.auth != null;
    }
  }
}
```

Public read of every object in the bucket; any authenticated user may write any path. Less acute
than Firestore (the app currently uploads nothing — `src/api/upload.ts` is dead code), but the
committed `storage.rules` in the repo (deny-all) also does not match production, and `firebase.json`
declares no storage target, so `firebase deploy` would not update these rules.

## Recommended immediate action

Deploy least-privilege Firestore rules and get the repo's rules files in sync with production so
`firebase deploy --only firestore:rules,storage` becomes the source of truth. Because the app reads
and writes Firestore directly from the browser — and the Next.js API routes use the **client** SDK,
so rules cannot tell them apart from a browser — a correct ruleset must be designed alongside moving
privileged writes (payment status, scores, roles) to authenticated Cloud Functions. Password hashes
should not live in a client-readable collection at all.
