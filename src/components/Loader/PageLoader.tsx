import { Center, Loader } from '@mantine/core'
import { FC } from 'react'

interface Props {}

const PageLoader: FC<Props> = () => {
  return (
    <Center h="60vh">
      <Loader size="xl" />
    </Center>
  )
}

export default PageLoader
