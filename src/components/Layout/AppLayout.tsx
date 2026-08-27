import AuthHeader from '@/components/Header/AuthHeader'
import { Box } from '@mantine/core'
import { FC, PropsWithChildren } from 'react'
import AppHead from './AppHead'

interface Props extends PropsWithChildren {
  title?: string
  description?: string
  image?: string
  hideLanguage?: boolean
  hideProfile?: boolean
}

const AppLayout: FC<Props> = ({ title, description, image, hideLanguage, hideProfile, children }) => {
  return (
    <Box mih="100dvh">
      <AppHead title={title} description={description} image={image} />

      <AuthHeader hideLanguage={hideLanguage} hideProfile={hideProfile} />

      {children}
    </Box>
  )
}

export default AppLayout
