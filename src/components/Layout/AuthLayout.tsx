import AuthHeader from '@/components/Header/AuthHeader'
import { Box, Container } from '@mantine/core'
import { FC, PropsWithChildren } from 'react'
import AppHead from './AppHead'

interface Props extends PropsWithChildren {
  title?: string
  description?: string
  image?: string
}

const AuthLayout: FC<Props> = ({ title, description, image, children }) => {
  return (
    <Box>
      <AppHead title={title} description={description} image={image} />

      <AuthHeader />

      <Container size="xs" my={120}>
        <Box className="red-box">{children}</Box>
      </Container>
    </Box>
  )
}

export default AuthLayout
