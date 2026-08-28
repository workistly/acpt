## Trello card

<!-- Paste the card URL. One PR per card; if a fix needs two cards, say why here. -->

## What changed

<!-- Two or three sentences. What was wrong, and what this does about it. -->

## How it was verified

<!-- Required. Pick what applies and fill it in — "it builds" is not verification. -->

- [ ] Automated test added or updated (name it: `path/to/file.test.tsx`)
- [ ] Ran locally: `yarn compile && yarn dev`, steps taken:
- [ ] Checked against the live Firebase project (say which data you touched, and label test records `zz-test-*`)
- [ ] Not verifiable yet — explain what would prove it and what is blocking:

## Risk

- [ ] Touches payments, certificates, or anything that writes to `users` / `transactions`
- [ ] Changes Firestore or Storage rules (**note:** the committed rules are not what is deployed — see `docs/DEPLOYED-RULES.md`)
- [ ] Changes Cloud Functions (**note:** `functions/` was recovered from deployed bundles — see `functions/PROVENANCE.md`)
- [ ] None of the above

## Before merging

- [ ] CI is green
- [ ] Trello card moved, with a comment saying what changed and how it was verified
- [ ] `docs/FINDINGS.md` updated if this closes a numbered finding
