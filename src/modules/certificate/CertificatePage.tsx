import { getDocument } from '@/api/doc'
import AppHead from '@/components/Layout/AppHead'
import AppLayout from '@/components/Layout/AppLayout'
import PageLoader from '@/components/Loader/PageLoader'
import { useUser } from '@/contexts/UserProvider'
import useLoginRedirect from '@/hooks/useLoginRedirect'
import TestCertificate from '@/modules/test/TestCertificate'
import { Trans, useLingui } from '@lingui/react/macro'
import { Box, Center, Container, Title } from '@mantine/core'
import { showNotification } from '@mantine/notifications'
import { useRouter } from 'next/router'
import { FC, useEffect, useState } from 'react'

interface Props {}

const CertificatePage: FC<Props> = () => {
  useLoginRedirect()
  const router = useRouter()
  const { t } = useLingui()
  const { fetching } = useUser()

  const docId = router.query.id as string

  const [loading, setLoading] = useState(true)
  const [valid, setValid] = useState(false)
  const [completedExamData, setCompletedExamData] = useState<any>(null)

  useEffect(() => {
    getData()
  }, [])

  const getData = async () => {
    try {
      const resp = await getDocument(docId, 'exams_completed')
      if (resp.status && resp.exists) {
        const completedData: any = resp.data
        if (completedData.payment && completedData.payment.toLowerCase() === 'unpaid') {
          const response = await getDocument(completedData.examId, 'exams')
          if (response.status && response.exists) {
            const examDataFetched: any = response.data
            setValid(true)
            setCompletedExamData({
              score: completedData.score ? Number(completedData.score) : 0,
              examName: examDataFetched.title || '',
              price: examDataFetched.price || 0,
            })
          }
        }
      } else {
      }
    } catch (e: any) {
      showNotification({
        message: t`An error occurred while fetching the certificate data`,
        color: 'red',
      })
    }

    setLoading(false)
  }

  if (fetching) return <PageLoader />

  return (
    <AppLayout>
      <AppHead title={t`Certificate`} />

      <Container>
        {loading ? (
          <PageLoader />
        ) : valid ? (
          <Box className="my-10 md:my-30">
            <TestCertificate completionData={completedExamData} examDocId={docId} />
          </Box>
        ) : (
          <Center h={200}>
            <Title className="text-center">
              <Trans>
                We had an issue retrieving your exam information - please reach out to support for assistance.
              </Trans>
            </Title>
          </Center>
        )}
      </Container>
    </AppLayout>
  )
}

export default CertificatePage
