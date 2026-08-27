import { Table } from '@mantine/core'
import { FC, ReactNode } from 'react'

interface Props {
  minWidth?: number
  className?: string
  children?: ReactNode
}

const TableResponsive: FC<Props> = ({ minWidth = 700, children }) => {
  return (
    <Table.ScrollContainer
      scrollAreaProps={{
        type: 'always',
      }}
      minWidth={minWidth}
    >
      {children}
    </Table.ScrollContainer>
  )
}

export default TableResponsive
