import { Table, TableTdProps } from '@mantine/core'
import { FC } from 'react'

interface Props extends TableTdProps {}

const TableBodyCell: FC<Props> = ({ children, ...props }) => {
  return <Table.Td {...props}>{children}</Table.Td>
}

export default TableBodyCell
