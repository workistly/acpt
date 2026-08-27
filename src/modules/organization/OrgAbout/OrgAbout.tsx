import BlockTitle from '@/components/Title/BlockTitle'
import { Trans, useLingui } from '@lingui/react/macro'
import { SimpleGrid, Stack, Text } from '@mantine/core'
import { FC, useMemo } from 'react'

interface Props {}

const OrgAbout: FC<Props> = () => {
  const { t } = useLingui()

  const ITEMS = useMemo(
    () => [
      {
        title: t`Accessible`,
        description: t`The ACPT is free, fully online, and offered in multiple languages—expanding your applicant pool to include diverse, qualified candidates around the world.`,
      },
      {
        title: t`Unbiased`,
        description: t`Developed using rigorous psychometric standards to eliminate regional, cultural, and ethnic bias—ensuring a fair and equitable evaluation for every test-taker.`,
      },
      {
        title: t`Secure`,
        description: t`Advanced security protocols and computer-adaptive technology work together to prevent cheating and deliver results you can trust.`,
      },
      {
        title: t`Reliable`,
        description: t`The ACPT certifies tutors with proven expertise. Accepting it ensures you hire professionals who meet the highest standards in tutoring excellence.`,
      },
      {
        title: t`Innovative`,
        description: t`The ACPT integrates the latest research in pedagogy, psychometrics and Al to deliver the most accurate and reliable assessment results.`,
      },
      {
        title: t`Seamless`,
        description: t`The ACPT API offers seamless integration, enabling fast and reliable score verification to streamline your recruitment process with confidence and efficiency.`,
      },
    ],
    [t],
  )

  return (
    <Stack className="mb-8 sm:mb-15">
      <BlockTitle>
        <Trans>The ACPT at a glance</Trans>
      </BlockTitle>

      <Text fw={500} fs="italic" maw={650}>
        <Trans>
          The Advanced Certified Professional Tutor (ACPT) exam is a computer-adaptive test backed by rigorous research
          in pedagogy, psychometrics, Al, and machine learning.
        </Trans>
      </Text>

      <Text>
        <Trans>
          Designed to set the global benchmark for tutor certification, the ACPT provides a comprehensive evaluation of
          each candidate’s subject knowledge, pedagogical skill, and practical tutoring ability—the core competencies
          required to deliver high-quality academic support. It’s more than a test—it’s a mark of excellence.
        </Trans>
      </Text>

      <SimpleGrid cols={{ base: 1, sm: 2, md: 3 }} mt={30} spacing={32}>
        {ITEMS.map((item, index) => (
          <Stack key={index} gap={0} className="flex-1 mb-5 mb-5 sm:mb-15">
            <Text fw={700}>{item.title}</Text>

            <Text>{item.description}</Text>
          </Stack>
        ))}
      </SimpleGrid>
    </Stack>
  )
}

export default OrgAbout
