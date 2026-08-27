import BlockTitle from '@/components/Title/BlockTitle'
import { Trans, useLingui } from '@lingui/react/macro'
import { AspectRatio, Flex, SimpleGrid, Stack, Text } from '@mantine/core'
import { FC, useMemo } from 'react'

interface Props {}

const LandingBenefits: FC<Props> = () => {
  const { t } = useLingui()

  const ITEMS = useMemo(
    () => [
      {
        title: t`Attract more clients`,
        description: t`Studies show that certified tutors are 40% more likely to be chosen by clients seeking to hire a professional tutor.`,
      },
      {
        title: t`Stand out from the crowd`,
        description: t`In the crowded tutoring industry, being certified sets you apart by proving you have the skills clients are looking for.`,
      },
      {
        title: t`Increase earning power`,
        description: t`According to industry data, certified tutors earn 30% more compared to tutors without formal certification.`,
      },
    ],
    [t],
  )

  return (
    <Stack className="mb-8 sm:mb-15">
      <BlockTitle>
        <Trans>Benefits of ACPT certification</Trans>
      </BlockTitle>

      <Text fw={500} fs="italic" maw={650}>
        <Trans>
          In the ever-growing tutoring industry, tutors need a way to distinguish themselves as qualified, competent
          professionals. ACPT certification offers more than just validation—it provides a competitive edge in the
          growing and evolving tutoring industry. Here are some of the key benefits:
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

export default LandingBenefits
