import NextImage from '@/components/Image/NextImage'
import { Trans } from '@lingui/react/macro'
import { Container, Flex, Stack, Text, Title } from '@mantine/core'
import { FC } from 'react'
import image from './assets/image.png'

interface Props {}

const OrgBanner: FC<Props> = () => {
  return (
    <Container size="xl" className="px-4 pt-4 md:pt-6 mb-6 md:mb-15">
      <Flex className="bg-gray-50 gap-4 max-sm:flex-col">
        <Stack className="p-4 md:p-8 sm:flex-1">
          <Title className="text-[44px] md:text-[64px]">
            <Trans>ACPT for organizations</Trans>
          </Title>

          <Text fz={18}>
            The ACPT helps you identify and verify top-tier tutoring talent with ease. Built on advanced assessment
            science, the ACPT ensures tutors meet the highest standards in subject knowledge, pedagogy, and
            professionalism. Integrating ACPT into your hiring or recognition process means choosing excellence you can
            trust.
          </Text>
        </Stack>

        <NextImage src={image} className="sm:-order-1 sm:flex-1" />
      </Flex>
    </Container>
  )
}

export default OrgBanner
