import AdminLayout from '@/components/Layout/AdminLayout'
import AppHead from '@/components/Layout/AppHead'
import PageLoader from '@/components/Loader/PageLoader'
import ReactTable from '@/components/Table/ReactTable'
import PageTitle from '@/components/Title/PageTitle'
import { useUser } from '@/contexts/UserProvider'
import useLoginRedirect from '@/hooks/useLoginRedirect'
import { User } from '@/types/user'
import { DEFAULT_PER_PAGE } from '@/utils/const'
import { db } from '@/utils/firebase'
import { useLingui } from '@lingui/react/macro'
import { Anchor, Badge, Group, Stack, Switch, Text, TextInput } from '@mantine/core'
import { IconSearch } from '@tabler/icons-react'
import {
  getCoreRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  SortingState,
  useReactTable,
} from '@tanstack/react-table'
import { createColumnHelper, PaginationState } from '@tanstack/table-core'
import { format } from 'date-fns'
import { collection, onSnapshot, query } from 'firebase/firestore'
import Link from 'next/link'
import { FC, useEffect, useMemo, useState } from 'react'

const columnHelper = createColumnHelper<User>()

interface Props {}

const UsersPage: FC<Props> = () => {
  useLoginRedirect()
  const { t } = useLingui()
  const { fetching } = useUser()
  const [loading, setLoading] = useState(true)
  const [pagination, setPagination] = useState<PaginationState>({ pageIndex: 0, pageSize: DEFAULT_PER_PAGE })
  const [sorting, setSorting] = useState<SortingState>([{ id: 'dateJoined', desc: true }])

  const [usersFetched, setUsersFetched] = useState([] as any)
  const [certificates, setCertificates] = useState([] as any)
  const [filterValue, setFilterValue] = useState('')
  const [showArchived, setShowArchived] = useState(false)

  const getAllUsers = async () => {
    const q = query(collection(db, 'users'))
    onSnapshot(q, (querySnapshot) => {
      const data: any = []
      querySnapshot.forEach((doc) => {
        data.push({ ...doc.data(), docId: doc.id })
      })

      setUsersFetched(data)
      setLoading(false)
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
    getAllCertificates()
  }, [])

  const rows = useMemo(() => {
    const tableRows: User[] = []

    for (let i = 0; i < usersFetched.length; i++) {
      const userItem: any = usersFetched[i]
      const isAdmin = userItem.type && userItem.type === 'admin' ? true : false
      const isArchived = userItem.is_archived ? userItem.is_archived : false
      const createdAt = userItem && userItem.createdAt ? userItem.createdAt : ''
      const dateJoined = createdAt.seconds
        ? format(new Date(createdAt.seconds * 1000), 'yyyy/MM/dd')
        : format(new Date(createdAt), 'yyyy/MM/dd')
      const firstName = userItem && userItem.firstName ? userItem.firstName : ''
      const lastName = userItem && userItem.lastName ? userItem.lastName : ''
      const userName = `${firstName} ${lastName}`
      const certificate = certificates.find((item: any) => item.userId === userItem.docId)

      if ((showArchived && isArchived) || (!showArchived && !isArchived)) {
        tableRows.push({
          user: userName,
          email: userItem.email,
          docId: userItem.docId,
          certificateNo: certificate && certificate.certificateNumber ? certificate.certificateNumber.toString() : '',
          dateJoined: dateJoined,
          isAdmin,
        })
      }
    }

    return tableRows
  }, [certificates, showArchived, usersFetched])

  const filteredRows = useMemo(() => {
    let filteredRows: User[] = []

    if (filterValue !== '' && rows.length > 0) {
      rows.forEach((row: any) => {
        if (
          (typeof row.email === 'string' && row.email.toLowerCase().includes(filterValue.toLowerCase())) ||
          (typeof row.user === 'string' && row.user.toLowerCase().includes(filterValue.toLowerCase())) ||
          (typeof row.certificateNo === 'string' && row.certificateNo.toLowerCase().includes(filterValue.toLowerCase()))
        ) {
          filteredRows.push(row)
        }
      })
    } else {
      filteredRows = rows
    }

    return filteredRows
  }, [filterValue, rows])

  const columns = useMemo(
    () => [
      columnHelper.accessor('user', {
        header: 'User',
        cell: ({ row }) => (
          <Anchor component={Link} href={`/admin/users/${row.original.docId}`}>
            <Group>
              {row.original.user}
              {row.original.isAdmin && <Badge variant="light">Admin</Badge>}
            </Group>
          </Anchor>
        ),
      }),

      columnHelper.accessor('email', {
        header: 'Email',
      }),

      columnHelper.accessor('certificateNo', {
        header: 'Certificate No.',
      }),

      columnHelper.accessor('dateJoined', {
        header: 'Date Joined',
      }),
    ],
    [],
  )

  const table = useReactTable({
    data: filteredRows,
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
      <AppHead title={t`Users`} />

      <Stack className="gap-xl">
        <PageTitle>Users</PageTitle>

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

          <Switch label="Show Archived" checked={showArchived} onChange={(e) => setShowArchived(e.target.checked)} />
        </Group>

        <Group mih={30}>
          <Group gap={4}>
            <Text c="dimmed">Total Users:</Text>

            <Text fw={700}>{filteredRows.length}</Text>
          </Group>
        </Group>

        <ReactTable table={table} showPlaceholder={loading} />
      </Stack>
    </AdminLayout>
  )
}

export default UsersPage
