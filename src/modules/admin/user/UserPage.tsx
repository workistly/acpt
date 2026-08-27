import { deleteDocument, deleteDocumentQuery, getDocument } from '@/api/doc'
import { updateCollection } from '@/api/transactions'
import AdminLayout from '@/components/Layout/AdminLayout'
import AppHead from '@/components/Layout/AppHead'
import PageLoader from '@/components/Loader/PageLoader'
import { useUser } from '@/contexts/UserProvider'
import useLoginRedirect from '@/hooks/useLoginRedirect'
import UserEdit from '@/modules/admin/user/UserEdit'
import UserExamTable from '@/modules/admin/user/UserExamTable'
import { UserDetail } from '@/types/user'
import { useLingui } from '@lingui/react/macro'
import {
  ActionIcon,
  Anchor,
  Badge,
  Button,
  Card,
  Center,
  CopyButton,
  Group,
  Loader,
  Menu,
  Stack,
  Text,
} from '@mantine/core'
import { useDisclosure } from '@mantine/hooks'
import { modals } from '@mantine/modals'
import { showNotification } from '@mantine/notifications'
import { IconDots, IconPencil } from '@tabler/icons-react'
import Link from 'next/link'
import { useRouter } from 'next/router'
import { FC, useEffect, useState } from 'react'

interface Props {}

const UserPage: FC<Props> = () => {
  useLoginRedirect()
  const { t } = useLingui()
  const { fetching } = useUser()
  const router = useRouter()

  const id = router.query.id as string
  const [showEdit, showEditHandlers] = useDisclosure(false)
  const [loading, setLoading] = useState(true)
  const [user, setUser] = useState<UserDetail>()

  const getUserInfo = async () => {
    setLoading(true)
    const resp = await getDocument(id, 'users')
    setLoading(false)
    if (resp.status && resp.exists) {
      setUser(resp.data as UserDetail)
    }
  }

  const handleDelete = async () => {
    modals.openConfirmModal({
      title: `Confirm`,
      children: `Are you sure you want to delete this user?`,
      labels: {
        confirm: `Delete`,
        cancel: `Cancel`,
      },
      cancelProps: {
        variant: 'outline',
      },
      onConfirm: async () => {
        try {
          // Delete User All Exams
          await deleteDocumentQuery('user_id', id, 'exams_completed')

          // Delete User
          await deleteDocument('users', id)

          showNotification({
            message: 'User deleted successfully!',
            color: 'green',
          })

          router.push('/admin/users')
        } catch (e: any) {
          showNotification({
            message: e.message,
            color: 'red',
          })
        }
      },
    })
  }

  const handleRestore = async () => {
    modals.openConfirmModal({
      title: `Confirm`,
      children: `Are you sure you want to restore this user?`,
      labels: {
        confirm: `Restore`,
        cancel: `Cancel`,
      },
      cancelProps: {
        variant: 'outline',
      },
      onConfirm: async () => {
        try {
          await updateCollection('users', id, { is_archived: false })

          await getUserInfo()

          showNotification({
            message: 'User restored successfully!',
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

  const handleArchive = async () => {
    modals.openConfirmModal({
      title: `Confirm`,
      children: `Are you sure you want to archive this user?`,
      labels: {
        confirm: `Archive`,
        cancel: `Cancel`,
      },
      cancelProps: {
        variant: 'outline',
      },
      onConfirm: async () => {
        try {
          await updateCollection('users', id, { is_archived: true })

          await getUserInfo()

          showNotification({
            message: 'User archived successfully!',
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

  useEffect(() => {
    getUserInfo()
  }, [])

  if (fetching) return <PageLoader />

  return (
    <AdminLayout>
      <AppHead title={user ? user.firstName + ' ' + user.lastName + ' | Users' : `User`} />

      <Stack className="gap-xl">
        <Group>
          <Anchor component={Link} href="/admin/users" underline="never">
            Back to All Users
          </Anchor>
        </Group>

        {loading && !user && (
          <Center h={100}>
            <Loader size="xl" />
          </Center>
        )}

        {user && (
          <Card className="bg-gray-50 rounded-md">
            <Group>
              {showEdit ? (
                <UserEdit
                  userId={id}
                  data={user}
                  onSuccess={() => {
                    getUserInfo()
                    showEditHandlers.close()
                  }}
                  onClose={showEditHandlers.close}
                />
              ) : (
                <Stack className="flex-1 gap-2">
                  <Group>
                    <Text className="font-bold text-2xl">
                      {user.firstName} {user.lastName}
                    </Text>

                    {user.type === 'admin' && <Badge variant="light">Admin</Badge>}

                    {user.is_archived && <Badge variant="light">Archived</Badge>}

                    <ActionIcon variant="subtle" onClick={showEditHandlers.toggle}>
                      <IconPencil />
                    </ActionIcon>
                  </Group>

                  <Text>{user.email}</Text>
                </Stack>
              )}

              <Group>
                <CopyButton value={user.email}>
                  {({ copied, copy }) => <Button onClick={copy}>{copied ? 'Copied Email' : 'Send Email'}</Button>}
                </CopyButton>

                <Menu>
                  <Menu.Target>
                    <ActionIcon variant="subtle">
                      <IconDots />
                    </ActionIcon>
                  </Menu.Target>

                  <Menu.Dropdown>
                    {user.is_archived ? (
                      <Menu.Item onClick={handleRestore}>Restore</Menu.Item>
                    ) : (
                      <Menu.Item onClick={handleArchive}>Archive</Menu.Item>
                    )}

                    <Menu.Item color="red" onClick={handleDelete}>
                      Delete Account
                    </Menu.Item>
                  </Menu.Dropdown>
                </Menu>
              </Group>
            </Group>
          </Card>
        )}

        <UserExamTable />
      </Stack>
    </AdminLayout>
  )
}

export default UserPage
