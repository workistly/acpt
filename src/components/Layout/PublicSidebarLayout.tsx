import FooterCertificate from '@/components/Footer/FooterCertificate'
import PublicFooter from '@/components/Footer/PublicFooter'
import PublicHeader from '@/components/Header/PublicHeader'
import PublicSidebar from '@/components/Sidebar/PublicSidebar'
import { Box, Container, Flex, Text, Title } from '@mantine/core'
import { FC, PropsWithChildren } from 'react'
import AppHead from './AppHead'

interface Props extends PropsWithChildren {
  title?: string
  description?: string
  image?: string
}

const PublicSidebarLayout: FC<Props> = ({ title, description, image, children }) => {
  return (
    <Box mih="100dvh" pt={65}>
      <AppHead title={title} description={description} image={image} />

      <PublicHeader />

      {title && (
        <Box className="bg-red-600 py-10">
          <Container>
            <Title order={1} className="text-[44px] sm:text-[64px] text-center text-white sm:mb-4">
              {title}
            </Title>

            {description && <Text className="sm:text-lg text-center text-white">{description}</Text>}
          </Container>
        </Box>
      )}

      <Container className="py-4 md:py-12">
        <Flex className="max-md:flex-col gap-4">
          <PublicSidebar />

          <Box className="md:flex-1">{children}</Box>
        </Flex>
      </Container>

      <FooterCertificate />

      <PublicFooter />
    </Box>
  )
}

export default PublicSidebarLayout
