import PublicLayout from '@/components/Layout/PublicLayout'
import OrgBanner from '@/modules/organization/OrgBanner/OrgBanner'
import OrgAbout from '@/modules/organization/OrgAbout/OrgAbout'
import OrgBenefits from '@/modules/organization/OrgBenefits/OrgBenefits'
import OrgContact from '@/modules/organization/OrgContact/OrgContact'
import OrgGuide from '@/modules/organization/OrgGuide/OrgGuide'
import OrgScore from '@/modules/organization/OrgScore/OrgScore'
import OrgSubscribe from '@/modules/organization/OrgSubscribe/OrgSubscribe'
import OrgWho from '@/modules/organization/OrgWho/OrgWho'
import { useLingui } from '@lingui/react/macro'
import { Container, Flex, Stack } from '@mantine/core'
import { FC } from 'react'
import image from './OrgBanner/assets/image.png'

interface Props {}

const OrgPage: FC<Props> = () => {
  const { t } = useLingui()

  return (
    <PublicLayout
      title={t`ACPT for organizations`}
      description={t`The ACPT helps you identify and verify top-tier tutoring talent with ease. Built on advanced assessment science, the ACPT ensures tutors meet the highest standards in subject knowledge, pedagogy, and professionalism. Integrating ACPT into your hiring or recognition process means choosing excellence you can trust.`}
      image={`${process.env.NEXT_PUBLIC_URL}${image.src}`}
      hideVerify
    >
      <OrgBanner />

      <Container>
        <Flex className="max-md:flex-col gap-12 md:gap-16 items-start">
          <Stack gap={0} className="md:flex-1">
            <OrgAbout />

            <OrgWho />

            <OrgBenefits />

            <OrgScore />
          </Stack>

          <Stack className="md:w-[320px] max-md:w-full">
            <OrgGuide />

            <OrgSubscribe />
          </Stack>
        </Flex>
      </Container>

      <OrgContact />
    </PublicLayout>
  )
}

export default OrgPage
