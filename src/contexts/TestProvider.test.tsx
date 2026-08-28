/**
 * Regression test for findings AM-6: "Retake now" hung on an infinite loading spinner.
 *
 * `retakeExam` reset every piece of exam state except `completed`, and then set `loading` to true
 * with nothing left to clear it. TestPage renders `completed ? (loading ? <PageLoader/> : ...)`, so
 * the candidate was stuck on a spinner. This became launch-blocking the moment MF-3 was fixed,
 * because that is when failing candidates started seeing the retake button at all.
 */
import TestProvider, { useTest } from '@/contexts/TestProvider'
import { act, render } from '@testing-library/react'
import { beforeEach, describe, expect, it, vi } from 'vitest'

const activeExam = {
  docId: 'exam-1',
  title: 'ACPT',
  timer: 40,
  number_of_questions: 2,
  language: 'English',
  price: 50,
}

const questions = [
  { docId: 'q1', language: 'English', question: 'Q1', option_1: 'a', option_2: 'b', correctAnswer: 'option_1' },
  { docId: 'q2', language: 'English', question: 'Q2', option_1: 'a', option_2: 'b', correctAnswer: 'option_2' },
]

vi.mock('@/api/exam', () => ({
  getActiveExam: vi.fn(async () => ({ status: true, fullData: [activeExam], data: activeExam })),
  // Two collections come through here: the user's past attempts (drives the retake limit) and the
  // question bank.
  queryData: vi.fn(async (collection: string) =>
    collection === 'exams_questions'
      ? { status: true, fullData: questions }
      : { status: true, fullData: [] as unknown[] },
  ),
  addDocInCollection: vi.fn(async () => ({ status: true, docId: 'completed-1' })),
}))

vi.mock('@/contexts/UserProvider', () => ({
  useUser: () => ({
    user: {
      id: 'u1',
      firstName: 'Test',
      lastName: 'User',
      email: 't@example.invalid',
      examsAttempted: 0,
      examsCompleted: 0,
    },
  }),
}))

vi.mock('next/router', () => ({ useRouter: () => ({ push: vi.fn(), locale: 'en' }) }))

let ctx: ReturnType<typeof useTest>

const Probe = () => {
  ctx = useTest()
  return null
}

const mount = async () => {
  render(
    <TestProvider>
      <Probe />
    </TestProvider>,
  )
  // Let the mount effect's getExam() settle.
  await act(async () => {})
}

describe('retakeExam', () => {
  beforeEach(() => {
    localStorage.clear()
  })

  it('leaves the page renderable instead of stuck behind the loader', async () => {
    await mount()

    // The state a candidate is in while looking at the result screen.
    await act(async () => {
      ctx.setCompleted(true)
    })
    await act(async () => {
      ctx.setLoading(true)
    })
    expect(ctx.completed).toBe(true)
    expect(ctx.loading).toBe(true)

    await act(async () => {
      await ctx.retakeExam()
    })

    // TestPage shows PageLoader forever if either of these is still true.
    expect(ctx.completed).toBe(false)
    expect(ctx.loading).toBe(false)
  })

  it('clears the rest of the previous attempt', async () => {
    await mount()

    await act(async () => {
      ctx.setCompleted(true)
    })
    await act(async () => {
      await ctx.retakeExam()
    })

    expect(ctx.examCompleted).toBe(false)
    expect(ctx.timerExpired).toBe(false)
    expect(ctx.answers).toEqual({})
    expect(ctx.createdExamDocId).toBe('')
    expect(localStorage.getItem('isShowResultScreen')).toBe('false')
  })
})
