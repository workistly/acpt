/** Test-only stand-in for `@lingui/core/macro`. See lingui-react-macro.tsx. */
export const msg = (strings: TemplateStringsArray | string, ...values: unknown[]): string => {
  if (typeof strings === 'string') return strings
  return strings.reduce<string>((acc, part, i) => acc + part + (i < values.length ? String(values[i]) : ''), '')
}
