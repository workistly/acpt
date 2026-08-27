import { useFormatDate } from '@/hooks/useFormat'
import { FORMAT_DATE_WITH_TIME } from '@/utils/const'
import { FC } from 'react'

type Props = {
  date: Date | string
  dateFormat?: string
}

const DateTimeFormatter: FC<Props> = ({ date, dateFormat = FORMAT_DATE_WITH_TIME }) => {
  const format = useFormatDate()
  let formatted = ''

  try {
    formatted = format(new Date(date), dateFormat)
  } catch (e) {}

  return <>{formatted}</>
}

export default DateTimeFormatter
