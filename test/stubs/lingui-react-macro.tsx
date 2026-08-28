/**
 * Test-only stand-in for `@lingui/react/macro`.
 *
 * The macro is normally compiled away by `@lingui/swc-plugin` (configured in next.config.ts).
 * Vitest does not run that plugin, so the real macro package throws at runtime. This stub keeps
 * the English source strings, which is what assertions in tests should match against.
 *
 * Add exports here as the app starts using more of the macro API.
 */
import type { ReactNode } from 'react'

export const Trans = ({ children }: { children?: ReactNode }) => <>{children}</>

const interpolate = (strings: TemplateStringsArray | string, ...values: unknown[]): string => {
  if (typeof strings === 'string') return strings
  return strings.reduce<string>((acc, part, i) => acc + part + (i < values.length ? String(values[i]) : ''), '')
}

export const useLingui = () => ({
  t: interpolate,
  i18n: { _: (id: string) => id },
})
