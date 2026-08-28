/**
 * Regression test for findings MF-3: the exam result screen rendered the passing branch when the
 * candidate had FAILED and the failing branch when they had PASSED.
 *
 * The live symptom, reported by the client and reproduced in the 2026-08-28 end-to-end run: a score
 * of 24 showed "Congratulations!" and the paid certificate upsell, and a passing score was never
 * offered a certificate at all.
 */
import TestCompletion from '@/modules/test/TestCompletion'
import { MantineProvider } from '@mantine/core'
import { render, screen } from '@testing-library/react'
import type { ReactNode } from 'react'
import { beforeEach, describe, expect, it, vi } from 'vitest'

const useTestMock = vi.fn()

vi.mock('@/api/exam', () => ({
  addDocInCollection: vi.fn(async () => ({ status: true, docId: 'cert-doc' })),
}))
vi.mock('@/contexts/TestProvider', () => ({ useTest: () => useTestMock() }))
vi.mock('@/contexts/UserProvider', () => ({
  useUser: () => ({
    user: { id: 'u1', firstName: 'Test', lastName: 'User', email: 't@example.invalid', examsAttempted: 0 },
  }),
}))
vi.mock('next/router', () => ({ useRouter: () => ({ push: vi.fn(), locale: 'en' }) }))
vi.mock('@/modules/user/certificate/CertificateFile', () => ({ default: () => null }))
vi.mock('@/components/Image/NextImage', () => ({ default: () => null }))

const renderWithScore = (score: number) => {
  useTestMock.mockReturnValue({
    examCompleted: true,
    completionData: { score, examName: 'ACPT', price: 50 },
    timerExpired: false,
    setGetCertificate: vi.fn(),
    setExamCompleted: vi.fn(),
    createdExamDocId: 'exam-doc',
    retakeExam: vi.fn(),
  })

  return render(<TestCompletion />, {
    wrapper: ({ children }: { children: ReactNode }) => <MantineProvider>{children}</MantineProvider>,
  })
}

describe('TestCompletion', () => {
  beforeEach(() => {
    useTestMock.mockReset()
  })

  it('offers the certificate to a candidate who passed', () => {
    renderWithScore(92)

    expect(screen.getByText('Congratulations!')).toBeInTheDocument()
    expect(screen.getByRole('button', { name: 'Upgrade now' })).toBeInTheDocument()
    expect(screen.queryByRole('button', { name: 'Retake now' })).not.toBeInTheDocument()
  })

  it('does not offer the certificate to a candidate who failed', () => {
    renderWithScore(24)

    expect(screen.getByText('Test Completed')).toBeInTheDocument()
    expect(screen.getByRole('button', { name: 'Retake now' })).toBeInTheDocument()
    expect(screen.queryByText('Congratulations!')).not.toBeInTheDocument()
    expect(screen.queryByRole('button', { name: 'Upgrade now' })).not.toBeInTheDocument()
  })

  it('treats the pass mark itself as a pass', () => {
    renderWithScore(75)

    expect(screen.getByText('Congratulations!')).toBeInTheDocument()
  })

  it('treats one mark below the pass mark as a fail', () => {
    renderWithScore(74)

    expect(screen.getByText('Test Completed')).toBeInTheDocument()
  })
})
