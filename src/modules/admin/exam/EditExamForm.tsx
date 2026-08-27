import { updateCollection } from '@/api/transactions'
import ExamForm from '@/modules/admin/exam/ExamForm'
import { ExamPayload } from '@/types/exam'
import { FIELD_REQUIRED_MESSAGE } from '@/utils/const'
import { Trans, useLingui } from '@lingui/react/macro'
import { Button, Divider, Group, Stack } from '@mantine/core'
import { isNotEmpty, useForm } from '@mantine/form'
import { showNotification } from '@mantine/notifications'
import { FC, useState } from 'react'

interface Props {
  docId: string
  data: ExamPayload
  onClose: () => void
  onSuccess: () => void
}

const EditExamForm: FC<Props> = ({ docId, data, onClose, onSuccess }) => {
  const { t } = useLingui()
  const [loading, setLoading] = useState(false)

  const form = useForm<ExamPayload>({
    initialValues: data,
    validate: {
      language: isNotEmpty(t(FIELD_REQUIRED_MESSAGE)),
      number_of_questions: isNotEmpty(t(FIELD_REQUIRED_MESSAGE)),
      timer: isNotEmpty(t(FIELD_REQUIRED_MESSAGE)),
      price: isNotEmpty(t(FIELD_REQUIRED_MESSAGE)),
    },
  })

  const handleSubmit = async (values: typeof form.values) => {
    setLoading(true)

    try {
      await updateCollection('exams', docId, values)

      showNotification({
        message: 'Exam updated successfully!',
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
        <ExamForm form={form} />

        <Divider />

        <Group className="justify-between">
          <Button variant="outline" onClick={onClose}>
            <Trans>Cancel</Trans>
          </Button>

          <Button type="submit" loading={loading}>
            <Trans>Save</Trans>
          </Button>
        </Group>
      </Stack>
    </form>
  )
}

export default EditExamForm
