# ACPT — Tutor Certification Platform

Next.js 15 (pages router) + Firebase. Prospective tutors take a certification exam and buy a
certificate; anyone can verify a certificate by its ID number or URL.

- **[AGENTS.md](AGENTS.md)** — how to work in this repo (also what coding agents read).
- **[docs/ONBOARDING.md](docs/ONBOARDING.md)** — start here if you just joined.
- **[docs/ENVIRONMENTS.md](docs/ENVIRONMENTS.md)** — local emulators vs production.
- **[docs/ARCHITECTURE.md](docs/ARCHITECTURE.md)** — how the app actually fits together.
- **[docs/FINDINGS.md](docs/FINDINGS.md)** — the open issue register.

## Getting started

Requires **Node 22** (see `.nvmrc`) and Yarn Classic - plus **JDK 21+** and `firebase-tools` for
the local Firebase emulators.

```bash
yarn
cp .env.development.example .env.local   # local emulators — see docs/ENVIRONMENTS.md
yarn emulators                           # Firebase emulator suite (one terminal)
yarn dev                                 # http://localhost:3060 (another terminal)
```

To run against production Firebase instead, copy `.env.example` to `.env` and fill it in from the
team password manager. Never commit either file.

## Scripts

```bash
yarn dev            # dev server (compiles i18n catalogs first)
yarn build          # production build (compiles i18n catalogs first)
yarn start          # serve the production build
yarn emulators      # local Firebase suite - see docs/ENVIRONMENTS.md
yarn typecheck      # tsc --noEmit
yarn lint           # eslint
yarn format         # prettier --write .
yarn test           # vitest
```

`yarn extract` pulls new translatable strings out of the code into `src/locales/**/*.po`. Run it
after adding UI text, translate the `.po` files, and commit them. `yarn compile` turns them into
the catalogs the app loads — `dev` and `build` already do this for you.

Regenerate the Tailwind colour tokens with:

```bash
npx tailwind-preset-mantine src/styles/colors.ts -o src/styles/colors.css
```

## Contributing

One Trello card per pull request, CI green before merge, and every PR says how the change was
verified. The details are in [AGENTS.md](AGENTS.md).
