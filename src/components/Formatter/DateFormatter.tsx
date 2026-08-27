import { useFormatDate } from '@/hooks/useFormat'
import { FORMAT_DATE_ONLY } from '@/utils/const'
import { FC } from 'react'

type Props = {
  date: Date | string
  dateFormat?: string
}

const DateFormatter: FC<Props> = ({ date, dateFormat = FORMAT_DATE_ONLY }) => {
  const format = useFormatDate()
  let formatted = ''

  try {
    formatted = format(new Date(date), dateFormat)
  } catch (e) {}

  return <>{formatted}</>
}

export default DateFormatter
