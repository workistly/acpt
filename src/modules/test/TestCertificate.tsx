import { addDocInCollection } from '@/api/exam'
import PageTitle from '@/components/Title/PageTitle'
import { useUser } from '@/contexts/UserProvider'
import { Trans, useLingui } from '@lingui/react/macro'
import { Button, Container, Group, Stack } from '@mantine/core'
import { showNotification } from '@mantine/notifications'
import { useRouter } from 'next/router'
import { FC, useState } from 'react'

interface Props {
  completionData: any
  examDocId: string
  onSubmit?: () => void
}

const TestCertificate: FC<Props> = ({ completionData, examDocId, onSubmit }) => {
  const { t } = useLingui()
  const { user } = useUser()
  const router = useRouter()
  const [loading, setLoading] = useState(false)

  const handleUploadCertificate = async () => {
    setLoading(true)

    try {
      const examData: { score: number; price?: number } = completionData
      const imgId = ''
      const imgUrl = ''
      const certificateId = Math.floor(100000000 + Math.random() * 900000000)
      const examScore = examData && examData.score ? Math.round(examData.score) : ''
      const price = examData && examData.price ? Math.round(examData.price) : ''

      let docResp: { status?: boolean } = {}
      const today = new Date()
      docResp = await addDocInCollection('certificates', {
        examId: examDocId,
        userId: user.id,
        userName: `${user.firstName} ${user.lastName}`,
        createdAt: new Date().getTime(),
        score: examScore,
        certificateNumber: certificateId,
        certificateEmail: user.email,
        imageId: imgId,
        paid: false,
        price,
        expiryDateTime: today.setFullYear(today.getFullYear() + 5),
        imageUrl: imgUrl,
      })

      if (docResp && docResp.status) {
        onSubmit?.()
        router.push(`/payment/${certificateId}`)
      } else {
        showNotification({
          message: t`An error occurred while uploading the certificate. Please try again.`,
          color: 'red',
        })
      }
    } catch (e: any) {
      showNotification({
        message: t`An unknown error occurred.`,
        color: 'red',
      })
    }

    setLoading(false)
  }

  return (
    <Container size="sm">
      <Stack className="gap-xl red-box">
        <PageTitle>
          <Trans>Continue to Payment</Trans>
        </PageTitle>

        <Group className="justify-center">
          <Button onClick={handleUploadCertificate} loading={loading}>
            <Trans>Continue</Trans>
          </Button>
        </Group>
      </Stack>
    </Container>
  )
}

export default TestCertificate
