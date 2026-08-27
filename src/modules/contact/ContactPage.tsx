import PublicLayout from '@/components/Layout/PublicLayout'
import BlockTitle from '@/components/Title/BlockTitle'
import { Trans, useLingui } from '@lingui/react/macro'
import { Anchor, Box, Button, Container, Flex, Group, Select, Stack, Text, TextInput, Title } from '@mantine/core'
import { FC, useMemo } from 'react'

interface Props {}

const ContactPage: FC<Props> = () => {
  const { t } = useLingui()

  const ITEMS = useMemo(
    () => [
      {
        title: t`Help & Support`,
        description: t`For all general questions, feedback, or support:`,
        email: `support@acpt.org`,
      },
      {
        title: t`Media Inquiries`,
        description: t`For press requests, interviews, or media kits:`,
        email: `media@acpt.org`,
      },
      {
        title: t`Organizations`,
        description: t`Interested in recognizing the ACPT or integrating with our API?`,
        email: `business@acpt.org`,
      },
      {
        title: t`Legal and Regulatory Affairs`,
        description: t`For legal notices, policy-related queries, or regulatory matters:`,
        email: `legal@acpt.org`,
      },
    ],
    [t],
  )

  const OPTIONS = useMemo(
    () => [t`General Inquiry`, t`Media Inquiries`, t`Organizations`, t`Legal & Regulatory`, t`Accessibility Request`],
    [t],
  )

  return (
    <PublicLayout title={t`Contact Us`} hideVerify>
      <Box className="bg-red-600 py-10">
        <Container>
          <Title order={1} className="text-[44px] sm:text-[64px] text-center text-white sm:mb-4">
            <Trans>Contact Us</Trans>
          </Title>
        </Container>
      </Box>

      <Box className="border-b border-b-gray-200">
        <Container className="py-8 sm:py-15">
          <Flex className="max-sm:flex-col gap-8">
            <Stack className="sm:flex-1">
              <BlockTitle>
                <Trans>We are here to help</Trans>
              </BlockTitle>

              <Text className="sm:text-lg italic">
                <Trans>Please use the emails below to contact us, or submit your enquiry via the form provided.</Trans>
              </Text>

              {ITEMS.map((el) => (
                <Stack gap={0} key={el.title} mt={8}>
                  <Text className="sm:text-lg font-semibold">{el.title}</Text>

                  <Text>{el.description}</Text>

                  <Anchor href={`mailto:${el.email}`}>{el.email}</Anchor>
                </Stack>
              ))}
            </Stack>

            <Stack className="sm:flex-1 p-4 sm:p-6 bg-gray-50">
              <TextInput placeholder={t`First name`} />

              <TextInput placeholder={t`Last name`} />

              <TextInput placeholder={t`Email`} />

              <Select data={OPTIONS} placeholder={t`Reason for enquiry`} />

              <TextInput placeholder={t`Details`} />

              <Group className="justify-center">
                <Button miw={200}>
                  <Trans>Send an enquiry</Trans>
                </Button>
              </Group>
            </Stack>
          </Flex>
        </Container>
      </Box>
    </PublicLayout>
  )
}

export default ContactPage
