import BlockTitle from '@/components/Title/BlockTitle'
import { Trans, useLingui } from '@lingui/react/macro'
import { AspectRatio, Flex, SimpleGrid, Stack, Text } from '@mantine/core'
import { FC, useMemo } from 'react'

interface Props {}

const OrgBenefits: FC<Props> = () => {
  const { t } = useLingui()

  const ITEMS = useMemo(
    () => [
      {
        title: t`Faster Onboarding`,
        description: t`Skip baseline training by hiring tutors who already meet core competency requirements—saving time and resources.`,
      },
      {
        title: t`Quality Assurance`,
        description: t`Ensure that your hires meet a verified, research-backed standard of academic and instructional excellence.`,
      },
      {
        title: t`Improved Client Trust`,
        description: t`Offer parents, students, and clients peace of mind knowing your tutors are certified and held to high standards.`,
      },
      {
        title: t`Consistency`,
        description: t`Maintain uniform standards of tutor quality across branches, franchises, or international markets.`,
      },
      {
        title: t`Brand Credibility`,
        description: t`Align your organization with a globally recognized certification and demonstrate a commitment to educational quality and professionalism.`,
      },
      {
        title: t`Global Talent Access`,
        description: t`Expand your recruitment pool to include certified professionals from around the world, all verified through a consistent benchmark.`,
      },
    ],
    [t],
  )

  return (
    <Stack className="mb-8 sm:mb-15">
      <BlockTitle>
        <Trans>Why accept the ACPT</Trans>
      </BlockTitle>

      <Text fw={500} fs="italic" maw={650}>
        <Trans>
          Recognizing the ACPT isn’t just a mark of educational integrity—it’s a strategic advantage. Whether you’re a
          tutoring agency, educational platform, or academic institution, accepting ACPT-certified professionals ensures
          you’re working with individuals who meet the highest standards in tutoring excellence. From improving hiring
          efficiency to enhancing your brand’s credibility, the ACPT delivers measurable value across every stage of the
          recruitment and service process.
        </Trans>
      </Text>

      <SimpleGrid cols={{ base: 1, sm: 2, md: 3 }} mt={30}>
        {ITEMS.map((item, index) => (
          <Flex key={index} className="gap-4 md:gap-6 mb-5 sm:mb-15">
            <AspectRatio ratio={1}>
              <Stack w={32} className="bg-red-600" />
            </AspectRatio>

            <Stack gap={0} className="flex-1">
              <Text fw={700}>{item.title}</Text>

              <Text>{item.description}</Text>
            </Stack>
          </Flex>
        ))}
      </SimpleGrid>
    </Stack>
  )
}

export default OrgBenefits
