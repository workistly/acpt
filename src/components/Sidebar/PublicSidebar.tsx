import { Anchor, Group, Stack } from '@mantine/core'
import { IconChevronRight } from '@tabler/icons-react'
import clsx from 'clsx'
import Link from 'next/link'
import { useRouter } from 'next/router'
import { FC } from 'react'

const MENU = [
  {
    title: 'FAQ',
    url: '/faq',
  },
  {
    title: 'Terms of Service',
    url: '/terms',
  },
  {
    title: 'Privacy Policy',
    url: '/privacy',
  },
  {
    title: 'Cookie Policy',
    url: '/cookie',
  },
  {
    title: 'Contact Us',
    url: '/contact',
  },
]

interface Props {}

const PublicSidebar: FC<Props> = () => {
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

export default PublicSidebar
