import AuthHeader from '@/components/Header/AuthHeader'
import AdminSidebar from '@/components/Sidebar/AdminSidebar'
import { Box, Container, Flex } from '@mantine/core'
import { FC, PropsWithChildren } from 'react'
import AppHead from './AppHead'

interface Props extends PropsWithChildren {
  title?: string
  description?: string
  image?: string
}

const AdminLayout: FC<Props> = ({ title, description, image, children }) => {
  return (
    <Box mih="100dvh">
      <AppHead title={title} description={description} image={image} />

      <AuthHeader />

      <Container className="py-4 md:py-12">
        <Flex className="max-md:flex-col gap-4">
          <AdminSidebar />

          <Box className="md:flex-1">{children}</Box>
        </Flex>
      </Container>
    </Box>
  )
}

export default AdminLayout
