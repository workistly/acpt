import { Trans, useLingui } from '@lingui/react/macro'
import { Button, Checkbox, Group, Stack, Text, TextInput } from '@mantine/core'
import { FC } from 'react'

interface Props {}

const LandingSubscribe: FC<Props> = () => {
  const { t } = useLingui()

  return (
    <Stack className="mb-12 blue-box bg-gray-50">
      <Text fz={24} fw={600}>
        <Trans>Subscribe to the ACPT newsletter</Trans>
      </Text>

      <Text>
        <Trans>
          Stay informed with the latest news, updates, and resources related to the ACPT, delivered directly to your
          inbox.
        </Trans>
      </Text>

      <Stack className="xs:max-md:flex-row">
        <Stack className="xs:max-md:flex-3">
          <TextInput placeholder={t`First Name`} />

          <TextInput placeholder={t`Last Name`} />

          <TextInput placeholder={t`Email Address`} />
        </Stack>

        <Stack className="xs:max-md:flex-2">
          <Checkbox label={t`I agree to the Privacy policy`} className="xs:max-md:mb-10" />

          <Group>
            <Button miw={200} className="xs:max-md:w-full">
              <Trans>Subscribe</Trans>
            </Button>
          </Group>
        </Stack>
      </Stack>
    </Stack>
  )
}

export default LandingSubscribe
