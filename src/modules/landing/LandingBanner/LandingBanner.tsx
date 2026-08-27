import NextImage from '@/components/Image/NextImage'
import { Trans } from '@lingui/react/macro'
import { Anchor, Container, Flex, Group, Stack, Text, Title } from '@mantine/core'
import { IconCircleArrowRight } from '@tabler/icons-react'
import Link from 'next/link'
import { FC } from 'react'
import image from './assets/bg.png'
import imageMobile from './assets/bg-mobile.png'

interface Props {}

const LandingBanner: FC<Props> = () => {
  return (
    <Container size="xl" className="px-4 pt-4 md:pt-6 mb-6 md:mb-15">
      <Flex className="bg-gray-50 gap-4 max-sm:flex-col sm:justify-between relative">
        <Stack className="p-4 md:p-8 sm:max-w-[640px]">
          <Title className="text-[44px] md:text-[64px] relative z-10 max-sm:pt-[160px] max-sm:h-[350px] max-sm:text-center max-sm:text-white">
            <Trans>The Standard of Excellence</Trans>
          </Title>

          <Text fz={18}>
            <Trans>
              The ACPT is the gold standard for professional tutors worldwide. Backed by rigorous research, this
              40-minute exam is completely free and verifies the skills, knowledge, and teaching ability needed to
              deliver exceptional academic tutoring.
            </Trans>
          </Text>

          <Stack gap={8}>
            <Anchor component={Link} href="/welcome" underline="always" fz={18} className="underline-offset-4">
              <Group gap={8} className="text-dark hover:text-red-600">
                <Trans>Take the ACPT exam now</Trans>

                <IconCircleArrowRight size={14} />
              </Group>
            </Anchor>

            <Anchor component={Link} href="/organizations" underline="always" fz={18} className="underline-offset-4">
              <Group gap={8} className="text-dark hover:text-red-600">
                <Trans>ACPT for your organization</Trans>

                <IconCircleArrowRight size={14} />
              </Group>
            </Anchor>
          </Stack>
        </Stack>

        <NextImage src={image} className="max-sm:hidden" />

        <NextImage
          src={imageMobile}
          className="sm:hidden absolute top-0 left-0 w-full h-[350px] border-b-3 border-red-600"
        />
      </Flex>
    </Container>
  )
}

export default LandingBanner
