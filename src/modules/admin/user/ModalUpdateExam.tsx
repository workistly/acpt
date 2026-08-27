import { updateCollection } from '@/api/transactions'
import { UserHistory } from '@/types/history'
import { FIELD_REQUIRED_MESSAGE } from '@/utils/const'
import { Trans, useLingui } from '@lingui/react/macro'
import { Button, Divider, Group, NumberInput, Select, Stack } from '@mantine/core'
import { isNotEmpty, useForm } from '@mantine/form'
import { showNotification } from '@mantine/notifications'
import { FC, useState } from 'react'

interface Props {
  data: UserHistory
  onClose: () => void
  onSuccess: () => void
}

const ModalUpdateExam: FC<Props> = ({ data, onClose, onSuccess }) => {
  const { t } = useLingui()
  const [loading, setLoading] = useState(false)

  const form = useForm({
    initialValues: {
      score: data.score,
      payment: data.payment,
    },
    validate: {
      score: isNotEmpty(t(FIELD_REQUIRED_MESSAGE)),
    },
  })

  const handleSubmit = async (values: typeof form.values) => {
    setLoading(true)

    try {
      await updateCollection('exams_completed', data.docId, values)

      showNotification({
        message: t`Exam updated successfully!`,
        color: 'green',
      })

      onSuccess()
      onClose()
    } catch (error: any) {
      showNotification({
        message: error.message,
        color: 'red',
      })
    }

    setLoading(false)
  }

  return (
    <form onSubmit={form.onSubmit(handleSubmit)}>
      <Stack>
        <Group>
          <NumberInput min={0} max={100} allowDecimal={false} {...form.getInputProps('score')} />

          <Select data={['Paid', 'Unpaid']} {...form.getInputProps('payment')} />
        </Group>

        <Divider />

        <Group className="justify-between">
          <Button variant="outline" onClick={onClose}>
            <Trans>Cancel</Trans>
          </Button>

          <Button type="submit" loading={loading}>
            <Trans>Update</Trans>
          </Button>
        </Group>
      </Stack>
    </form>
  )
}

export default ModalUpdateExam
