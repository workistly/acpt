import PublicLayout from '@/components/Layout/PublicLayout'
import LandingAbout from '@/modules/landing/LandingAbout/LandingAbout'
import LandingBanner from '@/modules/landing/LandingBanner/LandingBanner'
import LandingBenefits from '@/modules/landing/LandingBenefits/LandingBenefits'
import LandingExam from '@/modules/landing/LandingExam/LandingExam'
import LandingFormat from '@/modules/landing/LandingFormat/LandingFormat'
import LandingGuide from '@/modules/landing/LandingGuide/LandingGuide'
import LandingSubscribe from '@/modules/landing/LandingSubscribe/LandingSubscribe'
import LandingWho from '@/modules/landing/LandingWho/LandingWho'
import { Container, Flex, Stack } from '@mantine/core'
import { FC } from 'react'

interface Props {}

const LandingPage: FC<Props> = () => {
  return (
    <PublicLayout>
      <LandingBanner />
      <LandingFormat />
      <Container>
        <Flex className="max-md:flex-col gap-12 md:gap-16 items-start">
          <Stack gap={0} className="md:flex-1">
            <LandingAbout />

            <LandingWho />

            <LandingBenefits />

            <LandingExam />
          </Stack>

          <Stack className="md:w-[320px] max-md:w-full">
            <LandingSubscribe />

            <LandingGuide />
          </Stack>
        </Flex>
      </Container>
    </PublicLayout>
  )
}

export default LandingPage
