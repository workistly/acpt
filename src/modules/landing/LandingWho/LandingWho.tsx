import BlockTitle from '@/components/Title/BlockTitle'
import { Trans, useLingui } from '@lingui/react/macro'
import { Button, Group, List, Stack, Text } from '@mantine/core'
import Link from 'next/link'
import { FC, useMemo } from 'react'

interface Props {}

const LandingWho: FC<Props> = () => {
  const { t } = useLingui()

  const ITEMS = useMemo(
    () => [
      {
        title: t`Freelancers`,
        description: t`Tutors on freelance tutoring platforms who want to boost their profiles and attract more clients.`,
      },
      {
        title: t`Students`,
        description: t`High school or college students who want to gain real-world experience and build their academic credibility.`,
      },
      {
        title: t`Entrepreneurs`,
        description: t`Independent tutors running their own businesses who want to stand out in a competitive market.`,
      },
      {
        title: t`Employed Tutors`,
        description: t`Tutors employed by organizations that require the ACPT as part of their hiring or training process.`,
      },
      {
        title: t`Job Seekers`,
        description: t`Individuals looking to strengthen their resumes and increase their job opportunities.`,
      },
    ],
    [t],
  )

  return (
    <Stack className="mb-20 sm:mb-30">
      <BlockTitle>
        <Trans>Who is the ACPT for?</Trans>
      </BlockTitle>
      <Text className="sm:text-lg" fw={500} fs="italic">
        <Trans>
          The ACPT is designed for anyone looking to prove their tutoring ability, build professional credibility, and
          open doors to new opportunities in the education field. Whether you’re just starting out or already an
          experienced tutor, the ACPT gives you a proven way to set yourself apart and gain recognition in the tutoring
          profession. The ACPT is ideal for:
        </Trans>
      </Text>

      <List my={16} spacing="sm">
        {ITEMS.map((el) => (
          <List.Item key={el.title} className="list-triangle">
            <Text>
              <strong>{el.title}:</strong>
              <br /> {el.description}
            </Text>
          </List.Item>
        ))}
      </List>

      <Group>
        <Button component={Link} href="/welcome" miw={200}>
          <Trans>Start The Exam</Trans>
        </Button>
      </Group>
    </Stack>
  )
}

export default LandingWho
