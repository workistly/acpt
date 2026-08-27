import NextImage from '@/components/Image/NextImage'
import CopyInput from '@/components/Input/CopyInput'
import certificate from '@/modules/user/certificate/assets/certificate.svg'
import { FORMAT_DATE_ONLY } from '@/utils/const'
import { Trans, useLingui } from '@lingui/react/macro'
import { Button, Flex, Group, Stack, Text, Title } from '@mantine/core'
import { IconDownload } from '@tabler/icons-react'
import { addYears, format } from 'date-fns'
import { FC } from 'react'

interface Props {
  name: string
  certificateNumber: string
  certificateId: string
  score: number
  date: Date
  showDownload?: boolean
}

const CertificateFile: FC<Props> = ({ name, certificateNumber, certificateId, score, date, showDownload }) => {
  const { t } = useLingui()

  return (
    <Flex className="max-lg:flex-col gap-6">
      <Stack className="lg:flex-3 items-center">
        <Group className="relative">
          <NextImage src={certificate} />

          <Title className="text-2xl xs:text-[44px] md:text-[64px] absolute top-[33%] left-0 w-full text-center">
            {name}
          </Title>

          <Title className="text-2xl xs:text-[44px] md:text-[64px] absolute top-[58%] left-0 w-full text-center">
            {score}
          </Title>

          <Text className="text-[10px] xs:text-sm md:text-md absolute bottom-[8%] right-[7%]">
            Acquired on: {format(date, FORMAT_DATE_ONLY)}
            <br />
            Valid until: {format(addYears(date, 2), FORMAT_DATE_ONLY)}
            <br />
          </Text>
        </Group>
      </Stack>

      {showDownload && (
        <Stack className="lg:flex-1 gap-lg no-print">
          <CopyInput label={t`Certificate ID Number`} value={certificateNumber} />

          <CopyInput
            label={t`Certificate URL`}
            value={`${process.env.NEXT_PUBLIC_URL}/user/certificate/${certificateId}`}
          />

          <Group>
            <Button rightSection={<IconDownload size={18} />} onClick={print}>
              <Trans>Download PDF</Trans>
            </Button>
          </Group>

          <Text>
            <Trans>
              Certified ACPT tutors are proven experts in academic support, having demonstrated excellence in subject
              matter knowledge, teaching strategies, and hands-on tutoring ability.
            </Trans>
          </Text>

          <Text mb={24}>
            <Trans>
              Recognized by leading organizations worldwide, the ACPT sets a global benchmark for tutoring quality. A
              certified ACPT tutor represents a trusted, top-tier educator committed to student success.
            </Trans>
          </Text>
        </Stack>
      )}
    </Flex>
  )
}

export default CertificateFile
