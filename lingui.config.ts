import { defineConfig } from '@lingui/cli'
import nextConfig from './next.config'

export default defineConfig({
  compileNamespace: 'ts',
  format: 'po',
  locales: nextConfig.i18n!.locales as string[],
  sourceLocale: 'en',
  fallbackLocales: {
    default: 'en',
  },
  catalogs: [
    {
      path: '<rootDir>/src/locales/{locale}/messages',
      include: ['<rootDir>/src'],
      exclude: ['**/node_modules/**'],
    },
  ],
})
