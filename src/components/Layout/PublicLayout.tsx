import FooterCertificate from '@/components/Footer/FooterCertificate'
import PublicFooter from '@/components/Footer/PublicFooter'
import PublicHeader from '@/components/Header/PublicHeader'
import { Box } from '@mantine/core'
import { FC, PropsWithChildren } from 'react'
import AppHead from './AppHead'

interface Props extends PropsWithChildren {
  title?: string
  description?: string
  image?: string
  hideVerify?: boolean
}

const PublicLayout: FC<Props> = ({ title, description, image, hideVerify, children }) => {
  return (
    <Box mih="100dvh" pt={65}>
      <AppHead title={title} description={description} image={image} />

      <PublicHeader />

      {children}

      {!hideVerify && <FooterCertificate />}

      <PublicFooter />
    </Box>
  )
}

export default PublicLayout
