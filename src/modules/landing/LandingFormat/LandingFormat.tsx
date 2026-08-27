import { Trans } from '@lingui/react/macro'
import { ActionIcon, Container, Group, Stack, Text } from '@mantine/core'
import { useLocalStorage } from '@mantine/hooks'
import { IconX } from '@tabler/icons-react'
import { FC } from 'react'

interface Props {}

const LandingFormat: FC<Props> = () => {
  const [show, setShow] = useLocalStorage({
    key: 'show-format',
    defaultValue: true,
    getInitialValueInEffect: true,
  })

  if (!show) return null

  return (
    <Container size="lg" className="mb-15 sm:mb-30">
      <Stack className="blue-box">
        <Group>
          <Text fz={24} fw={600}>
            <Trans>ACPT Format Changes</Trans>
          </Text>

          <ActionIcon variant="subtle" color="dark" className="ml-auto" onClick={() => setShow(false)}>
            <IconX />
          </ActionIcon>
        </Group>

        <Text>
          <Trans>
            The ACPT has transitioned from Paper-Based Testing (PBT) to Computer-Based Testing (CBT). Starting February
            2025, all exams will be delivered exclusively in the CBT format. This shift enables faster results, stronger
            security, and a more accessible testing experience for all candidates.
          </Trans>
        </Text>
      </Stack>
    </Container>
  )
}

export default LandingFormat
