import { useTest } from '@/contexts/TestProvider'
import { Box, Container, Group, Progress, Title } from '@mantine/core'
import { FC, useMemo } from 'react'
import { useTimer } from 'react-timer-hook'

interface Props {}

const TestTimer: FC<Props> = () => {
  const { timer, setTimerExpired, setCompleted, setLoading, questionCounter, totalQuestions } = useTest()

  const { minutes, seconds } = useTimer({
    expiryTimestamp: timer!,
    onExpire: () => {
      setTimerExpired(true)
      setCompleted(true)
      setLoading(false)
    },
  })

  const percentage = useMemo(
    () => (questionCounter ? (questionCounter / totalQuestions) * 100 : 0),
    [questionCounter, totalQuestions],
  )

  const minString = minutes.toString()
  const secString = seconds.toString()

  return (
    <Box className="border-b border-b-gray-300 py-1">
      <Container>
        <Group>
          <Progress value={percentage} h={12} className="flex-1" />

          <Title order={3} className="text-lg sm:text-[32px] text-right min-w-[45px] sm:min-w-[75px]">
            {minString.padStart(2, '0')}:{secString.padStart(2, '0')}
          </Title>
        </Group>
      </Container>
    </Box>
  )
}

export default TestTimer
