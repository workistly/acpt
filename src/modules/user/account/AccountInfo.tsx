import { checkOldPassword, useSignInAuthUserWithEmailAndPassword } from '@/api/auth'
import PageTitle from '@/components/Title/PageTitle'
import { useUser } from '@/contexts/UserProvider'
import { FIELD_EMAIL_MESSAGE, FIELD_REQUIRED_MESSAGE } from '@/utils/const'
import { Trans, useLingui } from '@lingui/react/macro'
import { Button, Group, PasswordInput, Stack, Text, TextInput } from '@mantine/core'
import { isEmail, isNotEmpty, useForm } from '@mantine/form'
import { showNotification } from '@mantine/notifications'
import { FC, useState } from 'react'

interface Props {}

const AccountInfo: FC<Props> = () => {
  const { t } = useLingui()
  const { user, setUser } = useUser()
  const [loading, setLoading] = useState(false)
  const signIn = useSignInAuthUserWithEmailAndPassword()

  const form = useForm({
    initialValues: {
      firstName: user?.firstName || '',
      lastName: user?.lastName || '',
      email: user?.email || '',
      oldPassword: '',
      newPassword: '',
    },
    validate: {
      firstName: isNotEmpty(t(FIELD_EMAIL_MESSAGE)),
      lastName: isNotEmpty(t(FIELD_REQUIRED_MESSAGE)),
      email: isEmail(t(FIELD_EMAIL_MESSAGE)),
    },
  })

  const handleSubmit = async (values: typeof form.values) => {
    if (values.newPassword && values.newPassword.length < 8) {
      form.setFieldError('oldPassword', t`Password must be at least 8 characters long`)
      return
    }

    if (values.newPassword && !values.oldPassword) {
      form.setFieldError('oldPassword', t`Old password is required to change your password`)
      return
    }

    if (values.oldPassword && values.newPassword) {
      try {
        setLoading(true)
        await checkOldPassword(user.email as string, values.oldPassword)
      } catch (e: any) {
        form.setFieldError('oldPassword', t`Old password is incorrect`)
        setLoading(false)
        return null
      }
    }

    try {
      setLoading(true)

      const resp = await fetch(process.env.NEXT_PUBLIC_UPDATE_USER as string, {
        method: 'POST',
        headers: {
          Accept: 'application/json, text/plain, */*',
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          uid: user?.id,
          firstName: values.firstName,
          lastName: values.lastName,
          email: values.email,
          password: !values.newPassword ? null : values.newPassword,
        }),
      })
      const data = await resp.json()

      if (data.status) {
        showNotification({
          message: t`Your account information has been updated successfully.`,
          color: 'green',
        })

        if (values.newPassword !== '') {
          await signIn(values.email, values.newPassword)
        } else {
          setUser({
            firstName: values.firstName,
            lastName: values.lastName,
            email: values.email,
            id: user?.id as string,
            type: user.type || 'user',
            provider: user.provider as string,
            examsCompleted: user.examsCompleted,
            examsAttempted: user.examsAttempted,
            imgId: user.imgId,
            imgUrl: user.imgUrl,
          })
        }

        form.setFieldValue('oldPassword', '')
        form.setFieldValue('newPassword', '')
      }
    } catch (e: any) {
      showNotification({
        message: e.message || t`An error occurred while updating your account information.`,
        color: 'red',
      })
    }

    setLoading(false)
  }

  return (
    <form onSubmit={form.onSubmit(handleSubmit)}>
      <Stack maw={600}>
        <Group>
          <PageTitle>
            <Trans>Personal Information</Trans>
          </PageTitle>
        </Group>

        <Text className="text-lg mt-6">
          <Trans>GENERAL INFO</Trans>
        </Text>

        <TextInput name="firstName" placeholder={t`First Name`} {...form.getInputProps('firstName')} />

        <TextInput name="lastName" placeholder={t`Last Name`} {...form.getInputProps('lastName')} />

        <TextInput type="email" name="email" placeholder={t`Email Address`} {...form.getInputProps('email')} />

        <Text className="text-lg mt-6">
          <Trans>CHANGE PASSWORD</Trans>
        </Text>

        <PasswordInput
          name="oldPassword"
          placeholder={t`Old Password`}
          autoComplete="current-password"
          {...form.getInputProps('oldPassword')}
        />

        <PasswordInput
          name="newPassword"
          placeholder={t`New Password`}
          autoComplete="new-password"
          {...form.getInputProps('newPassword')}
        />

        <Text>
          <Trans>Must be at least 8 characters</Trans>
        </Text>

        <Group>
          <Button type="submit" loading={loading}>
            <Trans>Save Changes</Trans>
          </Button>
        </Group>
      </Stack>
    </form>
  )
}

export default AccountInfo
