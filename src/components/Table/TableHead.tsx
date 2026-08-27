import { Table, TableTheadProps } from '@mantine/core'
import { FC } from 'react'

interface Props extends TableTheadProps {}

const TableHead: FC<Props> = ({ children, ...props }) => {
  return <Table.Thead {...props}>{children}</Table.Thead>
}

export default TableHead
