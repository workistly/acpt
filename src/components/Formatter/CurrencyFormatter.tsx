import { NumberFormatter, NumberFormatterProps } from '@mantine/core'
import { FC } from 'react'

interface Props extends NumberFormatterProps {}

const CurrencyFormatter: FC<Props> = ({ prefix = '$', ...props }) => {
  return <NumberFormatter prefix={prefix} {...props} />
}

export default CurrencyFormatter
