import { queryData } from '@/api/exam'
import ReactTable from '@/components/Table/ReactTable'
import UserExamTableActions from '@/modules/admin/user/UserExamTableActions'
import { UserHistory } from '@/types/history'
import { DEFAULT_PER_PAGE } from '@/utils/const'
import { Group, Stack, Text } from '@mantine/core'
import {
  getCoreRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  SortingState,
  useReactTable,
} from '@tanstack/react-table'
import { createColumnHelper, PaginationState } from '@tanstack/table-core'
import { format } from 'date-fns'
import { useRouter } from 'next/router'
import { FC, useEffect, useMemo, useState } from 'react'

const columnHelper = createColumnHelper<UserHistory>()

interface Props {}

const UserExamTable: FC<Props> = () => {
  const router = useRouter()
  const id = router.query.id as string
  const [loading, setLoading] = useState(true)
  const [pagination, setPagination] = useState<PaginationState>({ pageIndex: 0, pageSize: DEFAULT_PER_PAGE })
  const [sorting, setSorting] = useState<SortingState>([{ id: 'date', desc: true }])
  const [examsFetched, setExamsFetched] = useState([])

  const getUserExams = async () => {
    const resp = await queryData('exams_completed', 'user_id', id)

    if (resp.status && resp.fullData.length > 0) {
      const examData = resp.data
      const arr: any = []
      await Promise.all(
        resp.fullData.map(async (test: any) => {
          let cert = ''

          const resp = await queryData('certificates', 'examId', test.docId as string)

          if (resp.status && resp.fullData.length > 0) {
            cert = resp.fullData[0].certificateNumber
          }

          arr.push({ ...examData, certificateNo: cert })
        }),
      )

      setExamsFetched(arr)
      setLoading(false)
    }
  }

  useEffect(() => {
    getUserExams()
  }, [])

  const rows = useMemo(() => {
    const tableRows: UserHistory[] = []

    for (let i = 0; i < examsFetched.length; i++) {
      const test: any = examsFetched[i]
      const date = test.completed_at ? format(new Date(test.completed_at), 'yyyy/MM/dd') : '-'
      let examScore = test.score ? test.score : '-'

      if (test.status && test.status === 'incomplete') {
        examScore = 'Incomplete'
      }

      tableRows.push({
        date: date,
        score: examScore,
        language: test.language,
        certificateNo: test.certificateNo,
        payment: test.payment && test.payment.toLowerCase() === 'paid' ? 'Paid' : 'Unpaid',
        docId: test.docId,
      })
    }

    return tableRows
  }, [examsFetched])

  const columns = useMemo(
    () => [
      columnHelper.accessor('date', {
        header: 'Date',
      }),

      columnHelper.accessor('score', {
        header: 'Score',
      }),

      columnHelper.accessor('language', {
        header: 'Language',
      }),

      columnHelper.accessor('certificateNo', {
        header: 'Certificate No.',
      }),

      columnHelper.accessor('payment', {
        header: 'Payment',
      }),

      columnHelper.display({
        id: 'actions',
        header: '',
        cell: ({ row }) => <UserExamTableActions data={row.original} onSuccess={getUserExams} />,
        meta: {
          width: 110,
        },
      }),
    ],
    [],
  )

  const table = useReactTable({
    data: rows,
    state: {
      pagination,
      sorting,
    },
    columns,
    enableSorting: true,
    enableSortingRemoval: false,
    enableMultiSort: false,
    onPaginationChange: setPagination,
    onSortingChange: setSorting,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
  })

  return (
    <Stack>
      {' '}
      <Group gap={4}>
        <Text fw={700}>{rows.length}</Text>

        <Text c="dimmed">row(s) total</Text>
      </Group>
      <ReactTable table={table} showPlaceholder={loading} />
    </Stack>
  )
}

export default UserExamTable
