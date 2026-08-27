import AuthLayout from '@/components/Layout/AuthLayout'
import PageTitle from '@/components/Title/PageTitle'
import { Trans, useLingui } from '@lingui/react/macro'
import { Button, Group, PasswordInput, Stack, Text } from '@mantine/core'
import { useForm } from '@mantine/form'
import { showNotification } from '@mantine/notifications'
import Link from 'next/link'
import { FC, useState } from 'react'

interface Props {}

const ResetPage: FC<Props> = () => {
  const { t } = useLingui()
  const [loading, setLoading] = useState(false)
  const [success, setSuccess] = useState(false)

  const form = useForm({
    initialValues: {
      password: '',
      confirmPassword: '',
    },
    validate: {
      password: (value) => (value.length < 8 ? t`Password must have at least 8 characters` : null),
      confirmPassword: (value, values) => (value !== values.password ? t`Passwords did not match` : null),
    },
  })

  const handleSubmit = async (values: typeof form.values) => {
    try {
      setLoading(true)
      console.log(values)
      setSuccess(true)
    } catch (e: any) {
      showNotification({
        message: e.message || t`An unknown error occurred. Try again later.`,
        color: 'red',
      })
    }

    setLoading(false)
  }

  return (
    <AuthLayout
      title={t`Create new password`}
      description={t`Your new password must be different to previously used passwords.`}
    >
      {success ? (
        <Stack>
          <PageTitle>
            <Trans>Password reset</Trans>
          </PageTitle>

          <Group className="justify-center text-center" gap={8} mb={16}>
            <Text className="text-lg">
              <Trans>Your password has been successfully reset. Click below to log in.</Trans>
            </Text>
          </Group>

          <Group className="justify-center" mt={16}>
            <Button component={Link} href="/login">
              <Trans>Log In</Trans>
            </Button>
          </Group>
        </Stack>
      ) : (
        <Stack>
          <PageTitle>
            <Trans>Create new password</Trans>
          </PageTitle>

          <Group className="justify-center text-center" gap={8} mb={16}>
            <Text className="text-lg">
              <Trans>Your new password must be different to previously used passwords.</Trans>
            </Text>
          </Group>

          <form onSubmit={form.onSubmit(handleSubmit)}>
            <Stack>
              <PasswordInput
                name="password"
                placeholder={t`Password`}
                withAsterisk
                {...form.getInputProps('password')}
              />

              <PasswordInput
                name="confirmPassword"
                placeholder={t`Confirm Password`}
                withAsterisk
                {...form.getInputProps('confirmPassword')}
              />

              <Group className="justify-center" mt={16}>
                <Button type="submit" loading={loading} miw={200}>
                  <Trans>Reset Password</Trans>
                </Button>
              </Group>
            </Stack>
          </form>
        </Stack>
      )}
    </AuthLayout>
  )
}

export default ResetPage
