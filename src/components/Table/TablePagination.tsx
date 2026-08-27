import { Group, Loader, Pagination } from '@mantine/core'
import { FC } from 'react'

interface Props {
  currentPage: number
  onPageChange: (val: number) => void
  pageCount: number
  loading: boolean
}

const TablePagination: FC<Props> = ({ currentPage, onPageChange, pageCount, loading }) => {
  if (pageCount <= 1) return null

  return (
    <Group justify="center">
      {loading && <Loader size="xs" />}

      <Pagination total={Math.ceil(pageCount)} value={currentPage + 1} onChange={(val) => onPageChange(val - 1)} />
    </Group>
  )
}

export default TablePagination
