import { getAllDocs } from '@/api/doc'
import LineChart from '@/components/Chart/LineChart'
import AdminLayout from '@/components/Layout/AdminLayout'
import AppHead from '@/components/Layout/AppHead'
import PageLoader from '@/components/Loader/PageLoader'
import PageTitle from '@/components/Title/PageTitle'
import { useUser } from '@/contexts/UserProvider'
import useLoginRedirect from '@/hooks/useLoginRedirect'
import { useLingui } from '@lingui/react/macro'
import { Stack } from '@mantine/core'
import { IconCoin, IconMailCheck, IconUsers } from '@tabler/icons-react'
import { format } from 'date-fns'
import { FC, useEffect, useRef, useState } from 'react'

interface Props {}

const DashboardPage: FC<Props> = () => {
  useLoginRedirect()
  const { t } = useLingui()
  const { fetching } = useUser()

  // States
  const [isLoading, setLoading] = useState(true)
  // Chart States
  const [usersData, setUsersData] = useState([])
  const [userLabels, setUserLabels] = useState([])
  const [examsData, setExamsData] = useState([])
  const [examsLabels, setExamsLabels] = useState([])
  const [anaRegs, setAnaRegs] = useState([])
  const [totalUsers, setTotalUsers] = useState(0)
  const [examsFiltersApplied, setExamsFiltersApplied] = useState<any>(null)
  const [totalExams, setTotalExams] = useState(0)
  const [transactionData, setTransactionData] = useState<any>(null)
  const [transactions, setTransactions] = useState<any>([])
  const [totalTransactions, setTotalTransactions] = useState(0)
  const [languageFilter, setLanguageFilter] = useState<string>('')
  // Date Filters
  const [userDateRange, setUserDateRange] = useState<any>(null)
  const [transactionsDateRange, setTransactionsDateRange] = useState<any>(null)
  const [examDateRange, setExamDateRange] = useState<any>(null)
  const [examsFetched, setExamsFetched] = useState<any>(null)
  const [usersFetched, setUsersFetched] = useState<any>(null)
  const [examData, setExamData] = useState<any>(null)
  const first = useRef(true)

  const getTransactions = async () => {
    setLoading(true)
    const resp = await getAllDocs('transactions')
    if (resp.status && resp.fullData.length > 0) {
      setTransactionData(resp.fullData)
    }
  }

  const getAllExams = async () => {
    const resp = await getAllDocs('exams_completed')
    if (resp.status && resp.fullData.length > 0) {
      setExamsFetched(resp.fullData)
    }
  }

  const getAllUsers = async () => {
    const resp = await getAllDocs('users')
    if (resp.status && resp.fullData.length > 0) {
      setUsersFetched(resp.fullData)
    }
  }

  const getAnalyticsRegis = async () => {
    setLoading(true)
    if (first.current) {
      first.current = false

      await fetch(process.env.NEXT_PUBLIC_UPDATE_USER_ANALYTICS as string, {
        method: 'POST',
        headers: {
          Accept: 'application/json, text/plain, */*',
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({}),
      })
    }
    const resp = await getAllDocs('analytics_registrations')
    setLoading(false)
    if (resp.status && resp.fullData.length > 0) {
      setAnaRegs(resp.fullData)
    }
  }

  useEffect(() => {
    getAllUsers()
    getAllExams()
    getAnalyticsRegis()
    getTransactions()
  }, [])

  useEffect(() => {
    if (transactionData && transactionData.length) {
      const obj: any = {
        1: 0,
        2: 0,
        3: 0,
        4: 0,
        5: 0,
        6: 0,
        7: 0,
        8: 0,
        9: 0,
        10: 0,
        11: 0,
        12: 0,
      }

      let payments = transactionData
      if (transactionsDateRange && transactionsDateRange.startDate && transactionsDateRange.endDate) {
        payments = payments.filter((row: any) => {
          return (
            new Date(row.transactionDate) >= transactionsDateRange.startDate &&
            new Date(row.transactionDate) <= transactionsDateRange.endDate
          )
        })
      }

      if (languageFilter && languageFilter !== 'Language' && languageFilter !== '') {
        payments = payments.filter((row: any) => {
          return row.language === languageFilter
        })
      }

      payments.forEach((row: any) => {
        const transactionMonth = row.month
        obj[transactionMonth] = obj[transactionMonth] + row.amount
      })

      const arr: any = Object.values(obj)
      const total = arr.reduce((a: number, b: number) => a + b, 0)

      setTotalTransactions(total)
      setTransactions(arr)
    }
  }, [transactionData, transactionsDateRange, languageFilter])

  useEffect(() => {
    if (anaRegs && anaRegs.length) {
      // Chart Data
      const data: any = []
      const labels: any = []
      let total: any = 0

      let usersList = anaRegs.sort(function (x: any, y: any) {
        return new Date(x.date).valueOf() - new Date(y.date).valueOf()
      })

      if (userDateRange && userDateRange.startDate && userDateRange.endDate) {
        usersList = usersList.filter((row: any) => {
          return new Date(row.date) >= userDateRange.startDate && new Date(row.date) <= userDateRange.endDate
        })
      }

      for (let i = 0; i < usersList.length; i++) {
        const userItem: any = usersList[i]
        if (userItem && userItem.date) {
          const createdAt = userItem.date
          const month = format(new Date(createdAt), 'MMM dd')
          labels.push(month)
          data.push(userItem.counts)
          total = total + userItem.counts
        }
      }

      setUsersData(data)
      setUserLabels(labels)
      setTotalUsers(total)
    }
  }, [anaRegs, userDateRange])

  const filterCount = (examItems: any, examsFiltersApplied: any) => {
    let newCount = 0
    const filtersToApply: any = {}
    Object.entries(examsFiltersApplied).forEach(([key, value]) => {
      if (key === 'email' && value !== '') {
        if (value === 'Email Sent') {
          filtersToApply.email = true
        } else {
          filtersToApply.email = false
        }
        return value
      }

      if (key === 'complete' && value !== '') {
        if (value === 'Complete') {
          filtersToApply.status = true
        } else {
          filtersToApply.status = false
        }
      }

      if (key === 'payment' && value !== '') {
        if (value === 'Paid') {
          filtersToApply.payment = true
        } else {
          filtersToApply.payment = false
        }
      }
    })

    const filteredArr = examItems.filter((item: any) => {
      return Object.entries(filtersToApply).every(([key, value]) => item[key] === value)
    })
    newCount = filteredArr.length
    return newCount
  }

  const convertExamsDate = (timestamp: any) => {
    const date = new Date(Number(timestamp))
    const day = date.getDate()
    const month = date.getMonth() + 1 // JavaScript Months are zero-based, so add 1 to get the correct month
    const year = date.getFullYear()
    return `${year}/${month}/${day}`
  }

  useEffect(() => {
    if (examsFetched && examsFetched.length > 0) {
      const arr: any = []
      for (let i = 0; i < examsFetched.length; i++) {
        const exam: any = examsFetched[i]
        const status = exam.status && exam.status.toLowerCase() === 'complete' ? true : false

        const payment = exam.payment && exam.payment.toLowerCase() === 'paid' ? true : false

        const user: any = usersFetched.find((item: any) => item.docId === exam.user_id)

        arr.push({
          id: exam.docId,
          date: exam.completed_at ? convertExamsDate(exam.completed_at) : '',
          status,
          payment,
          email: user && user.email_sent ? true : false,
        })
      }

      setExamData(arr)
    }
  }, [examsFetched])

  useEffect(() => {
    if (examData && examData.length > 0) {
      let examsList = examData.sort(function (x: any, y: any) {
        return new Date(x.date).valueOf() - new Date(y.date).valueOf()
      })

      if (examDateRange && examDateRange.startDate && examDateRange.endDate) {
        examsList = examsList.filter((row: any) => {
          return new Date(row.date) >= examDateRange.startDate && new Date(row.date) <= examDateRange.endDate
        })
      }

      const organizedData: any = {}
      examsList.forEach((item: any) => {
        if (item.date !== '') {
          if (!organizedData[item.date]) {
            organizedData[item.date] = [item]
          } else {
            organizedData[item.date].push(item)
          }
        }
      })

      // Chart Data
      const data: any = []
      const labels: any = []
      let total: any = 0

      Object.entries(organizedData).forEach(([key, value]: any) => {
        const month = format(new Date(key), 'MMM dd')
        labels.push(month)
        if (examsFiltersApplied) {
          const newCount = filterCount(value, examsFiltersApplied)
          data.push(newCount)
          total = total + newCount
        } else {
          data.push(value.length)
          total = total + value.length
        }
      })

      setExamsData(data)
      setExamsLabels(labels)
      setTotalExams(total)
    }
  }, [examData, examDateRange, examsFiltersApplied])

  if (fetching) return <PageLoader />

  return (
    <AdminLayout>
      <AppHead title={t`Dashboard`} />

      <Stack className="gap-xl">
        <PageTitle>Dashboard</PageTitle>

        <LineChart
          data={transactions}
          icon={<IconCoin />}
          title={'Total Earnings'}
          value={`$${totalTransactions ? totalTransactions : 0}`}
          currencyChart={true}
          isLoading={isLoading}
          setLanguageFilter={setLanguageFilter}
          onApplyDateRange={setTransactionsDateRange}
        />

        <LineChart
          labels={userLabels && userLabels}
          data={usersData && usersData}
          icon={<IconUsers />}
          title={'Registered Accounts'}
          value={totalUsers ? totalUsers : 0}
          isLoading={isLoading}
          onApplyDateRange={setUserDateRange}
        />

        <LineChart
          labels={examsLabels && examsLabels}
          data={examsData && examsData}
          icon={<IconMailCheck />}
          title={'Exams Taken'}
          value={totalExams ? totalExams : 0}
          isLoading={isLoading}
          onApplyDateRange={setExamDateRange}
          setExamsFiltersApplied={setExamsFiltersApplied}
        />
      </Stack>
    </AdminLayout>
  )
}

export default DashboardPage
