/**
 * Smoke test for the Vitest harness itself.
 *
 * If this fails, the problem is the test setup (Lingui macro stubs, Mantine's matchMedia /
 * ResizeObserver polyfills, the `@/` alias) rather than the code under test. Keep it passing
 * before debugging any other failing spec.
 */
import ribbon from '@/modules/test/assets/ribbon.svg'
import { Trans, useLingui } from '@lingui/react/macro'
import { MantineProvider, Text } from '@mantine/core'
import { render, screen } from '@testing-library/react'
import { describe, expect, it } from 'vitest'

const Example = () => {
  const { t } = useLingui()
  return (
    <MantineProvider>
      <Text>
        <Trans>Congratulations!</Trans>
      </Text>
      <Text>{t`Score: ${42}`}</Text>
    </MantineProvider>
  )
}

describe('test harness', () => {
  it('renders Mantine components and Lingui macro strings', () => {
    render(<Example />)
    expect(screen.getByText('Congratulations!')).toBeInTheDocument()
    expect(screen.getByText('Score: 42')).toBeInTheDocument()
  })

  it('resolves image imports to the static-asset stub', () => {
    // Vite replaces only the matched portion of an alias pattern, so this silently produced a
    // mangled path the first time round. Assert the whole specifier was swapped.
    expect(ribbon).toMatchObject({ src: '/test-stub.svg' })
  })
})
