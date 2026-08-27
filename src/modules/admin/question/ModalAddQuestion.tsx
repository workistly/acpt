import { addDocInCollection } from '@/api/exam'
import QuestionForm from '@/modules/admin/question/QuestionForm'
import { QuestionPayload } from '@/types/question'
import { FIELD_REQUIRED_MESSAGE } from '@/utils/const'
import { Trans, useLingui } from '@lingui/react/macro'
import { Button, Divider, Group, Stack, Text } from '@mantine/core'
import { isNotEmpty, useForm } from '@mantine/form'
import { showNotification } from '@mantine/notifications'
import { FC, useState } from 'react'

interface Props {
  questionLanguageMap: any
  onClose: () => void
  onSuccess: () => Promise<void>
}

const ModalAddQuestion: FC<Props> = ({ questionLanguageMap, onClose, onSuccess }) => {
  const { t } = useLingui()
  const [loading, setLoading] = useState(false)
  const [currentLanguage, setCurrentLanguage] = useState('')
  const [success, setSuccess] = useState(false)

  const form = useForm<QuestionPayload>({
    initialValues: {
      question: '',
      answer1: '',
      answer2: '',
      answer3: '',
      answer4: '',
      correctAnswer: '',
      language: 'English',
      is_archived: false,
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
      await addDocInCollection('exams_questions', values)

      showNotification({
        message: 'Question added successfully!',
        color: 'green',
      })

      await onSuccess()

      const language = form.values.language || 'English'

      setCurrentLanguage(language)
      form.reset()
      form.setFieldValue('language', language)
      setSuccess(true)
    } catch (error: any) {
      showNotification({
        message: error.message,
        color: 'red',
      })
    }

    setLoading(false)
  }

  if (success)
    return (
      <Stack>
        <Text fw={700}>Question Added</Text>

        <Text>
          There are now {questionLanguageMap[currentLanguage].length} Questions in {currentLanguage}
        </Text>

        <Divider />

        <Group className="justify-between">
          <Button variant="outline" onClick={onClose}>
            Question Bank
          </Button>

          <Button type="submit" onClick={() => setSuccess(false)}>
            Add Another Question
          </Button>
        </Group>
      </Stack>
    )

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
            <Trans>Add</Trans>
          </Button>
        </Group>
      </Stack>
    </form>
  )
}

export default ModalAddQuestion
