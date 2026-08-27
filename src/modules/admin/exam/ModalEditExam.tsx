import { getDocument } from '@/api/doc'
import EditExamForm from '@/modules/admin/exam/EditExamForm'
import { Exam, ExamPayload } from '@/types/exam'
import { Center, Loader, Text } from '@mantine/core'
import { FC, useEffect, useState } from 'react'

interface Props {
  data: Exam
  onClose: () => void
  onSuccess: () => void
}

const ModalEditExam: FC<Props> = ({ data, onClose, onSuccess }) => {
  const [loading, setLoading] = useState(true)
  const [selectedExam, setSelectedExam] = useState<ExamPayload>()

  const getExam = async () => {
    const resp = await getDocument(data.docId, 'exams')
    if (resp.status && resp.exists) {
      setSelectedExam(resp.data as ExamPayload)
      setLoading(false)
    }
  }

  useEffect(() => {
    getExam()
  }, [])

  if (loading)
    return (
      <Center h={300}>
        <Loader size="xl" />
      </Center>
    )

  if (!selectedExam) return <Text>Not found</Text>

  return <EditExamForm docId={data.docId} data={selectedExam} onClose={onClose} onSuccess={onSuccess} />
}

export default ModalEditExam
