import logoFull from '@/assets/logo-full.svg'
import logo from '@/assets/logo.svg'
import LanguageSelector from '@/components/Header/LanguageSelector'
import UserMenu from '@/components/Header/UserMenu'
import NextImage from '@/components/Image/NextImage'
import { Container, Group } from '@mantine/core'
import Link from 'next/link'
import { FC } from 'react'

interface Props {
  hideLanguage?: boolean
  hideProfile?: boolean
}

const AuthHeader: FC<Props> = ({ hideLanguage, hideProfile }) => {
  return (
    <Group className="shadow no-print" h={65}>
      <Container className="w-full">
        <Group className="flex-nowrap">
          <Link href="/">
            <NextImage src={logo} alt="ACPT" className="xs:hidden" />
            <NextImage src={logoFull} alt="ACPT" className="max-xs:hidden" />
          </Link>

          <Group className="ml-auto gap-2 flex-nowrap">
            {!hideProfile && <UserMenu />}

            {!hideLanguage && <LanguageSelector />}
          </Group>
        </Group>
      </Container>
    </Group>
  )
}

export default AuthHeader
