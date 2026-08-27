import BlockTitle from '@/components/Title/BlockTitle'
import { Trans, useLingui } from '@lingui/react/macro'
import { Button, Group, SimpleGrid, Stack, Text } from '@mantine/core'
import Link from 'next/link'
import { FC, useMemo } from 'react'

interface Props {}

const LandingAbout: FC<Props> = () => {
  const { t } = useLingui()

  const ITEMS = useMemo(
    () => [
      {
        title: t`Fast`,
        description: t`Complete the ACPT exam in 40 minutes and receive your score immediately.`,
      },
      {
        title: t`Affordable`,
        description: t`Taking the ACPT is absolutely free, and you can retake the exam once per day.`,
      },
      {
        title: t`Convenient`,
        description: t`100% fully online. Take the ACPT anytime, anywhere. No appointment required.`,
      },
      {
        title: t`Accessible`,
        description: t`Accommodations are available upon request to test takers with disabilities, ensuring fairness and equality.`,
      },
      {
        title: t`Unbiased`,
        description: t`Developed using the most rigorous vetting process to remove regional, ethnic, or cultural biases.`,
      },
      {
        title: t`Adaptive`,
        description: t`Question difficulty dynamically adjusts based on your responses, ensuring an accurate evaluation.`,
      },
    ],
    [t],
  )

  return (
    <Stack className="mb-20 sm:mb-30">
      <BlockTitle>
        <Trans>About the ACPT</Trans>
      </BlockTitle>

      <Text fw={500} fs="italic">
        <Trans>
          The Advanced Certified Professional Tutor (ACPT) exam is a computer-adaptive test that customizes the
          assessment to your individual proficiency level. It covers key areas including subject matter knowledge,
          teaching methods, and practical tutoring skills, ensuring a comprehensive evaluation of your skills. Here are
          its key attributes:
        </Trans>
      </Text>

      <SimpleGrid cols={{ base: 1, sm: 2, md: 3 }} mt={30} spacing={32}>
        {ITEMS.map((item, index) => (
          <Stack key={index} gap={0} className="flex-1 mb-5 sm:mb-10">
            <Text fw={700}>{item.title}</Text>

            <Text>{item.description}</Text>
          </Stack>
        ))}
      </SimpleGrid>

      <Group>
        <Button component={Link} href="/welcome" miw={200}>
          <Trans>Start The Exam</Trans>
        </Button>
      </Group>
    </Stack>
  )
}

export default LandingAbout
