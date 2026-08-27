import PageTitle from '@/components/Title/PageTitle'
import { useTest } from '@/contexts/TestProvider'
import { Trans, useLingui } from '@lingui/react/macro'
import { Button, Container, Divider, Group, List, Stack, Text } from '@mantine/core'
import Link from 'next/link'
import { FC, useMemo } from 'react'

interface Props {}

const TestWelcome: FC<Props> = () => {
  const { t } = useLingui()
  const { setStart, questions, startExam } = useTest()

  const descriptions = useMemo(
    () => [
      t`40-minute time limit`,
      t`50 multiple choice questions`,
      t`Results are delivered immediately after finishing the exam.`,
    ],
    [t],
  )

  const things = useMemo(
    () => [
      t`The exam must be completed in a single session. If you disconnect or exit early, your progress will not be saved.`,
      t`Unanswered or incomplete questions are marked as incorrect. It's important to answer all questions within the time limit.`,
      t`This is a closed-book exam. The use of notes, websites, devices, or assistance from others is prohibited.`,
    ],
    [t],
  )

  return (
    <Container size="sm">
      <Stack className="gap-xl red-box">
        <PageTitle>
          <Trans>Welcome to the ACPT</Trans>
        </PageTitle>

        <List spacing={8}>
          {descriptions.map((el) => (
            <List.Item key={el}>
              <Text>{el}</Text>
            </List.Item>
          ))}
        </List>

        <Text className="text-2xl font-semibold">
          <Trans>Things to Remember:</Trans>
        </Text>

        <List type="ordered" spacing={8}>
          {things.map((el) => (
            <List.Item key={el}>
              <Text>{el}</Text>
            </List.Item>
          ))}
        </List>

        <Divider />

        <Group className="justify-between">
          <Button component={Link} href="/" variant="outline">
            <Trans>Cancel</Trans>
          </Button>

          <Button
            onClick={() => {
              // setStart(true)
              startExam()
            }}
            disabled={!questions.length || questions.length < 1}
          >
            <Trans>Start Test</Trans>
          </Button>
        </Group>
      </Stack>
    </Container>
  )
}

export default TestWelcome
