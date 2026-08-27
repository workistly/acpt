import TablePagination from '@/components/Table/TablePagination'
import { Trans } from '@lingui/react/macro'
import { ActionIcon, Box, Group, Stack, Text } from '@mantine/core'
import { IconChevronDown, IconChevronUp, IconSelector } from '@tabler/icons-react'
import { flexRender, Row } from '@tanstack/react-table'
import { RowData, Table as TableInstance } from '@tanstack/table-core'
import { CSSProperties, Fragment, ReactElement, ReactNode } from 'react'
import BarsLoader from '../Loader/BarsLoader'
import ProgressLoader from '../Loader/ProgressLoader'
import Table from './Table'
import TableBody from './TableBody'
import TableBodyCell from './TableBodyCell'
import TableBodyRow from './TableBodyRow'
import TableHead from './TableHead'
import TableHeadCell from './TableHeadCell'
import TableHeadRow from './TableHeadRow'
import TableResponsive from './TableResponsive'

interface Props<T extends RowData> {
  table: TableInstance<T>
  noRowsLabel?: string
  showPlaceholder?: boolean
  showLoading?: boolean
  showFooter?: boolean
  hidePagination?: boolean
  minWidth?: number
  pageCount?: number
  renderSubComponent?: (props: { row: Row<T> }) => ReactElement | null
  headerComponent?: ReactNode
  footerComponent?: ReactNode
}

const ReactTable = <T extends RowData>({
  table,
  noRowsLabel,
  showPlaceholder,
  showLoading,
  showFooter,
  hidePagination,
  minWidth,
  pageCount,
  renderSubComponent = () => null,
  headerComponent,
  footerComponent,
}: Props<T>) => {
  return (
    <Stack>
      {headerComponent}

      <Box pos="relative" className="react-table">
        {showPlaceholder && <BarsLoader />}

        {showLoading && <ProgressLoader />}

        {table.getRowModel().rows.length > 0 ? (
          <TableResponsive minWidth={minWidth}>
            <Table>
              <TableHead>
                {table.getHeaderGroups().map((headerGroup) => (
                  <TableHeadRow key={headerGroup.id}>
                    {headerGroup.headers.map((header) => {
                      const props = header.column.columnDef.meta || {}

                      return (
                        <TableHeadCell key={header.id} p="md" className="bg-gray-50">
                          <Group gap="xs" wrap="nowrap" justify={props.align}>
                            <Text>
                              {header.isPlaceholder
                                ? null
                                : flexRender(header.column.columnDef.header, header.getContext())}
                            </Text>

                            {header.column.getCanSort() && (
                              <ActionIcon
                                variant="subtle"
                                size="xs"
                                onClick={header.column.getToggleSortingHandler()}
                                c="dimmed"
                              >
                                {header.column.getIsSorted() === 'asc' ? (
                                  <IconChevronUp size={14} />
                                ) : header.column.getIsSorted() === 'desc' ? (
                                  <IconChevronDown size={14} />
                                ) : (
                                  <IconSelector size={14} />
                                )}
                              </ActionIcon>
                            )}
                          </Group>
                        </TableHeadCell>
                      )
                    })}
                  </TableHeadRow>
                ))}
              </TableHead>

              <TableBody>
                {table.getRowModel().rows.map((row) => (
                  <Fragment key={row.id}>
                    <TableBodyRow>
                      {row.getVisibleCells().map((cell) => {
                        const props = cell.column.columnDef.meta || {}

                        return (
                          <TableBodyCell key={cell.id} p="md" className="sm:text-lg" {...props}>
                            {flexRender(cell.column.columnDef.cell, cell.getContext())}
                          </TableBodyCell>
                        )
                      })}
                    </TableBodyRow>
                    {row.getIsExpanded() && (
                      <TableBodyRow>
                        <TableBodyCell colSpan={row.getVisibleCells().length}>
                          {renderSubComponent({ row })}
                        </TableBodyCell>
                      </TableBodyRow>
                    )}
                  </Fragment>
                ))}
              </TableBody>

              {showFooter && (
                <TableHead>
                  {table.getFooterGroups().map((footerGroup) => (
                    <TableHeadRow key={footerGroup.id} px="md">
                      {footerGroup.headers.map((header) => {
                        const props = header.column.columnDef.meta || {}

                        return (
                          <TableHeadCell key={header.id} ta={props.align as CSSProperties['textAlign']}>
                            {header.isPlaceholder
                              ? null
                              : flexRender(header.column.columnDef.footer, header.getContext())}
                          </TableHeadCell>
                        )
                      })}
                    </TableHeadRow>
                  ))}
                </TableHead>
              )}
            </Table>
          </TableResponsive>
        ) : (
          !showPlaceholder && (
            <Text ta="center" py="md">
              {noRowsLabel || <Trans>No results</Trans>}
            </Text>
          )
        )}
      </Box>

      {footerComponent}

      {!hidePagination && (
        <TablePagination
          currentPage={table.getState().pagination.pageIndex}
          onPageChange={(pageIndex) =>
            table.setPagination({ pageIndex, pageSize: table.getState().pagination.pageSize })
          }
          pageCount={pageCount || Math.ceil(table.getCoreRowModel().rows.length / table.getState().pagination.pageSize)}
          loading={!!showLoading}
        />
      )}
    </Stack>
  )
}

export default ReactTable
