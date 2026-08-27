import { queryData } from '@/api/exam'
import { useUser } from '@/contexts/UserProvider'
import { Test } from '@/types/test'
import { useQuery } from '@tanstack/react-query'

export const QK_TESTS = 'QK_TESTS'

export const useGetTests = () => {
  const { user } = useUser()

  return useQuery<Test[], void>({
    refetchOnWindowFocus: false,
    queryKey: [QK_TESTS],
    queryFn: async () => {
      const resp = await queryData('exams_completed', 'user_id', user.id as string)

      if (resp.status && resp.fullData.length > 0) {
        const arr: Test[] = []

        await Promise.all(
          resp.fullData.map(async (test: any) => {
            const resp = await queryData('certificates', 'examId', test.docId as string)

            arr.push({
              date: test.completed_at || '',
              score: test.score || 0,
              language: test.language || '',
              docId: test.docId,
              certificateNumber: resp.fullData[0]?.certificateNumber,
              certDocId: resp.fullData[0]?.docId,
              paid: resp.fullData[0]?.paid || false,
            })
          }),
        )

        return arr
      }

      return []
    },
  })
}
