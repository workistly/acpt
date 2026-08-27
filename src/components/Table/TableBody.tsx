import { Table, TableTbodyProps } from '@mantine/core'
import { FC } from 'react'

interface Props extends TableTbodyProps {}

const TableBody: FC<Props> = ({ children, ...props }) => {
  return <Table.Tbody {...props}>{children}</Table.Tbody>
}

export default TableBody
