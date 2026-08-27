import { deleteDocument } from '@/api/doc'
import { updateCollection } from '@/api/transactions'
import ModalEditQuestion from '@/modules/admin/question/ModalEditQuestion'
import { Question } from '@/types/question'
import { Accordion, Button, Group, Modal, Stack, Text } from '@mantine/core'
import { useDisclosure } from '@mantine/hooks'
import { modals } from '@mantine/modals'
import { showNotification } from '@mantine/notifications'
import { FC, useState } from 'react'

interface Props {
  data: Question
  onSuccess: () => void
}

const QuestionItem: FC<Props> = ({ data, onSuccess }) => {
  const [loading, setLoading] = useState(false)
  const [showEdit, showEditHandlers] = useDisclosure(false)

  const handleDelete = async () => {
    modals.openConfirmModal({
      title: `Confirm`,
      children: `Are you sure you want to delete this question?`,
      labels: {
        confirm: `Delete`,
        cancel: `Cancel`,
      },
      cancelProps: {
        variant: 'outline',
      },
      onConfirm: async () => {
        setLoading(true)

        try {
          await deleteDocument('exams_questions', data.docId)

          showNotification({
            message: 'Question deleted successfully!',
            color: 'green',
          })

          onSuccess()
        } catch (e: any) {
          showNotification({
            message: e.message,
            color: 'red',
          })
        }

        setLoading(false)
      },
    })
  }

  const handleRestore = async () => {
    modals.openConfirmModal({
      title: `Confirm`,
      children: `Are you sure you want to restore this question?`,
      labels: {
        confirm: `Restore`,
        cancel: `Cancel`,
      },
      cancelProps: {
        variant: 'outline',
      },
      onConfirm: async () => {
        setLoading(true)

        try {
          await updateCollection('exams_questions', data.docId, {
            is_archived: false,
          })

          showNotification({
            message: 'Question restored successfully!',
            color: 'green',
          })

          onSuccess()
        } catch (e: any) {
          showNotification({
            message: e.message,
            color: 'red',
          })
        }

        setLoading(false)
      },
    })
  }

  const handleArchive = async () => {
    modals.openConfirmModal({
      title: `Confirm`,
      children: `Are you sure you want to archive this question?`,
      labels: {
        confirm: `Archive`,
        cancel: `Cancel`,
      },
      cancelProps: {
        variant: 'outline',
      },
      onConfirm: async () => {
        setLoading(true)

        try {
          await updateCollection('exams_questions', data.docId, {
            is_archived: true,
          })

          showNotification({
            message: 'Question archived successfully!',
            color: 'green',
          })

          onSuccess()
        } catch (e: any) {
          showNotification({
            message: e.message,
            color: 'red',
          })
        }

        setLoading(false)
      },
    })
  }

  return (
    <Accordion.Item value={data.docId}>
      <Accordion.Control>{data.question}</Accordion.Control>
      <Accordion.Panel>
        <Stack>
          <Text>A): {data.answer1}</Text>

          <Text>B): {data.answer2}</Text>

          <Text>C): {data.answer3}</Text>

          <Text>D): {data.answer4}</Text>

          <Group>
            <Text>
              <strong>Answer:</strong> (
              {data.correctAnswer === 'answer1'
                ? 'A'
                : data.correctAnswer === 'answer2'
                  ? 'B'
                  : data.correctAnswer === 'answer3'
                    ? 'C'
                    : 'D'}
              ){/*@ts-ignore*/}
              {data[data.correctAnswer]}
            </Text>

            {data.is_archived ? (
              <Group className="ml-auto gap-0">
                <Button variant="subtle" size="sm" color="red" loading={loading} onClick={handleDelete}>
                  Permanently Delete
                </Button>

                <Button variant="subtle" size="sm" loading={loading} onClick={handleRestore}>
                  Restore
                </Button>
              </Group>
            ) : (
              <Group className="ml-auto gap-0">
                <Button variant="subtle" size="sm" loading={loading} onClick={showEditHandlers.open}>
                  Edit
                </Button>

                <Button variant="subtle" size="sm" loading={loading} onClick={handleArchive}>
                  Archive
                </Button>
              </Group>
            )}
          </Group>
        </Stack>

        <Modal opened={showEdit} onClose={showEditHandlers.close} title="Edit question" size="xl">
          <ModalEditQuestion data={data} onClose={showEditHandlers.close} onSuccess={onSuccess} />
        </Modal>
      </Accordion.Panel>
    </Accordion.Item>
  )
}

export default QuestionItem
