import { addDocInCollection, queryData } from '@/api/exam'
import ExamForm from '@/modules/admin/exam/ExamForm'
import { ExamPayload } from '@/types/exam'
import { FIELD_REQUIRED_MESSAGE } from '@/utils/const'
import { Trans, useLingui } from '@lingui/react/macro'
import { Button, Divider, Group, Stack } from '@mantine/core'
import { isNotEmpty, useForm } from '@mantine/form'
import { showNotification } from '@mantine/notifications'
import { FC, useEffect, useState } from 'react'

interface Props {
  onClose: () => void
  onSuccess: () => void
}

const ModalAddExam: FC<Props> = ({ onClose, onSuccess }) => {
  const { t } = useLingui()
  const [loading, setLoading] = useState(false)
  const [examsFetched, setExamsFetched] = useState<ExamPayload[]>([])

  const form = useForm<ExamPayload>({
    initialValues: {
      language: null,
      number_of_questions: '',
      timer: '',
      price: '',
      exam_detail_1: '',
      exam_detail_2: '',
      exam_detail_3: '',
      title: '',
      second_title: '',
      thing_rem_1: '',
      thing_rem_2: '',
      thing_rem_3: '',
      exam_image: '',
      is_archived: false,
      is_active: true,
      created: '',
    },
    validate: {
      language: isNotEmpty(t(FIELD_REQUIRED_MESSAGE)),
      number_of_questions: isNotEmpty(t(FIELD_REQUIRED_MESSAGE)),
      timer: isNotEmpty(t(FIELD_REQUIRED_MESSAGE)),
      price: isNotEmpty(t(FIELD_REQUIRED_MESSAGE)),
    },
  })

  const getCurrentLanguageExams = async () => {
    setLoading(true)
    const resp = await queryData('exams', 'language', form.values.language)
    if (resp.status && resp.fullData.length > 0) {
      const options = resp.fullData.map((option: any) => option)
      setExamsFetched(options)
      setLoading(false)
    }
  }

  useEffect(() => {
    if (form.values.language) getCurrentLanguageExams()
  }, [form.values.language])

  const handleSubmit = async (values: typeof form.values) => {
    setLoading(true)

    const isActivePlan = !examsFetched.find((item) => item.is_active)

    try {
      await addDocInCollection('exams', {
        ...values,
        is_active: isActivePlan,
        created: new Date().toISOString(),
      })

      showNotification({
        message: 'Exam added successfully',
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
            <Trans>Add</Trans>
          </Button>
        </Group>
      </Stack>
    </form>
  )
}

export default ModalAddExam
