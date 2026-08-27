import { updateCollection } from '@/api/transactions'
import QuestionForm from '@/modules/admin/question/QuestionForm'
import { Question, QuestionPayload } from '@/types/question'
import { FIELD_REQUIRED_MESSAGE } from '@/utils/const'
import { Trans, useLingui } from '@lingui/react/macro'
import { Button, Divider, Group, Stack } from '@mantine/core'
import { isNotEmpty, useForm } from '@mantine/form'
import { showNotification } from '@mantine/notifications'
import { FC, useState } from 'react'

interface Props {
  data: Question
  onClose: () => void
  onSuccess: () => void
}

const ModalEditQuestion: FC<Props> = ({ data, onClose, onSuccess }) => {
  const { t } = useLingui()
  const [loading, setLoading] = useState(false)

  const form = useForm<QuestionPayload>({
    initialValues: {
      question: data.question,
      answer1: data.answer1,
      answer2: data.answer2,
      answer3: data.answer3,
      answer4: data.answer4,
      correctAnswer: data.correctAnswer,
      language: data.language,
      is_archived: data.is_archived,
    },
    validate: {
      question: isNotEmpty(t(FIELD_REQUIRED_MESSAGE)),
      answer1: isNotEmpty(t(FIELD_REQUIRED_MESSAGE)),
      answer2: isNotEmpty(t(FIELD_REQUIRED_MESSAGE)),
      answer3: isNotEmpty(t(FIELD_REQUIRED_MESSAGE)),
      answer4: isNotEmpty(t(FIELD_REQUIRED_MESSAGE)),
      correctAnswer: isNotEmpty(t(FIELD_REQUIRED_MESSAGE)),
    },
  })

  const handleSubmit = async (values: typeof form.values) => {
    setLoading(true)

    try {
      await updateCollection('exams_questions', data.docId, values)

      showNotification({
        message: 'Question updated successfully!',
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
        <QuestionForm form={form} />

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

export default ModalEditQuestion
