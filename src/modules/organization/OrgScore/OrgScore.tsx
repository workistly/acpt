import NextImage from '@/components/Image/NextImage'
import BlockTitle from '@/components/Title/BlockTitle'
import { Trans } from '@lingui/react/macro'
import { Flex, Stack, Text } from '@mantine/core'
import { FC } from 'react'
import image from './assets/image.png'

interface Props {}

const OrgScore: FC<Props> = () => {
  return (
    <Flex className="mb-20 sm:mb-30 max-sm:flex-col gap-8">
      <Stack className="flex-1">
        <BlockTitle>
          <Trans>Score Verification System</Trans>
        </BlockTitle>

        <Text>
          <Trans>
            The ACPT Score Verification System provides organizations with secure, real-time access to candidate results
            through our robust API. Designed for seamless integration, the API allows organizations to instantly verify
            a tutor’s certification status, score, and exam date. This streamlined process eliminates the need for
            manual checks.
          </Trans>
        </Text>
      </Stack>

      <NextImage src={image} className="sm:-order-1 sm:max-w-[300px]" />
    </Flex>
  )
}

export default OrgScore
