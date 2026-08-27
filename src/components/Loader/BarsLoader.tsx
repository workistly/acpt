import { Skeleton, Stack } from '@mantine/core'
import React, { FC, useMemo } from 'react'

const WIDTH = ['30%', '50%', '90%', '60%']

interface Props {
  no?: number
}

const BarsLoader: FC<Props> = ({ no = 8 }) => {
  const items = useMemo(() => Array(no).fill(0), [no])

  return (
    <Stack gap={8}>
      {items.map((_, id) => (
        <Skeleton key={id} w={WIDTH[id % WIDTH.length]} h={40} />
      ))}
    </Stack>
  )
}

export default BarsLoader
