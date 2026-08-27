import { getAllDocs } from '@/api/doc'
import { ExamPayload } from '@/types/exam'
import { LANGUAGES } from '@/utils/const'
import { Loader, NumberInput, Select } from '@mantine/core'
import { UseFormReturnType } from '@mantine/form'
import { FC, useEffect, useMemo, useState } from 'react'

interface Props {
  form: UseFormReturnType<ExamPayload>
}

const ExamForm: FC<Props> = ({ form }) => {
  const [loading, setLoading] = useState(true)
  const [questionLanguageMap, setQuestionLanguageMap] = useState<any>({})

  const getQuestions = async () => {
    const resp = await getAllDocs('exams_questions')
    if (resp.status && resp.fullData.length > 0) {
      const obj: any = {}
      resp.fullData.forEach((question: any) => {
        obj[question.language] = obj[question.language] ? [...obj[question.language], question] : [question]
      })
      setQuestionLanguageMap(obj)
    }

    setLoading(false)
  }

  useEffect(() => {
    getQuestions()
  }, [])

  const options = useMemo(
    () =>
      LANGUAGES.map((el) => ({
        label: questionLanguageMap[el.label]
          ? `${el.label} (${questionLanguageMap[el.label]?.length} questions available)`
          : el.label,
        value: el.label,
      })),
    [questionLanguageMap],
  )

  return (
    <>
      <Select
        label="Exam Language"
        data={options}
        placeholder="Language"
        rightSection={loading ? <Loader size="xs" /> : undefined}
        {...form.getInputProps('language')}
        onChange={(e) => {
          form.setFieldValue('language', e)
          form.setFieldValue('number_of_questions', '')
        }}
      />

      <NumberInput
        label="Number of Questions"
        min={1}
        max={form.values.language ? questionLanguageMap[form.values.language]?.length : undefined}
        allowDecimal={false}
        hideControls={false}
        disabled={!form.values.language}
        {...form.getInputProps('number_of_questions')}
      />

      <NumberInput
        label="Exam Timer"
        min={1}
        allowDecimal={false}
        hideControls={false}
        suffix="min"
        {...form.getInputProps('timer')}
      />

      <NumberInput label="Exam Price" min={0} prefix="$" {...form.getInputProps('price')} />
    </>
  )
}

export default ExamForm
