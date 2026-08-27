import { deleteDocument } from '@/api/doc'
import { queryData } from '@/api/exam'
import { deleteTransaction } from '@/api/transactions'
import ModalUpdateExam from '@/modules/admin/user/ModalUpdateExam'
import { UserHistory } from '@/types/history'
import { ActionIcon, Menu, Modal } from '@mantine/core'
import { useDisclosure } from '@mantine/hooks'
import { modals } from '@mantine/modals'
import { showNotification } from '@mantine/notifications'
import { IconDots } from '@tabler/icons-react'
import { FC, useState } from 'react'

interface Props {
  data: UserHistory
  onSuccess: () => void
}

const UserExamTableActions: FC<Props> = ({ data, onSuccess }) => {
  const [showEdit, showEditHandlers] = useDisclosure(false)
  const [loading, setLoading] = useState(false)

  const handleRefund = async () => {
    modals.openConfirmModal({
      title: `Confirm`,
      children: `Are you sure you want to refund this exam?`,
      labels: {
        confirm: `Refund`,
        cancel: `Cancel`,
      },
      cancelProps: {
        variant: 'outline',
      },
      onConfirm: async () => {
        try {
          setLoading(true)
          const response = await queryData('certificates', 'examId', data.docId)
          if (response.status && response.fullData.length > 0) {
            const certData = response.data

            const certNumber = certData.certificateNumber
            const resp = await queryData('transactions', 'certificateNumber', certNumber.toString())

            setLoading(false)

            if (resp.status && resp.fullData.length > 0) {
              const transaction = resp.data

              const res = await fetch(process.env.NEXT_PUBLIC_REFUND_PAYMENT as string, {
                method: 'POST',
                headers: {
                  Accept: 'application/json, text/plain, */*',
                  'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                  paymentIntent: transaction.transactionId,
                }),
              })

              if (res.ok) {
                await deleteTransaction(certData.docId, transaction.docId, data.docId)

                onSuccess()

                showNotification({
                  message: 'Refund successful',
                  color: 'green',
                })
              } else {
                showNotification({
                  message: 'Refund Failed.',
                  color: 'red',
                })
              }
            } else {
              showNotification({
                message: 'Refund Failed.',
                color: 'red',
              })
            }
          } else {
            showNotification({
              message: 'Refund Failed.',
              color: 'red',
            })
          }
        } catch (e: any) {
          showNotification({
            message: e.message,
            color: 'red',
          })
        }
      },
    })
  }

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
        try {
          await deleteDocument('exams_completed', data.docId)
          showNotification({
            message: 'Exam deleted successfully!',
            color: 'green',
          })
        } catch (e: any) {
          showNotification({
            message: e.message,
            color: 'red',
          })
        }
      },
    })
  }

  return (
    <Menu>
      <Menu.Target>
        <ActionIcon variant="subtle" loading={loading}>
          <IconDots />
        </ActionIcon>
      </Menu.Target>

      <Menu.Dropdown>
        <Menu.Item onClick={showEditHandlers.toggle}>Edit</Menu.Item>

        <Menu.Item onClick={handleRefund}>Refund</Menu.Item>

        <Menu.Item color="red" onClick={handleDelete}>
          Delete
        </Menu.Item>
      </Menu.Dropdown>

      <Modal opened={showEdit} onClose={showEditHandlers.close} title="Edit Exam">
        <ModalUpdateExam data={data} onSuccess={onSuccess} onClose={showEditHandlers.close} />
      </Modal>
    </Menu>
  )
}

export default UserExamTableActions
