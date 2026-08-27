import { UserDetail } from '@/types/user'
import { FIELD_EMAIL_MESSAGE } from '@/utils/const'
import { useLingui } from '@lingui/react/macro'
import { Button, Group, Stack, TextInput } from '@mantine/core'
import { isEmail, isNotEmpty, useForm } from '@mantine/form'
import { showNotification } from '@mantine/notifications'
import { FC, useState } from 'react'

interface Props {
  userId: string
  data: UserDetail
  onClose: () => void
  onSuccess: () => void
}

const UserEdit: FC<Props> = ({ userId, data, onClose, onSuccess }) => {
  const { t } = useLingui()
  const [loading, setLoading] = useState(false)

  const form = useForm({
    initialValues: {
      uid: userId,
      firstName: data.firstName || '',
      lastName: data.lastName || '',
      email: data.email || '',
    },
    validate: {
      firstName: isNotEmpty(t(FIELD_EMAIL_MESSAGE)),
      lastName: isNotEmpty(t(FIELD_EMAIL_MESSAGE)),
      email: isEmail(t(FIELD_EMAIL_MESSAGE)),
    },
  })

  const handleSubmit = async (values: typeof form.values) => {
    setLoading(true)

    try {
      const res = await fetch(process.env.NEXT_PUBLIC_UPDATE_USER as string, {
        method: 'POST',
        headers: {
          Accept: 'application/json, text/plain, */*',
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(values),
      })

      if (res.ok) {
        showNotification({
          message: t`User updated successfully!`,
          color: 'green',
        })
        onSuccess()
      } else {
        showNotification({
          message: t`Failed to update user.`,
          color: 'red',
        })
      }
    } catch (e: any) {
      showNotification({
        message: e.message,
        color: 'red',
      })
    }

    setLoading(false)
  }

  return (
    <form onSubmit={form.onSubmit(handleSubmit)} className="flex-1">
      <Stack maw={400}>
        <Group>
          <TextInput placeholder="First Name" className="flex-1" {...form.getInputProps('firstName')} />

          <TextInput placeholder="Last Name" className="flex-1" {...form.getInputProps('lastName')} />
        </Group>

        <TextInput type="email" name="email" placeholder="Email Address" {...form.getInputProps('email')} />

        <Group>
          <Button variant="outline" onClick={onClose} disabled={loading}>
            Cancel
          </Button>

          <Button type="submit" loading={loading}>
            Update
          </Button>
        </Group>
      </Stack>
    </form>
  )
}

export default UserEdit
