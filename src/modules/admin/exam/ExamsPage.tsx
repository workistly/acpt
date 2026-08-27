import { getAllDocs } from '@/api/doc'
import AdminLayout from '@/components/Layout/AdminLayout'
import AppHead from '@/components/Layout/AppHead'
import PageLoader from '@/components/Loader/PageLoader'
import ReactTable from '@/components/Table/ReactTable'
import PageTitle from '@/components/Title/PageTitle'
import { useUser } from '@/contexts/UserProvider'
import { useFormatNumber } from '@/hooks/useFormat'
import useLoginRedirect from '@/hooks/useLoginRedirect'
import ExamTableActions from '@/modules/admin/exam/ExamTableActions'
import ModalAddExam from '@/modules/admin/exam/ModalAddExam'
import { Exam } from '@/types/exam'
import { DEFAULT_PER_PAGE } from '@/utils/const'
import { Button, Group, Modal, Stack, Switch, Text } from '@mantine/core'
import { useDisclosure } from '@mantine/hooks'
import { IconPlus } from '@tabler/icons-react'
import {
  getCoreRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  SortingState,
  useReactTable,
} from '@tanstack/react-table'
import { createColumnHelper, PaginationState } from '@tanstack/table-core'
import { format } from 'date-fns'
import { FC, useEffect, useMemo, useState } from 'react'

const columnHelper = createColumnHelper<Exam>()

interface Props {}

const ExamsPage: FC<Props> = () => {
  useLoginRedirect()
  const [showAdd, showAddHandlers] = useDisclosure(false)
  const { fetching } = useUser()
  const formatNumber = useFormatNumber()
  const [loading, setLoading] = useState(true)
  const [pagination, setPagination] = useState<PaginationState>({ pageIndex: 0, pageSize: DEFAULT_PER_PAGE })
  const [sorting, setSorting] = useState<SortingState>([{ id: 'date', desc: true }])

  const [showArchived, setShowArchived] = useState(false)
  const [examsFetched, setExamsFetched] = useState([])

  const getAllExams = async () => {
    const resp = await getAllDocs('exams')
    if (resp.status && resp.fullData.length > 0) {
      const options = resp.fullData.map((option: any) => option)
      setExamsFetched(options)
      setLoading(false)
    }
  }

  useEffect(() => {
    getAllExams()
  }, [])

  const rows = useMemo(() => {
    const tableRows: Exam[] = []

    for (let i = 0; i < examsFetched.length; i++) {
      const examItem: any = examsFetched[i]
      const examId = examItem.docId
      const isArchived = examItem.is_archived ? examItem.is_archived : false
      const isActive = examItem.is_active ? examItem.is_active : false
      const activeLabel = examItem.is_active ? 'Active' : 'Inactive'
      const examCreated = examItem.created ? format(new Date(examItem.created), 'yyyy/MM/dd') : ''

      if ((showArchived && isArchived) || (!showArchived && !isArchived)) {
        tableRows.push({
          testLanguage: examItem.language,
          status: activeLabel,
          price: `$${formatNumber(examItem.price)}`,
          date: examCreated,
          docId: examId,
          isActive,
          isArchived,
        })
      }
    }

    return tableRows
  }, [examsFetched, showArchived])

  const columns = useMemo(
    () => [
      columnHelper.accessor('testLanguage', {
        header: 'Language',
      }),

      columnHelper.accessor('status', {
        header: 'Status',
      }),

      columnHelper.accessor('price', {
        header: 'Price',
      }),

      columnHelper.accessor('date', {
        header: 'Date',
      }),

      columnHelper.display({
        id: 'actions',
        header: 'Action',
        cell: ({ row }) => <ExamTableActions examsFetched={examsFetched} data={row.original} onSuccess={getAllExams} />,
      }),
    ],
    [examsFetched],
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

  if (fetching) return <PageLoader />

  return (
    <AdminLayout>
      <AppHead title="Exams" />

      <Stack className="gap-xl">
        <PageTitle>Exams</PageTitle>

        <Group>
          <Switch label="Show Archived" checked={showArchived} onChange={(e) => setShowArchived(e.target.checked)} />

          <Button leftSection={<IconPlus size={18} />} className="ml-auto" onClick={showAddHandlers.open}>
            Add a new exam
          </Button>

          <Modal opened={showAdd} onClose={showAddHandlers.close} title="Add a new exam">
            <ModalAddExam onClose={showAddHandlers.close} onSuccess={getAllExams} />
          </Modal>
        </Group>

        <Group mih={30}>
          <Group gap={4}>
            <Text>
              Total: <strong>{rows.length}</strong> Exams
            </Text>
          </Group>
        </Group>

        <ReactTable table={table} showPlaceholder={loading} />
      </Stack>
    </AdminLayout>
  )
}

export default ExamsPage
