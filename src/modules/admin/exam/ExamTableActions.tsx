import { deleteDocument } from '@/api/doc'
import { updateCollection } from '@/api/transactions'
import ModalEditExam from '@/modules/admin/exam/ModalEditExam'
import { Exam } from '@/types/exam'
import { ActionIcon, Anchor, Group, Menu, Modal, Switch } from '@mantine/core'
import { useDisclosure } from '@mantine/hooks'
import { modals } from '@mantine/modals'
import { showNotification } from '@mantine/notifications'
import { IconDots } from '@tabler/icons-react'
import { FC, useState } from 'react'

interface Props {
  examsFetched: any[]
  data: Exam
  onSuccess: () => void
}

const ExamTableActions: FC<Props> = ({ examsFetched, data, onSuccess }) => {
  const [showEdit, showEditHandlers] = useDisclosure(false)
  const [loading, setLoading] = useState(false)

  const handleDelete = async () => {
    modals.openConfirmModal({
      title: `Confirm`,
      children: `Are you sure you want to delete this exam?`,
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
          await deleteDocument('exams', data.docId)

          showNotification({
            message: 'Exam deleted successfully!',
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
      children: `Are you sure you want to restore this exam?`,
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
          await updateCollection('exams', data.docId, { is_archived: false })

          showNotification({
            message: 'Exam restored successfully!',
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
      children: `Are you sure you want to archive this exam?`,
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
          await updateCollection('exams', data.docId, { is_archived: true, is_active: false })

          showNotification({
            message: 'Exam archived successfully!',
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

  const handleActive = async () => {
    try {
      const examLanguage = data.testLanguage
      const hasActiveExam = examsFetched.find((item) => item.language === examLanguage && item.is_active === true)

      if (hasActiveExam && !data.isActive) {
        showNotification({
          message: `Only one exam of each language can be Active.`,
          color: 'red',
        })
      } else {
        const message = !data.isActive ? 'Activated' : 'Deactivated'
        await updateCollection('exams', data.docId, { is_active: !data.isActive })

        showNotification({
          message: `Exam has been ${message} successfully.`,
          color: 'green',
        })

        onSuccess()
      }
    } catch (e: any) {}
  }

  return (
    <Group className="flex-nowrap">
      <Anchor onClick={showEditHandlers.open}>Edit Exam</Anchor>

      <Modal opened={showEdit} onClose={showEditHandlers.close} title="Edit Exam">
        <ModalEditExam data={data} onClose={showEditHandlers.close} onSuccess={onSuccess} />
      </Modal>

      <Menu>
        <Menu.Target>
          <ActionIcon variant="subtle" loading={loading}>
            <IconDots />
          </ActionIcon>
        </Menu.Target>

        <Menu.Dropdown>
          {data.isArchived ? (
            <>
              <Menu.Item onClick={handleRestore}>Restore</Menu.Item>

              <Menu.Item color="red" onClick={handleDelete}>
                Permanently Delete
              </Menu.Item>
            </>
          ) : (
            <>
              <Menu.Item rightSection={<Switch checked={data.isActive} />} onClick={handleActive}>
                Active
              </Menu.Item>

              <Menu.Item onClick={handleDelete}>Delete</Menu.Item>

              <Menu.Item onClick={handleArchive}>Archive</Menu.Item>
            </>
          )}
        </Menu.Dropdown>
      </Menu>
    </Group>
  )
}

export default ExamTableActions
