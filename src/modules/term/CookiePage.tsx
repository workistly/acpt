import PublicSidebarLayout from '@/components/Layout/PublicSidebarLayout'
import CookieEnglish from '@/modules/term/CookieEnglish'
import { useLingui } from '@lingui/react/macro'
import { Stack } from '@mantine/core'
import { FC } from 'react'

interface Props {}

const CookiePage: FC<Props> = () => {
  const { t } = useLingui()

  return (
    <PublicSidebarLayout title={t`Cookie Policy`}>
      <Stack mb={80}>
        <CookieEnglish />
      </Stack>
    </PublicSidebarLayout>
  )
}

export default CookiePage
