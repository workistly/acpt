import PublicSidebarLayout from '@/components/Layout/PublicSidebarLayout'
import PrivacyEnglish from '@/modules/term/PrivacyEnglish'
import { useLingui } from '@lingui/react/macro'
import { Stack } from '@mantine/core'
import { FC } from 'react'

interface Props {}

const PrivacyPage: FC<Props> = () => {
  const { t } = useLingui()

  return (
    <PublicSidebarLayout title={t`Privacy Policy`} description={t`Last revised on February 24, 2025.`}>
      <Stack mb={80}>
        <PrivacyEnglish />
      </Stack>
    </PublicSidebarLayout>
  )
}

export default PrivacyPage
