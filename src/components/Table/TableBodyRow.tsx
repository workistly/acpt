import { Table, TableTrProps } from '@mantine/core'
import { FC } from 'react'

interface Props extends TableTrProps {}

const TableBodyRow: FC<Props> = ({ children, ...props }) => {
  return <Table.Tr {...props}>{children}</Table.Tr>
}

export default TableBodyRow
