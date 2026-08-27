import { Table, TableThProps } from '@mantine/core'
import { FC } from 'react'

interface Props extends TableThProps {}

const TableHeadCell: FC<Props> = ({ children, ...props }) => {
  return <Table.Th {...props}>{children}</Table.Th>
}

export default TableHeadCell
