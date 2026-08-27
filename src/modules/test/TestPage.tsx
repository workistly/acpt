import logoFull from '@/assets/logo-full.svg'
import logo from '@/assets/logo.svg'
import LanguageSelector from '@/components/Header/LanguageSelector'
import NextImage from '@/components/Image/NextImage'
import AppHead from '@/components/Layout/AppHead'
import PageLoader from '@/components/Loader/PageLoader'
import { useTest } from '@/contexts/TestProvider'
import { useUser } from '@/contexts/UserProvider'
import useLoginRedirect from '@/hooks/useLoginRedirect'
import TestCertificate from '@/modules/test/TestCertificate'
import TestCompletion from '@/modules/test/TestCompletion'
import TestContent from '@/modules/test/TestContent'
import TestTimer from '@/modules/test/TestTimer'
import TestWelcome from '@/modules/test/TestWelcome'
import { Trans, useLingui } from '@lingui/react/macro'
import { Box, Button, Center, Container, Group, Title } from '@mantine/core'
import { modals } from '@mantine/modals'
import { IconChevronDown } from '@tabler/icons-react'
import Link from 'next/link'
import { useRouter } from 'next/router'
import { FC } from 'react'

interface Props {}

const TestPage: FC<Props> = () => {
  useLoginRedirect(true)
  const router = useRouter()
  const { t } = useLingui()
  const { fetching } = useUser()
  const {
    spinner,
    start,
    examCompleted,
    getCertificate,
    loading,
    completed,
    examExist,
    showTimer,
    setShowTimer,
    completionData,
    createdExamDocId,
    setGetCertificate,
  } = useTest()

  const handleQuit = () => {
    modals.openConfirmModal({
      title: t`Quit Test`,
      children: t`All progress will be lost. Are you sure you want to quit?`,
      labels: {
        confirm: t`Yes, Quit Test`,
        cancel: t`Cancel`,
      },
      cancelProps: {
        variant: 'outline',
      },
      onConfirm: () => {
        router.push('/')
      },
    })
  }

  if (fetching) return <PageLoader />

  const isFromResultScreen = localStorage.getItem('isShowResultScreen') == 'true' ? true : false

  return (
    <Box mih="100dvh">
      <AppHead title={t`Welcome to the ACPT`} />

      <Group className="shadow py-3">
        <Container className="w-full">
          <Group>
            <Link href="/">
              <NextImage src={logo} alt="ACPT" className="xs:hidden" />
              <NextImage src={logoFull} alt="ACPT" className="max-xs:hidden" />
            </Link>

            <Group className="ml-auto">
              {!start && <LanguageSelector />}

              {start && !completed && !getCertificate && (
                <>
                  <Button
                    variant="outline"
                    rightSection={<IconChevronDown size={16} />}
                    onClick={() => setShowTimer((prevState) => !prevState)}
                  >
                    {showTimer ? <Trans>Hide Timer</Trans> : <Trans>Show Timer</Trans>}
                  </Button>

                  <Button onClick={handleQuit}>
                    <Trans>Quit Test</Trans>
                  </Button>
                </>
              )}
            </Group>
          </Group>
        </Container>
      </Group>

      {start && !completed && !getCertificate && showTimer && <TestTimer />}

      <Box className="my-10 md:my-20">
        {!getCertificate &&
          (!spinner && !examExist ? (
            <Center h={200}>
              <Title className="text-center">
                <Trans>An exam of this language does not exist</Trans>
              </Title>
            </Center>
          ) : (
            <>
              {completed || examCompleted || isFromResultScreen ? (
                loading ? (
                  <PageLoader />
                ) : (
                  <TestCompletion />
                )
              ) : (
                <>{!start ? <>{spinner ? <PageLoader /> : <TestWelcome />}</> : <TestContent />}</>
              )}
            </>
          ))}

        {getCertificate && (
          <TestCertificate
            completionData={completionData}
            examDocId={createdExamDocId}
            onSubmit={() => setGetCertificate(false)}
          />
        )}
      </Box>
    </Box>
  )
}

export default TestPage
