import { Table as MantineTable, TableProps } from '@mantine/core'
import { FC } from 'react'

interface Props extends TableProps {}

const Table: FC<Props> = ({ children, ...props }) => {
  return (
    <MantineTable highlightOnHover withTableBorder withRowBorders {...props}>
      {children}
    </MantineTable>
  )
}

export default Table
