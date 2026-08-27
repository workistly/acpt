import NextImage from '@/components/Image/NextImage'
import { Trans, useLingui } from '@lingui/react/macro'
import { Button, Group, Stack, Text, TextInput } from '@mantine/core'
import { FC } from 'react'
import book from './assets/book.svg'

interface Props {}

const OrgGuide: FC<Props> = () => {
  const { t } = useLingui()

  return (
    <Stack className="mb-12 blue-box xs:max-md:pr-[180px] relative">
      <Text fz={24} fw={600}>
        <Trans>Guidebook for Professional Organizations</Trans>
      </Text>

      <Text>Request a copy of our guidebook for professional organizations.</Text>

      <NextImage src={book} className="xs:max-md:absolute xs:max-md:w-[130px] top-4 right-4" />

      <TextInput placeholder={t`Email Address`} maw={300} />

      <Group>
        <Button miw={200}>
          <Trans>Request Guide</Trans>
        </Button>
      </Group>
    </Stack>
  )
}

export default OrgGuide
