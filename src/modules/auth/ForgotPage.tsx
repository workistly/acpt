import { checkAccountExists, sendPasswordResetEmailFunc } from '@/api/auth'
import AuthLayout from '@/components/Layout/AuthLayout'
import PageTitle from '@/components/Title/PageTitle'
import { FIELD_EMAIL_MESSAGE } from '@/utils/const'
import { Trans, useLingui } from '@lingui/react/macro'
import { Anchor, Button, Group, Stack, Text, TextInput } from '@mantine/core'
import { isEmail, useForm } from '@mantine/form'
import { showNotification } from '@mantine/notifications'
import { padStart } from 'lodash'
import Link from 'next/link'
import { FC, useEffect, useRef, useState } from 'react'

interface Props {}

const ForgotPage: FC<Props> = () => {
  const { t } = useLingui()
  const resentInterval = useRef<NodeJS.Timeout>(null)
  const [loading, setLoading] = useState(false)
  const [sent, setSent] = useState(false)
  const [resent, setResent] = useState(0)

  useEffect(() => {
    return () => {
      if (resentInterval.current) {
        clearInterval(resentInterval.current)
      }
    }
  }, [])

  const form = useForm({
    initialValues: {
      email: '',
    },
    validate: {
      email: isEmail(t(FIELD_EMAIL_MESSAGE)),
    },
  })

  const handleSubmit = async (values: typeof form.values) => {
    try {
      setLoading(true)

      const resp = await checkAccountExists(values.email)

      if (resp.status && resp.exists) {
        await sendPasswordResetEmailFunc(values.email)
        showNotification({
          message: t`Password reset link has been sent to your email.`,
        })
        setSent(true)
      } else if (resp.status && !resp.exists) {
        form.setFieldError('email', t`Account doesn't exist.`)
      } else {
        form.setFieldError('email', t`An unknown error occurred. Try again later.`)
      }
    } catch (e: any) {
      form.setFieldError('email', e.message || t`An unknown error occurred. Try again later.`)
    }

    setLoading(false)
  }

  const handleResend = async () => {
    if (resentInterval.current) {
      clearInterval(resentInterval.current)
    }

    try {
      setLoading(true)

      await sendPasswordResetEmailFunc(form.values.email)
      setResent(30)
      resentInterval.current = setInterval(() => {
        setResent((prevState) => prevState - 1)
      }, 1000)
      showNotification({
        message: t`Password reset link has been sent to your email.`,
      })
    } catch (e: any) {
      showNotification({
        message: e.message || t`An unknown error occurred. Try again later.`,
        color: 'red',
      })
    }

    setLoading(false)
  }

  return (
    <AuthLayout title={t`Forgot password?`} description={t`Reset Your Password`}>
      {sent ? (
        <Stack>
          <PageTitle>
            <Trans>Check your email</Trans>
          </PageTitle>

          <Text className="text-lg text-center">
            <Trans>We sent a verification link to</Trans> <span className="font-semibold">{form.values.email}</span>
          </Text>

          <Text className="text-lg text-center">
            <Trans>Please click the verification link to access the password reset form.</Trans>
          </Text>

          <Group className="justify-center" gap={8} mb={16}>
            <Text className="text-lg text-center">
              <Trans>Didn’t receive the email?</Trans>
            </Text>

            {resent > 0 ? (
              <Text className="text-lg text-center">
                <span className="font-semibold">
                  <Trans>Resend link in</Trans> 00:{padStart(String(resent), 2, '0')}
                </span>
              </Text>
            ) : (
              <Text className="text-lg text-center">
                <Anchor component="button" fz={18} fw={600} onClick={handleResend} disabled={loading}>
                  <Trans>Click to resend</Trans>
                </Anchor>
              </Text>
            )}
          </Group>

          <Group className="justify-center" mt={16}>
            <Button component={Link} href="/login" loading={loading}>
              <Trans>Back to Log In</Trans>
            </Button>
          </Group>
        </Stack>
      ) : (
        <Stack>
          <PageTitle>
            <Trans>Reset Your Password</Trans>
          </PageTitle>

          <Text className="text-lg text-center" mb={16}>
            <Trans>
              Enter the email address for your account and we’ll send you a temporary link to reset your password.
            </Trans>
          </Text>

          <form onSubmit={form.onSubmit(handleSubmit)}>
            <Stack>
              <TextInput
                type="email"
                name="email"
                placeholder={t`Email`}
                autoFocus
                withAsterisk
                {...form.getInputProps('email')}
              />

              <Group className="justify-end">
                <Anchor component={Link} href="/login" className="text-lg">
                  <Trans>Sign In</Trans>
                </Anchor>
              </Group>

              <Group className="justify-center" mt={16}>
                <Button type="submit" loading={loading} miw={200}>
                  <Trans>Send Reset Email</Trans>
                </Button>
              </Group>
            </Stack>
          </form>
        </Stack>
      )}
    </AuthLayout>
  )
}

export default ForgotPage
