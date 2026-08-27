import PublicSidebarLayout from '@/components/Layout/PublicSidebarLayout'
import TermsEnglish from '@/modules/term/TermsEnglish'
import { useLingui } from '@lingui/react/macro'
import { Stack } from '@mantine/core'
import { FC } from 'react'

interface Props {}

const TermsPage: FC<Props> = () => {
  const { t } = useLingui()

  return (
    <PublicSidebarLayout
      title={t`Terms and Conditions of Service`}
      description={t`These Terms were last revised on October 14th, 2024.`}
    >
      <Stack mb={80}>
        <TermsEnglish />
      </Stack>
    </PublicSidebarLayout>
  )
}

export default TermsPage
