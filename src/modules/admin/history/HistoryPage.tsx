import AdminFilters from '@/components/Filter/AdminFilters'
import AdminLayout from '@/components/Layout/AdminLayout'
import AppHead from '@/components/Layout/AppHead'
import PageLoader from '@/components/Loader/PageLoader'
import ReactTable from '@/components/Table/ReactTable'
import PageTitle from '@/components/Title/PageTitle'
import { useUser } from '@/contexts/UserProvider'
import useLoginRedirect from '@/hooks/useLoginRedirect'
import { History } from '@/types/history'
import { DEFAULT_PER_PAGE } from '@/utils/const'
import { db } from '@/utils/firebase'
import { useLingui } from '@lingui/react/macro'
import { ActionIcon, Anchor, Button, Checkbox, Chip, Group, List, Stack, Text, TextInput, Tooltip } from '@mantine/core'
import { DatePickerInput } from '@mantine/dates'
import { modals } from '@mantine/modals'
import { showNotification } from '@mantine/notifications'
import { IconCalendar, IconMail, IconSearch, IconX } from '@tabler/icons-react'
import {
  getCoreRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  RowSelectionState,
  SortingState,
  useReactTable,
} from '@tanstack/react-table'
import { createColumnHelper, PaginationState } from '@tanstack/table-core'
import { format } from 'date-fns'
import { collection, onSnapshot, query } from 'firebase/firestore'
import Link from 'next/link'
import { FC, useEffect, useMemo, useRef, useState } from 'react'

interface refType extends HTMLInputElement {
  handleRemoveFilter: (param: string, value: string) => void
}

const columnHelper = createColumnHelper<History>()

interface Props {}

const HistoryPage: FC<Props> = () => {
  useLoginRedirect()
  const { t } = useLingui()
  const { fetching } = useUser()
  const [loading, setLoading] = useState(true)
  const [pagination, setPagination] = useState<PaginationState>({ pageIndex: 0, pageSize: DEFAULT_PER_PAGE })
  const [rowSelection, setRowSelection] = useState<RowSelectionState>({})
  const [sorting, setSorting] = useState<SortingState>([{ id: 'date', desc: true }])

  const filtersRef = useRef<refType>(null)
  const [examsFetched, setExamsFetched] = useState([])
  const [usersFetched, setUsersFetched] = useState([])
  const [certificates, setCertificates] = useState([])
  const [dateRange, setDateRange] = useState<any>(null)
  const [filterValue, setFilterValue] = useState('')
  const [filterValues, setFilterValues] = useState<any>(null)
  const [recipients, setRecipients] = useState<string[]>([])

  const getAllExams = async () => {
    const q = query(collection(db, 'exams_completed'))
    onSnapshot(q, (querySnapshot) => {
      const data: any = []
      querySnapshot.forEach((doc) => {
        data.push({ ...doc.data(), docId: doc.id })
      })

      setExamsFetched(data)
      setLoading(false)
    })
  }

  const getAllUsers = async () => {
    const q = query(collection(db, 'users'))
    onSnapshot(q, (querySnapshot) => {
      const data: any = []
      querySnapshot.forEach((doc) => {
        data.push({ ...doc.data(), docId: doc.id })
      })
      setUsersFetched(data)
    })
  }

  const getAllCertificates = async () => {
    const q = query(collection(db, 'certificates'))
    onSnapshot(q, (querySnapshot) => {
      const data: any = []
      querySnapshot.forEach((doc) => {
        data.push({ ...doc.data(), docId: doc.id })
      })
      setCertificates(data)
    })
  }

  useEffect(() => {
    getAllUsers()
    getAllExams()
    getAllCertificates()
  }, [])

  const sendMail = (emails: string[]) => {
    modals.openConfirmModal({
      title: `Confirm`,
      children: (
        <Stack>
          <Text>Are you sure to send emails to:</Text>

          <List>
            {emails.map((email, index) => (
              <List.Item key={index}>{email}</List.Item>
            ))}
          </List>
        </Stack>
      ),
      labels: {
        confirm: `Send`,
        cancel: `Cancel`,
      },
      cancelProps: {
        variant: 'outline',
      },
      onConfirm: async () => {
        try {
          const resp = await fetch(process.env.NEXT_PUBLIC_SEND_FRONT_MAIL_URL as string, {
            method: 'POST',
            headers: {
              Accept: 'application/json, text/plain, */*',
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              emails: emails.join(','),
            }),
          })

          if (resp.ok) {
            showNotification({
              message: 'Mail successfully sent.',
              color: 'green',
            })
          } else {
            showNotification({
              message: 'Failed to send mail.',
              color: 'red',
            })
          }
        } catch (e: any) {
          showNotification({
            message: e.message || 'An error occurred while sending the mail.',
            color: 'red',
          })
        }
      },
    })
  }

  const selected = useMemo(() => Object.keys(rowSelection), [rowSelection])

  useEffect(() => {
    if (selected && selected.length) {
      const mailAddresses: string[] = []
      for (let i = 0; i < selected.length; i++) {
        const examDocId = selected[i]
        const examItem: any = examsFetched.find((item: any) => item.docId === examDocId)

        if (examItem) {
          const user: any = usersFetched.find((item: any) => item.docId === examItem.user_id)
          if (user && user.email && !mailAddresses.includes(user.email)) {
            mailAddresses.push(user.email)
          }
        }
      }
      setRecipients(mailAddresses)
    } else {
      setRecipients([])
    }
  }, [examsFetched, selected, usersFetched])

  const rows = useMemo(() => {
    const tableRows: History[] = []

    for (let i = 0; i < examsFetched.length; i++) {
      const exam: any = examsFetched[i]
      const date = exam.completed_at ? format(new Date(exam.completed_at), 'yyyy/MM/dd') : '-'
      const status = exam.status && exam.status.toLowerCase() === 'complete' ? 'Complete' : 'Incomplete'
      const payment = exam.payment && exam.payment.toLowerCase() === 'paid' ? 'Paid' : 'Unpaid'
      const user: any = usersFetched.find((item: any) => item.docId === exam.user_id)
      const certificate = user && user.docId && certificates.find((item: any) => item.userId === user.docId)
      const firstName = user && user.firstName ? user.firstName : ''
      const lastName = user && user.lastName ? user.lastName : ''
      const userName = `${firstName} ${lastName}`
      const userEmail = user && user.email ? user.email : ''
      const mailSent = user && user.email_sent ? user.email_sent : false
      const certificateNo = certificate && certificate.certificateNumber ? certificate.certificateNumber.toString() : ''

      tableRows.push({
        testTaker: userName,
        date: date,
        completion: status,
        payment: payment,
        viewProfile: '',
        email: userEmail,
        docId: exam.docId,
        userId: exam.user_id,
        certificateNo,
        mailSent,
      })
    }

    return tableRows
  }, [certificates, examsFetched, usersFetched])

  const filteredRows = useMemo(() => {
    let filteredRows: History[] = []

    if (filterValue !== '' && rows.length > 0) {
      rows.forEach((row: any) => {
        if (
          (typeof row.email === 'string' && row.email.toLowerCase().includes(filterValue.toLowerCase())) ||
          (typeof row.testTaker === 'string' && row.testTaker.toLowerCase().includes(filterValue.toLowerCase())) ||
          (typeof row.certificateNo === 'string' && row.certificateNo.toLowerCase().includes(filterValue.toLowerCase()))
        ) {
          filteredRows.push(row)
        }
      })
    } else {
      filteredRows = rows
    }

    if (filterValues) {
      filteredRows = filteredRows.filter((row: any) => {
        if (filterValues.email === 'Email Sent') {
          return (
            row.mailSent &&
            row.completion.toLowerCase() ===
              (filterValues.complete && filterValues.complete !== ''
                ? filterValues.complete.toLowerCase()
                : row.completion.toLowerCase()) &&
            row.payment.toLowerCase() ===
              (filterValues.payment && filterValues.payment !== ''
                ? filterValues.payment.toLowerCase()
                : row.payment.toLowerCase())
          )
        } else {
          return (
            row.completion.toLowerCase() ===
              (filterValues.complete && filterValues.complete !== ''
                ? filterValues.complete.toLowerCase()
                : row.completion.toLowerCase()) &&
            row.payment.toLowerCase() ===
              (filterValues.payment && filterValues.payment !== ''
                ? filterValues.payment.toLowerCase()
                : row.payment.toLowerCase())
          )
        }
      })
    }

    if (dateRange && dateRange.startDate && dateRange.endDate) {
      filteredRows = filteredRows.filter((row: any) => {
        return new Date(row.date) >= dateRange.startDate && new Date(row.date) <= dateRange.endDate
      })
    }

    return filteredRows
  }, [dateRange, filterValue, filterValues, rows])

  const handleDeleteFilter = (param: string) => {
    if (filtersRef.current) {
      filtersRef.current.handleRemoveFilter(param, '')
    }
  }

  const columns = useMemo(
    () => [
      columnHelper.display({
        id: 'select',
        header: ({ table }) => (
          <Checkbox
            size="sm"
            {...{
              checked: table.getIsAllPageRowsSelected(),
              indeterminate: table.getIsSomePageRowsSelected(),
              onChange: table.getToggleAllPageRowsSelectedHandler(),
            }}
          />
        ),
        cell: ({ row }) => (
          <Checkbox
            size="sm"
            {...{
              checked: row.getIsSelected(),
              indeterminate: row.getIsSomeSelected(),
              onChange: row.getToggleSelectedHandler(),
            }}
          />
        ),
      }),

      columnHelper.accessor('testTaker', {
        header: 'Test Taker',
        cell: ({ row }) => (
          <Anchor component={Link} href={`/admin/users/${row.original.userId}`}>
            {row.original.testTaker}
          </Anchor>
        ),
      }),

      columnHelper.accessor('date', {
        header: 'Date',
      }),

      columnHelper.accessor('completion', {
        header: 'Completion',
      }),

      columnHelper.accessor('payment', {
        header: 'Payment',
      }),

      columnHelper.accessor('email', {
        header: 'Email',
      }),

      columnHelper.display({
        id: 'actions',
        header: 'Action',
        cell: ({ row }) => {
          return (
            <Tooltip label="Send email" onClick={() => sendMail([row.original.email])}>
              <ActionIcon variant="subtle">
                <IconMail size={18} />
              </ActionIcon>
            </Tooltip>
          )
        },
        meta: {
          width: 110,
        },
      }),
    ],
    [],
  )

  const table = useReactTable({
    data: filteredRows,
    state: {
      pagination,
      sorting,
      rowSelection,
    },
    columns,
    enableSorting: true,
    enableSortingRemoval: false,
    enableMultiSort: false,
    onPaginationChange: setPagination,
    onSortingChange: setSorting,
    onRowSelectionChange: setRowSelection,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getRowId: (row) => row.docId,
  })

  if (fetching) return <PageLoader />

  return (
    <AdminLayout>
      <AppHead title="History" />

      <Stack className="gap-xl">
        <PageTitle>History</PageTitle>

        <Group>
          <TextInput
            placeholder="Search by Name, Email, Certificate No."
            value={filterValue}
            onChange={(e) => setFilterValue(e.target.value)}
            leftSection={<IconSearch />}
            w={500}
            maw="100%"
            className="mr-auto"
          />

          <AdminFilters ref={filtersRef} setFiltersApplied={setFilterValues} onApplyFilters={setFilterValues} />

          <DatePickerInput
            clearable
            type="range"
            placeholder="Select dates"
            leftSection={<IconCalendar />}
            onChange={([start, end]) =>
              setDateRange({
                startDate: start ? new Date(start) : null,
                endDate: end ? new Date(end) : null,
              })
            }
          />
        </Group>

        {(filterValues?.email || filterValues?.complete || filterValues?.payment) && (
          <Group>
            {filterValues.email && (
              <Chip variant="outline" onChange={() => handleDeleteFilter('email')} icon={<IconX size={16} />} checked>
                {filterValues.email}
              </Chip>
            )}

            {filterValues.complete && (
              <Chip
                variant="outline"
                onChange={() => handleDeleteFilter('complete')}
                icon={<IconX size={16} />}
                checked
              >
                {filterValues.complete}
              </Chip>
            )}

            {filterValues.payment && (
              <Chip variant="outline" onChange={() => handleDeleteFilter('payment')} icon={<IconX size={16} />} checked>
                {filterValues.payment}
              </Chip>
            )}
          </Group>
        )}

        <Group mih={30}>
          <Group gap={4}>
            <Text c="dimmed">Total Exams:</Text>

            <Text fw={700}>{filteredRows.length}</Text>
          </Group>

          <Group gap={4}>
            <Text fw={700}>{selected.length}</Text>

            <Text c="dimmed">Exam(s) selected</Text>
          </Group>

          {selected.length && (
            <Button
              size="sm"
              variant="subtle"
              leftSection={<IconMail size={14} />}
              onClick={() => sendMail(recipients)}
            >
              Send Email
            </Button>
          )}
        </Group>

        <ReactTable table={table} showPlaceholder={loading} />
      </Stack>
    </AdminLayout>
  )
}

export default HistoryPage
