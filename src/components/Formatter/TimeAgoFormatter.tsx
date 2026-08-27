import { useFormatDate, useFormatDistance } from '@/hooks/useFormat'
import { FORMAT_DATE_WITH_TIME } from '@/utils/const'
import { Box, Tooltip } from '@mantine/core'
import { FC } from 'react'

type Props = {
  date: Date | string
  dateFormat?: string
}

const TimeAgoFormatter: FC<Props> = ({ date, dateFormat = FORMAT_DATE_WITH_TIME }) => {
  const format = useFormatDate()
  const formatDistance = useFormatDistance()
  let formatted = ''
  let real = ''

  try {
    formatted = formatDistance(new Date(date), new Date())

    real = format(new Date(date), dateFormat)
  } catch (e) {}

  return (
    <Tooltip label={real}>
      <Box component="span">{formatted}</Box>
    </Tooltip>
  )
}

export default TimeAgoFormatter
