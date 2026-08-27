import { useLogout } from '@/api/auth'
import { useUser } from '@/contexts/UserProvider'
import { Trans } from '@lingui/react/macro'
import { ActionIcon, Menu } from '@mantine/core'
import { IconLogout, IconSettings, IconUser, IconUsers } from '@tabler/icons-react'
import Link from 'next/link'
import { FC } from 'react'

interface Props {
  className?: string
}

const UserMenu: FC<Props> = ({ className }) => {
  const { fetching, user } = useUser()
  const logout = useLogout()

  if (fetching || !user?.id) return null

  return (
    <Menu>
      <Menu.Target>
        <ActionIcon size="xl" radius={0} className={className}>
          <IconUser />
        </ActionIcon>
      </Menu.Target>

      <Menu.Dropdown>
        {user?.type === 'admin' && (
          <Menu.Item component={Link} href="/admin/dashboard" rightSection={<IconUsers size={14} />}>
            <Trans>Admin</Trans>
          </Menu.Item>
        )}

        <Menu.Item component={Link} href="/user/my-account" rightSection={<IconSettings size={14} />}>
          <Trans>My Account</Trans>
        </Menu.Item>

        <Menu.Item rightSection={<IconLogout size={14} />} onClick={logout}>
          <Trans>Logout</Trans>
        </Menu.Item>
      </Menu.Dropdown>
    </Menu>
  )
}

export default UserMenu
