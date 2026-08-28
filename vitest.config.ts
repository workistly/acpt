import react from '@vitejs/plugin-react'
import { fileURLToPath } from 'node:url'
import { defineConfig } from 'vitest/config'

const r = (p: string) => fileURLToPath(new URL(p, import.meta.url))

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: [
      // The Lingui macros are compiled away by @lingui/swc-plugin in the Next build; Vitest does
      // not run that plugin, so point them at stubs that keep the English source strings.
      { find: '@lingui/react/macro', replacement: r('./test/stubs/lingui-react-macro.tsx') },
      { find: '@lingui/core/macro', replacement: r('./test/stubs/lingui-core-macro.ts') },
      // Next.js turns image imports into static image objects; Vitest would try to parse the SVG.
      // The pattern has to match the whole specifier: Vite replaces only the matched portion,
      // so a suffix-only regex would rewrite './assets/x.svg' to './assets/x<stub path>'.
      { find: /^.*\.(svg|png|jpe?g|gif|webp|avif)$/, replacement: r('./test/stubs/static-asset.ts') },
      { find: /^@\//, replacement: r('./src/') },
    ],
  },
  test: {
    environment: 'jsdom',
    setupFiles: ['./test/setup.ts'],
    include: ['src/**/*.{test,spec}.{ts,tsx}', 'test/**/*.{test,spec}.{ts,tsx}'],
  },
})
