import { signIn, signOut } from 'next-auth/react'
import AuthLayout from '@/components/Layout/AuthLayout'
import PageTitle from '@/components/Title/PageTitle'
import { FIELD_EMAIL_MESSAGE, FIELD_REQUIRED_MESSAGE } from '@/utils/const'
import { Trans, useLingui } from '@lingui/react/macro'
import { Anchor, Button, Group, PasswordInput, Stack, Text, TextInput } from '@mantine/core'
import { isEmail, isNotEmpty, useForm } from '@mantine/form'
import { showNotification } from '@mantine/notifications'
import Link from 'next/link'
import { useRouter } from 'next/router'
import { FC, useState } from 'react'

interface Props {}

const LoginPage: FC<Props> = () => {
  const { t } = useLingui()
  const router = useRouter()
  const [loading, setLoading] = useState(false)

  const form = useForm({
    initialValues: {
      email: '',
      password: '',
    },
    validate: {
      email: isEmail(t(FIELD_EMAIL_MESSAGE)),
      password: isNotEmpty(t(FIELD_REQUIRED_MESSAGE)),
    },
  })

  const handleSubmit = async (values: typeof form.values) => {
    try {
      setLoading(true)

      const result = await signIn('credentials', {
        email: values.email,
        password: values.password,
        redirect: false,
      })

      if (result?.error) {
        if (result.error === 'User not found') {
          form.setFieldError('email', t`User not found`)
        } else if (result.error === 'Invalid password') {
          form.setFieldError('password', t`Wrong password`)
        } else {
          form.setFieldError('password', t`Wrong email or password`)
        }
        return
      }

      if (result?.ok) {
        showNotification({
          message: t`Successfully signed in!`,
          color: 'green',
        })

        const redirectUrl = (router.query.url as string) || (router.query.callbackUrl as string)

        if (redirectUrl) {
          location.href = redirectUrl
        } else {
          location.href = '/user/my-account'
        }
      }
    } catch (error: any) {
      console.error('Login error:', error)
      form.setFieldError('password', t`An error occurred during sign in`)
      showNotification({
        message: t`An error occurred during sign in`,
        color: 'red',
      })
    } finally {
      setLoading(false)
    }
  }

  return (
    <AuthLayout title={t`Sign In`} description={t`Sign in to your account`}>
      <Stack>
        <PageTitle>
          <Trans>Sign in to your account</Trans>
        </PageTitle>

        <Group className="justify-center text-center" gap={8} mb={16}>
          <Text className="text-lg">
            <Trans>New to ACPT?</Trans>
          </Text>

          <Anchor
            component={Link}
            href={{
              pathname: '/signup',
              query: router.query,
            }}
            className="text-lg"
          >
            <Trans>Create an Account</Trans>
          </Anchor>
        </Group>

        <form onSubmit={form.onSubmit(handleSubmit)}>
          <Stack>
            <TextInput
              type="email"
              name="email"
              placeholder={t`Email Address`}
              autoFocus
              withAsterisk
              {...form.getInputProps('email')}
            />

            <PasswordInput name="password" placeholder={t`Password`} withAsterisk {...form.getInputProps('password')} />

            <Group className="justify-end">
              <Anchor component={Link} href="/forgot-password" className="text-lg">
                <Trans>Forgot password?</Trans>
              </Anchor>
            </Group>

            <Group className="justify-center" mt={16}>
              <Button type="submit" loading={loading} miw={200}>
                <Trans>Sign In</Trans>
              </Button>
            </Group>
          </Stack>
        </form>
      </Stack>
    </AuthLayout>
  )
}

export default LoginPage
