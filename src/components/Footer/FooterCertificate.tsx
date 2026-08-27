import { Trans, useLingui } from '@lingui/react/macro'
import { Box, Button, Container, Group, Stack, Text, TextInput, Title } from '@mantine/core'
import { useInputState } from '@mantine/hooks'
import { showNotification } from '@mantine/notifications'
import { IconArrowRight } from '@tabler/icons-react'
import { useRouter } from 'next/router'
import { FC, useState } from 'react'

interface Props {}

const FooterCertificate: FC<Props> = () => {
  const { t } = useLingui()
  const router = useRouter()
  const [value, setValue] = useInputState('')
  const [loading, setLoading] = useState(false)

  const handleSubmit = async () => {
    if (!value) return

    setLoading(true)

    try {
      const resp = await fetch(process.env.NEXT_PUBLIC_GET_CERTIFICATE as string, {
        method: 'POST',
        headers: {
          Accept: 'application/json, text/plain, */*',
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          certificate_number: value,
        }),
      })

      const data = await resp.json()

      if (data.status && !data.expired) {
        router.push(`/user/certificate/${data.data.docId}`)
      } else {
        setLoading(false)
        showNotification({
          message: t`Please enter a valid certificate number to continue.`,
          color: 'red',
        })
      }
    } catch (e: any) {
      setLoading(false)
    }
  }

  return (
    <Box className="bg-red-600 text-white py-12 md:py-16 text-center">
      <Container>
        <Stack className="flex-1 items-center">
          <Title order={2} className="text-[32px]">
            <Trans>Verify A Certificate</Trans>
          </Title>

          <Text maw={650}>
            <Trans>
              In order to verify a tutor’s certification, please enter the Certification number provided on the tutor’s
              certificate.
            </Trans>
          </Text>

          <Group className="justify-center gap-4">
            <TextInput
              placeholder={t`Certificate Number`}
              value={value}
              onChange={setValue}
              className="w-full xs:w-[320px]"
            />

            <Group className="max-xs:justify-center">
              <Button
                variant="outline"
                color="white"
                size="lg"
                rightSection={<IconArrowRight size={18} />}
                miw={150}
                onClick={handleSubmit}
                loading={loading}
              >
                <Trans>Verify</Trans>
              </Button>
            </Group>
          </Group>
        </Stack>
      </Container>
    </Box>
  )
}

export default FooterCertificate
