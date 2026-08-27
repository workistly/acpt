import { Box, Progress } from '@mantine/core'
import { FC } from 'react'

interface Props {
  value?: number
}

const ProgressLoader: FC<Props> = ({ value = 100 }) => {
  return (
    <Box className="absolute top-0 left-0 w-full z-10">
      <Progress size="sm" value={value} opacity={0.5} animated />
    </Box>
  )
}

export default ProgressLoader
