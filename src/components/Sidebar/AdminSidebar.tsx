import { Anchor, Group, Stack } from '@mantine/core'
import { IconChevronRight } from '@tabler/icons-react'
import clsx from 'clsx'
import Link from 'next/link'
import { useRouter } from 'next/router'
import { FC } from 'react'

const MENU = [
  {
    title: 'Dashboard',
    url: '/admin/dashboard',
  },
  {
    title: 'History',
    url: '/admin/history',
  },
  {
    title: 'Users',
    url: '/admin/users',
  },
  {
    title: 'Question Bank',
    url: '/admin/question-bank',
  },
  {
    title: 'Exams',
    url: '/admin/exams',
  },
]

interface Props {}

const AdminSidebar: FC<Props> = () => {
  const router = useRouter()

  return (
    <Stack className="sm:w-[250px]" gap={8}>
      {MENU.map((el) => {
        const active = router.pathname === el.url

        return (
          <Anchor
            key={el.title}
            component={Link}
            href={el.url}
            className={clsx('py-1 sm:py-2', active ? 'text-red-600' : 'text-dark hover:text-red-600')}
          >
            <Group gap={4}>
              <Group w={20}>{active && <IconChevronRight size={18} />}</Group>

              {el.title}
            </Group>
          </Anchor>
        )
      })}
    </Stack>
  )
}

export default AdminSidebar
