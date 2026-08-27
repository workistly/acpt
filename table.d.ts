import { TableTdProps } from '@mantine/core'
import { RowData } from '@tanstack/table-core'

declare module '@tanstack/table-core' {
  interface TableMeta<TData extends RowData> {}

  interface ColumnMeta<TData extends RowData, TValue> extends TableTdProps {}
}
