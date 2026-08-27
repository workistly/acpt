import { useTest } from '@/contexts/TestProvider'
import TestCheckbox from '@/modules/test/TestCheckbox'
import { Trans, useLingui } from '@lingui/react/macro'
import { Button, Container, Divider, Group, SimpleGrid, Stack, Text } from '@mantine/core'
import { showNotification } from '@mantine/notifications'
import { IconArrowLeft, IconArrowRight } from '@tabler/icons-react'
import { FC, useEffect, useState } from 'react'

interface Props {}

const TestContent: FC<Props> = () => {
  const { t } = useLingui()
  const { questions, answers, setAnswers, questionCounter, setQuestionCounter, currentQuestion, setCompleted } =
    useTest()

  const [answer, setAnswer] = useState(answers[currentQuestion.docId] || '')

  useEffect(() => {
    setAnswer(answers[currentQuestion.docId] || '')
  }, [currentQuestion])

  useEffect(() => {
    handleScrollToTop()
  }, [])

  useEffect(() => {
    if (answer !== '') {
      setAnswers({ ...answers, [currentQuestion.docId]: answer })
    }
  }, [answer])

  const handleScrollToTop = () => {
    window.scrollTo(0, 0)
  }

  const handleNext = () => {
    if (answer === '') {
      showNotification({
        message: t`Please select an option`,
        color: 'red',
      })
      return
    }
    setQuestionCounter(questionCounter + 1)

    setTimeout(() => {
      handleScrollToTop()
    }, 20)
  }

  return (
    <Container size="md">
      <Stack className="gap-xl red-box">
        <Text className="text-lg">
          <Trans>Question</Trans> {questionCounter + 1} / {questions.length}
        </Text>

        <Text className="text-lg font-semibold">{currentQuestion.question}</Text>

        <SimpleGrid cols={{ base: 1, sm: 2 }} className="gap-4 sm:gap-8">
          <TestCheckbox
            checked={answer === currentQuestion.answer1}
            onChange={() => setAnswer(currentQuestion.answer1)}
            answer={currentQuestion.answer1}
          />

          <TestCheckbox
            checked={answer === currentQuestion.answer2}
            onChange={() => setAnswer(currentQuestion.answer2)}
            answer={currentQuestion.answer2}
          />

          <TestCheckbox
            checked={answer === currentQuestion.answer3}
            onChange={() => setAnswer(currentQuestion.answer3)}
            answer={currentQuestion.answer3}
          />

          <TestCheckbox
            checked={answer === currentQuestion.answer4}
            onChange={() => setAnswer(currentQuestion.answer4)}
            answer={currentQuestion.answer4}
          />
        </SimpleGrid>

        <Divider />

        <Group className="justify-between">
          <Button
            variant="outline"
            leftSection={<IconArrowLeft size={16} />}
            onClick={() => setQuestionCounter(questionCounter - 1)}
            disabled={questionCounter === 0}
          >
            <Trans>Previous</Trans>
          </Button>

          {questionCounter === questions.length - 1 ? (
            <Button rightSection={<IconArrowRight size={16} />} onClick={() => setCompleted(true)}>
              <Trans>Submit</Trans>
            </Button>
          ) : (
            <Button
              rightSection={<IconArrowRight size={16} />}
              onClick={handleNext}
              disabled={questionCounter === questions.length - 1}
            >
              <Trans>Next</Trans>
            </Button>
          )}
        </Group>
      </Stack>
    </Container>
  )
}

export default TestContent
