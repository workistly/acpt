import { useLogout } from '@/api/auth'
import logo from '@/assets/logo-full.svg'
import LanguageSelector from '@/components/Header/LanguageSelector'
import UserMenu from '@/components/Header/UserMenu'
import NextImage from '@/components/Image/NextImage'
import { useUser } from '@/contexts/UserProvider'
import { Trans, useLingui } from '@lingui/react/macro'
import { Anchor, Burger, Button, Container, Group, Stack } from '@mantine/core'
import { useDisclosure } from '@mantine/hooks'
import clsx from 'clsx'
import Link from 'next/link'
import { useRouter } from 'next/router'
import { FC, useMemo } from 'react'

interface Props {}

const PublicHeader: FC<Props> = () => {
  const { t } = useLingui()
  const [active, { toggle }] = useDisclosure()
  const router = useRouter()
  const { user } = useUser()
  const logout = useLogout()

  const menu = useMemo(
    () => [
      {
        title: t`Test Takers`,
        url: '/welcome',
      },
      {
        title: t`Organizations`,
        url: '/organizations',
      },
      {
        title: t`FAQ`,
        url: '/faq',
      },
    ],
    [t],
  )

  return (
    <Group className="fixed top-0 left-0 w-full bg-white z-50 shadow" h={65}>
      <Container className="w-full">
        <Group>
          <Link href="/" className="max-md:mr-auto">
            <NextImage src={logo} alt="ACPT" />
          </Link>

          <Group
            className={clsx(
              'ml-auto gap-2 transition-all',
              'max-md:absolute max-md:top-full max-md:right-0 max-md:flex-col max-md:items-start max-md:p-4 max-md:border-t max-md:border-red-600 max-md:shadow max-md:w-[250px] bg-white z-50',
              !active && 'max-md:opacity-0 max-md:pointer-events-none',
            )}
          >
            {menu.map((el) => (
              <Anchor
                key={el.title}
                component={Link}
                href={el.url}
                underline="never"
                className={clsx(
                  'p-2 md:mx-1',
                  router.pathname === el.url ? 'text-red-600' : 'text-dark hover:text-red-600',
                )}
              >
                {el.title}
              </Anchor>
            ))}

            {user?.id ? (
              <Button variant="outline" fw={400} className="md:hidden w-[200px]" onClick={logout}>
                <Trans>Logout</Trans>
              </Button>
            ) : (
              <Button component={Link} href="/login" variant="outline" fw={400} className="md:ml-4 max-md:w-[200px]">
                <Trans>Sign In / Register</Trans>
              </Button>
            )}

            <UserMenu className="max-md:hidden ml-4" />

            <LanguageSelector className="max-md:w-[200px]" />
          </Group>

          <UserMenu className="md:hidden" />

          <Burger opened={active} className="md:hidden" onClick={toggle} />
        </Group>
      </Container>
    </Group>
  )
}

export default PublicHeader
