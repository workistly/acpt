## Getting Started

### Install

```bash
yarn
```

### Setup env var

Copy `.env.sample` into `.env` and fill in appropriate variables. Refer to Vercel's project settings, environment variables, to find out. Do **NOT** push this file to git.

### Run the development server

```bash
yarn dev
```

Open [http://localhost:3060](http://localhost:3060) with your browser to see the result.

## Deployment

### Build the application for production usage:

`lingui extract && lingui compile && next build`

### Start a Next.js production server:

`yarn run start`

## Available Scripts

Extract texts from code to i18n files if there are new translations, then translate the `.po` files in `/src/locales` and push to git:

`yarn run extract`

Compile i18n files for production after all texts have been translated:

`yarn run compile`

Generate custom tailwind CSS colors:

`npx tailwind-preset-mantine src/styles/colors.ts -o src/styles/colors.css`

#
