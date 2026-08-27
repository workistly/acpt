import { addDocInCollection, queryData } from '@/api/exam'
import { useGetTests } from '@/api/tests'
import DateFormatter from '@/components/Formatter/DateFormatter'
import ReactTable from '@/components/Table/ReactTable'
import PageTitle from '@/components/Title/PageTitle'
import { useTest } from '@/contexts/TestProvider'
import { useUser } from '@/contexts/UserProvider'
import { Test } from '@/types/test'
import { DEFAULT_PER_PAGE, EMPTY_ARRAY } from '@/utils/const'
import { Trans, useLingui } from '@lingui/react/macro'
import { Anchor, Button, Center, Group, Stack } from '@mantine/core'
import { showNotification } from '@mantine/notifications'
import { getCoreRowModel, getPaginationRowModel, getSortedRowModel, useReactTable } from '@tanstack/react-table'
import { createColumnHelper, PaginationState } from '@tanstack/table-core'
import Link from 'next/link'
import { useRouter } from 'next/router'
import { FC, useMemo, useState, useEffect } from 'react'

const columnHelper = createColumnHelper<Test>()

const PASSING_SCORE = 75 // Define passing score constant

interface Props {}

const TestTable: FC<Props> = () => {
  const { t } = useLingui()
  const router = useRouter()
  const { user } = useUser()
  const { startExam } = useTest()
  const [loading, setLoading] = useState(true)
  const [purchaseLoading, setPurchaseLoading] = useState<string | null>(null)
  const [pagination, setPagination] = useState<PaginationState>({ pageIndex: 0, pageSize: DEFAULT_PER_PAGE })

  const { data, isPending, refetch } = useGetTests()

  useEffect(() => {
    refetch()
  }, [refetch])

  const handlePurchase = async (examDocId: string, score: number) => {
    setPurchaseLoading(examDocId)

    try {
      // Check if certificate already exists but unpaid
      const existingCert = await queryData('certificates', 'examId', examDocId)

      if (existingCert.fullData.length > 0 && !existingCert.fullData[0].paid) {
        // If certificate exists but unpaid, redirect to payment
        router.push(`/payment/${existingCert.fullData[0].certificateNumber}`)
      } else {
        // Create new certificate
        const certificateId = Math.floor(100000000 + Math.random() * 900000000)
        const today = new Date()

        const docResp = await addDocInCollection('certificates', {
          examId: examDocId,
          userId: user.id,
          userName: `${user.firstName} ${user.lastName}`,
          createdAt: new Date().getTime(),
          score: Math.round(score),
          certificateNumber: certificateId,
          certificateEmail: user.email,
          imageId: '',
          paid: false,
          price: 50,
          expiryDateTime: today.setFullYear(today.getFullYear() + 5),
          imageUrl: '',
        })

        if (docResp && docResp.status) {
          router.push(`/payment/${certificateId}`)
        } else {
          showNotification({
            message: t`An error occurred while creating the certificate. Please try again.`,
            color: 'red',
          })
        }
      }
    } catch (e: any) {
      showNotification({
        message: e.message || t`An error occurred while creating the certificate. Please try again.`,
        color: 'red',
      })
    }

    setPurchaseLoading(null)
  }

  const columns = useMemo(
    () => [
      columnHelper.accessor('date', {
        header: t`Date`,
        cell: ({ getValue }) => <DateFormatter date={new Date(getValue())} />,
      }),

      columnHelper.accessor('score', {
        header: t`Score`,
        // cell: ({ getValue, row }) => {
        //   const score = getValue()
        //   const passed = score >= PASSING_SCORE

        //   return (
        //     <Group gap="xs">
        //       <span>{Math.round(score)}%</span>
        //       <Badge
        //         color={passed ? 'green' : 'red'}
        //         size="sm"
        //       >
        //         {passed ? t`Passed` : t`Failed`}
        //       </Badge>
        //     </Group>
        //   )
        // },
      }),

      columnHelper.accessor('language', {
        header: t`Test Language`,
      }),

      columnHelper.accessor('certificateNumber', {
        header: t`Certificate Number`,
        cell: ({ row }) => {
          const passed = row.original.score >= PASSING_SCORE

          // Show certificate number only if passed AND paid
          if (passed && row.original.paid) {
            return row.original.certificateNumber
          }

          // Show "-" for failed tests or unpaid certificates
          return '-'
        },
      }),

      columnHelper.display({
        id: 'actions',
        header: t`Action`,
        cell: ({ row }) => {
          const passed = row.original.score >= PASSING_SCORE

          // If test was not passed, show "-"
          if (!passed) {
            return <span className="text-gray-400">-</span>
          }

          // Show View only if certificate exists AND is paid
          if (row.original.certDocId && row.original.paid) {
            return (
              <Anchor component={Link} href={`/user/certificate/${row.original.certDocId}`}>
                <Trans>View</Trans>
              </Anchor>
            )
          }

          // Show Purchase for passed tests with unpaid or no certificate
          return (
            <Anchor
              component="button"
              onClick={() => handlePurchase(row.original.docId, row.original.score)}
              style={{ opacity: purchaseLoading === row.original.docId ? 0.6 : 1 }}
            >
              {purchaseLoading === row.original.docId ? t`Processing...` : <Trans>Purchase</Trans>}
            </Anchor>
          )
        },
        meta: {
          width: 110,
        },
      }),
    ],
    [t, purchaseLoading],
  )

  const table = useReactTable({
    data: data || EMPTY_ARRAY,
    state: {
      pagination,
    },
    columns,
    enableSorting: true,
    enableSortingRemoval: false,
    enableMultiSort: false,
    onPaginationChange: setPagination,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
  })

  return (
    <Stack>
      <Group>
        <PageTitle>
          <Trans>My Tests</Trans>
        </PageTitle>

        <Button
          component={Link}
          href="/welcome"
          className="ml-auto"
          onClick={() => {
            // setStart(true)
            localStorage.setItem('isShowResultScreen', 'true')
            startExam()
          }}
        >
          <Trans>Take a Test</Trans>
        </Button>
      </Group>

      {!isPending && !data?.length && (
        <Center>
          <Trans>You have not taken any tests</Trans>
        </Center>
      )}

      <ReactTable table={table} showPlaceholder={isPending} />
    </Stack>
  )
}

export default TestTable
