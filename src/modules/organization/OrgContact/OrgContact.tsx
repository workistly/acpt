import { Trans, useLingui } from '@lingui/react/macro'
import { Box, Button, Container, Group, Stack, Text, Title } from '@mantine/core'
import { IconArrowRight } from '@tabler/icons-react'
import Link from 'next/link'
import { FC } from 'react'

interface Props {}

const OrgContact: FC<Props> = () => {
  const { t } = useLingui()

  return (
    <Box className="bg-red-600 text-white py-12 md:py-16 text-center">
      <Container>
        <Stack className="sm:flex-1">
          <Title order={2} className="text-[32px]">
            <Trans>Start Accepting Results</Trans>
          </Title>

          <Text mb={16}>
            <Trans>Register today to become an official ACPT-recognized organization.</Trans>
            <br />
            <Trans>After registration, you’ll gain free access to our secure ACPT Score Verification System</Trans>
            <br />
            <Trans>and a streamlined API for receiving exam results directly.</Trans>
          </Text>

          <Group className="justify-center">
            <Button
              component={Link}
              href="/contact"
              variant="outline"
              color="white"
              size="lg"
              rightSection={<IconArrowRight size={18} />}
              miw={150}
            >
              <Trans>Contact Us</Trans>
            </Button>
          </Group>
        </Stack>
      </Container>
    </Box>
  )
}

export default OrgContact
