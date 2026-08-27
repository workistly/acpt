import { addDocInCollection } from '@/api/exam'
import NextImage from '@/components/Image/NextImage'
import { useTest } from '@/contexts/TestProvider'
import { useUser } from '@/contexts/UserProvider'
import CertificateFile from '@/modules/user/certificate/CertificateFile'
import { Trans, useLingui } from '@lingui/react/macro'
import { Anchor, Button, Container, Divider, Group, List, Modal, SimpleGrid, Stack, Text, Title } from '@mantine/core'
import { useDisclosure } from '@mantine/hooks'
import { showNotification } from '@mantine/notifications'
import Link from 'next/link'
import { useRouter } from 'next/router'
import { FC, use, useCallback, useMemo, useState } from 'react'
import ribbon from './assets/ribbon.svg'

const today = new Date()

interface Props {}

const TestCompletion: FC<Props> = () => {
  const { t } = useLingui()
  const router = useRouter()
  const [show, { toggle }] = useDisclosure(false)
  const [loading, setLoading] = useState(false)
  const { user } = useUser()
  const {
    examCompleted,
    completionData,
    timerExpired,
    setGetCertificate,
    setExamCompleted,
    createdExamDocId,
    retakeExam,
  } = useTest()

  // Calculate if user passed (75% or above)

  const score = useMemo(() => {
    let score = 0
    // completionData.score ? Math.round(completionData.score) : 0

    if (completionData?.score) {
      console.log('COMPLETEON DaTas', completionData)
      score = completionData.score ? Math.round(completionData.score) : 0
    } else if (localStorage.getItem('completionData')) {
      const completionData = JSON.parse(localStorage.getItem('completionData') || '{}')
      score = completionData.score ? Math.round(completionData.score) : 0
    }
    return score
  }, [completionData])

  console.log('DATA FROM LOCAL', localStorage.getItem('completionData'))

  console.log('Score: ', score)

  const hasPassed = score >= 75

  const handleSubmit = async () => {
    setLoading(true)

    try {
      const examData: { score: number; price?: number } = completionData
      const certificateId = Math.floor(100000000 + Math.random() * 900000000)
      const examScore = examData && examData.score ? Math.round(examData.score) : ''
      const price = examData && examData.price ? Math.round(examData.price) : ''

      const today = new Date()
      const docResp = await addDocInCollection('certificates', {
        examId: createdExamDocId,
        userId: user.id,
        userName: `${user.firstName} ${user.lastName}`,
        createdAt: new Date().getTime(),
        score: examScore,
        certificateNumber: certificateId,
        certificateEmail: user.email,
        imageId: '',
        paid: false,
        price,
        expiryDateTime: today.setFullYear(today.getFullYear() + 5),
        imageUrl: '',
      })

      if (docResp && docResp.status) {
        setGetCertificate(false)
        setExamCompleted(false)
        localStorage.setItem('isShowResultScreen', 'true')
        router.push(`/payment/${certificateId}`)
      } else {
        showNotification({
          message: t`An error occurred while creating the certificate. Please try again.`,
          color: 'red',
        })
      }
    } catch (e: any) {
      showNotification({
        message: e.message || t`An error occurred while creating the certificate. Please try again.`,
        color: 'red',
      })
    }

    setLoading(false)
  }

  const limitExceeded = user.examsAttempted >= 2

  const handleOnSaveForLaterPress = useCallback(() => {
    router.push('/user/my-account')
    localStorage.setItem('isShowResultScreen', 'true')
  }, [router])

  return (
    <Container size="md">
      {!timerExpired && (!limitExceeded || examCompleted) ? (
        <Stack className="text-center gap-xl">
          {!hasPassed ? (
            <>
              {/* PASSED - Show congratulations and certificate options */}
              <Title className="text-[32px] sm:text-[48px]">
                <Trans>Congratulations!</Trans>
              </Title>

              <Text className="text-lg">
                <Trans>You have successfully passed ACPT. Your score is:</Trans>
              </Text>

              <Title order={2} className="text-6xl">
                {score}
              </Title>

              <Text className="text-lg">
                <Trans>Unlock your personalized certificate now or save your results for later.</Trans>
                <br />
                <Trans>Select an option below to continue.</Trans>
              </Text>

              <SimpleGrid cols={{ base: 1, sm: 2 }}>
                <Stack className="red-box py-4 gap-xl bg-gray-50">
                  <Group className="justify-between" mih={35}>
                    <NextImage src={ribbon} />
                    <Text>$50 USD</Text>
                  </Group>

                  <Title order={2} className="text-2xl">
                    <Trans>Upgrade to a certificate</Trans>
                  </Title>

                  <List className="text-left">
                    <List.Item>
                      <Trans>Unique certificate ID number</Trans>
                    </List.Item>
                    <List.Item>
                      <Trans>Personalized URL linked to your live certificate page</Trans>{' '}
                      <Anchor component="button" onClick={toggle}>
                        <Trans>(see example)</Trans>
                      </Anchor>
                    </List.Item>
                    <List.Item>
                      <Trans>Downloadable as a PDF</Trans>
                    </List.Item>
                    <List.Item>
                      <Trans>Shareable on LinkedIn</Trans>
                    </List.Item>
                  </List>

                  <Divider className="border-gray-300" />

                  <Group className="justify-center">
                    <Button onClick={handleSubmit} loading={loading}>
                      <Trans>Upgrade now</Trans>
                    </Button>
                  </Group>
                </Stack>

                <Stack className="rounded-sm px-4 sm:px-8 py-4 gap-xl border border-gray-200">
                  <Group className="justify-end" mih={35}>
                    <Text>
                      <Trans>FREE</Trans>
                    </Text>
                  </Group>

                  <Title order={2} className="text-2xl">
                    <Trans>Save your results for later</Trans>
                  </Title>

                  <List className="text-left">
                    <List.Item>
                      <Trans>Results are saved in your profile for 1 year</Trans>
                    </List.Item>
                    <List.Item>
                      <Trans>Upgrade to a certificate at any time</Trans>
                    </List.Item>
                  </List>

                  <Divider className="border-gray-300" />

                  <Group className="justify-center">
                    {/* <Button variant="outline" component={Link} href="/user/my-account">
                      <Trans>Save for later</Trans>
                    </Button> */}
                    <Button onClick={handleOnSaveForLaterPress}>
                      <Trans>Save for later</Trans>
                    </Button>
                  </Group>
                </Stack>
              </SimpleGrid>
            </>
          ) : (
            <>
              {/* FAILED - Show try again message with retake option */}
              <Title className="text-[32px] sm:text-[48px]">
                <Trans>Test Completed</Trans>
              </Title>

              <Text className="text-lg">
                <Trans>You did not meet the passing score for the ACPT this time. Your score is:</Trans>
              </Text>

              <Title order={2} className="text-6xl">
                {score}
              </Title>

              <Text className="text-lg">
                <Trans>You can choose to retake the exam or save your results for later.</Trans>
                <br />
                <Trans>Select an option below to continue.</Trans>
              </Text>

              <SimpleGrid cols={{ base: 1, sm: 2 }}>
                {/* Retake the exam option */}
                <Stack className="red-box py-4 gap-xl bg-gray-50">
                  <Group className="justify-end" mih={35}>
                    <Text>
                      <Trans>FREE</Trans>
                    </Text>
                  </Group>

                  <Title order={2} className="text-2xl">
                    <Trans>Retake the exam</Trans>
                  </Title>

                  <List className="text-left">
                    <List.Item>
                      <Trans>Retake immediately after completion</Trans>
                    </List.Item>
                    <List.Item>
                      <Trans>No limit on the number of retakes</Trans>
                    </List.Item>
                  </List>

                  <Divider className="border-gray-300" />

                  <Group className="justify-center">
                    <Button onClick={retakeExam}>
                      <Trans>Retake now</Trans>
                    </Button>
                  </Group>
                </Stack>

                {/* Save for later option */}
                <Stack className="rounded-sm px-4 sm:px-8 py-4 gap-xl border border-gray-200">
                  <Group className="justify-end" mih={35}>
                    <Text>
                      <Trans>FREE</Trans>
                    </Text>
                  </Group>

                  <Title order={2} className="text-2xl">
                    <Trans>Save your results for later</Trans>
                  </Title>

                  <List className="text-left">
                    <List.Item>
                      <Trans>Results are saved in your profile for 1 year</Trans>
                    </List.Item>
                    <List.Item>
                      <Trans>Retake the exam at any time</Trans>
                    </List.Item>
                  </List>

                  <Divider className="border-gray-300" />

                  <Group className="justify-center">
                    {/* <Button  variant="outline" component={Link} href="/user/my-account">
                      <Trans>Save for later</Trans>
                    </Button> */}

                    <Button onClick={handleOnSaveForLaterPress}>
                      <Trans>Save for later</Trans>
                    </Button>
                  </Group>
                </Stack>
              </SimpleGrid>
            </>
          )}

          <Modal opened={show} onClose={toggle} title={t`Example Certificate`} size="xl">
            <CertificateFile
              name="Example"
              certificateNumber="00000000"
              certificateId="00000000"
              score={score || 100}
              date={today}
            />
          </Modal>
        </Stack>
      ) : limitExceeded ? (
        <Stack className="text-center">
          <Text className="text-lg">
            <Trans>
              You have already attempted the exam twice today. You will need to wait until tomorrow until you can resit
              the test.
            </Trans>
          </Text>

          <Group className="justify-center">
            <Button component={Link} href="/user/my-account">
              <Trans>View My Results</Trans>
            </Button>
          </Group>
        </Stack>
      ) : (
        <Stack className="text-center">
          <Text className="text-lg">
            <Trans>Time Expired. Please retake the exam.</Trans>
          </Text>

          <Group className="justify-center">
            <Button onClick={retakeExam}>
              <Trans>Restart Test</Trans>
            </Button>
          </Group>
        </Stack>
      )}
    </Container>
  )
}

export default TestCompletion
