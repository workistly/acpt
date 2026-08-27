import { Trans, useLingui } from '@lingui/react/macro'
import { Button, Checkbox, Group, Stack, Text, TextInput } from '@mantine/core'
import { FC } from 'react'

interface Props {}

const OrgSubscribe: FC<Props> = () => {
  const { t } = useLingui()

  return (
    <Stack className="mb-12 blue-box bg-gray-50">
      <Text fz={24} fw={600}>
        <Trans>Subscribe to our organization newsletter</Trans>
      </Text>

      <Stack className="xs:max-md:flex-row">
        <Stack className="xs:max-md:flex-3">
          <TextInput placeholder={t`First Name`} />

          <TextInput placeholder={t`Last Name`} />

          <TextInput placeholder={t`Position`} />

          <TextInput placeholder={t`Organization`} />

          <TextInput placeholder={t`Email Address`} />
        </Stack>

        <Stack className="xs:max-md:flex-2">
          <Checkbox label={t`Employer`} />

          <Checkbox label={t`Government`} />

          <Checkbox label={t`Academic Institution`} />

          <Checkbox label={t`Professional Association`} />

          <Group>
            <Button miw={200}>
              <Trans>Submit</Trans>
            </Button>
          </Group>
        </Stack>
      </Stack>
    </Stack>
  )
}

export default OrgSubscribe
