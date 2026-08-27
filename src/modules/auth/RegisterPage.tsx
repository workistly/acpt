import { signIn } from 'next-auth/react'
import AuthLayout from '@/components/Layout/AuthLayout'
import PageTitle from '@/components/Title/PageTitle'
import { FIELD_EMAIL_MESSAGE } from '@/utils/const'
import { Trans, useLingui } from '@lingui/react/macro'
import { Anchor, Button, Group, PasswordInput, Stack, Text, TextInput } from '@mantine/core'
import { isEmail, useForm } from '@mantine/form'
import { showNotification } from '@mantine/notifications'
import Link from 'next/link'
import { useRouter } from 'next/router'
import { FC, useState } from 'react'

interface Props {}

const RegisterPage: FC<Props> = () => {
  const { t } = useLingui()
  const router = useRouter()
  const [loading, setLoading] = useState(false)

  const form = useForm({
    initialValues: {
      firstName: '',
      lastName: '',
      email: '',
      password: '',
      confirmPassword: '',
    },
    validate: {
      firstName: (value) => (value.trim().length < 1 ? t`First name is required` : null),
      lastName: (value) => (value.trim().length < 1 ? t`Last name is required` : null),
      email: isEmail(t(FIELD_EMAIL_MESSAGE)),
      password: (value) => (value.length < 8 ? t`Password must have at least 8 characters` : null),
      confirmPassword: (value, values) => (value !== values.password ? t`Passwords did not match` : null),
    },
  })

  const handleSubmit = async (values: typeof form.values) => {
    try {
      setLoading(true)

      const response = await fetch('/api/auth/signup', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email: values.email,
          password: values.password,
          firstName: values.firstName,
          lastName: values.lastName,
        }),
      })

      const data = await response.json()

      if (!response.ok) {
        if (response.status === 409) {
          form.setFieldError('email', t`An account already exists with this E-mail address - please log in.`)
        } else {
          throw new Error(data.error || t`An error occurred while creating your account.`)
        }
        return
      }

      const signInResult = await signIn('credentials', {
        email: values.email,
        password: values.password,
        redirect: false,
      })

      if (signInResult?.error) {
        throw new Error(t`Account created but sign in failed. Please try logging in.`)
      }

      location.href = (router.query.url as string) || '/user/my-account'
    } catch (e: any) {
      showNotification({
        message: e.message || t`An error occurred while creating your account.`,
        color: 'red',
      })
    } finally {
      setLoading(false)
    }
  }

  return (
    <AuthLayout title={t`Create Account`} description={t`Create your account`}>
      <Stack>
        <PageTitle>
          <Trans>Create your account</Trans>
        </PageTitle>

        <Group className="justify-center text-center" gap={8} mb={16}>
          <Text className="text-lg">
            <Trans>Already have an account?</Trans>
          </Text>

          <Anchor
            component={Link}
            href={{
              pathname: '/login',
              query: router.query,
            }}
            className="text-lg"
          >
            <Trans>Sign In</Trans>
          </Anchor>
        </Group>

        <form onSubmit={form.onSubmit(handleSubmit)}>
          <Stack>
            <TextInput
              name="firstName"
              placeholder={t`First Name`}
              autoFocus
              withAsterisk
              {...form.getInputProps('firstName')}
            />

            <TextInput name="lastName" placeholder={t`Last Name`} withAsterisk {...form.getInputProps('lastName')} />

            <TextInput type="email" name="email" placeholder={t`Email`} withAsterisk {...form.getInputProps('email')} />

            <PasswordInput name="password" placeholder={t`Password`} withAsterisk {...form.getInputProps('password')} />

            <PasswordInput
              name="confirmPassword"
              placeholder={t`Confirm Password`}
              withAsterisk
              {...form.getInputProps('confirmPassword')}
            />

            <Group className="justify-center" mt={16}>
              <Button type="submit" loading={loading} miw={200}>
                <Trans>Create Account</Trans>
              </Button>
            </Group>
          </Stack>
        </form>
      </Stack>
    </AuthLayout>
  )
}

export default RegisterPage
