import AdminFilters from '@/components/Filter/AdminFilters'
import { LANGUAGE_OPTIONS } from '@/utils/const'
import { nFormatter } from '@/utils/utils'
import { Card, Center, Group, Loader, Select, Stack, Text } from '@mantine/core'
import { DatePickerInput } from '@mantine/dates'
import { IconCalendar } from '@tabler/icons-react'
import {
  BarElement,
  CategoryScale,
  Chart as ChartJS,
  Filler,
  Legend,
  LinearScale,
  LineElement,
  PointElement,
  Title,
  Tooltip,
} from 'chart.js'
import { FC, ReactNode, useEffect, useState } from 'react'
import { Line } from 'react-chartjs-2'

ChartJS.register(CategoryScale, LinearScale, PointElement, BarElement, LineElement, Title, Tooltip, Legend, Filler)

interface LineChartProps {
  labels?: any
  data?: any
  title?: string
  value?: any
  icon?: ReactNode
  currencyChart?: boolean
  isLoading?: boolean
  onApplyDateRange?: (date: any) => void
  setExamsFiltersApplied?: any
  setLanguageFilter?: any
}

const LineChart: FC<LineChartProps> = ({
  labels,
  data,
  title,
  value,
  icon,
  currencyChart,
  isLoading,
  onApplyDateRange,
  setExamsFiltersApplied,
  setLanguageFilter,
}) => {
  const [filters, setFilters] = useState<any>(null)
  const labelsPoints: string[] = labels
    ? labels
    : ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']
  const dataPoints: number[] = data

  useEffect(() => {
    if (filters && (filters.complete !== '' || filters.payment !== '' || filters.email !== '')) {
      if (title === 'Exams Taken' && setExamsFiltersApplied) {
        setExamsFiltersApplied(filters)
      }
    } else if (setExamsFiltersApplied) {
      setExamsFiltersApplied(null)
    }
  }, [filters])

  if (isLoading) {
    return (
      <Center h={370}>
        <Loader />
      </Center>
    )
  }

  return (
    <Card withBorder radius="md">
      <Group>
        <Group>
          {icon ? (
            <Center w={42} h={42} className="rounded-xl bg-gray-100">
              {icon}
            </Center>
          ) : (
            ''
          )}
          <Stack gap={0}>
            {title && <Text className="text-lg">{title}</Text>}
            <Text className="text-2xl font-bold">{value}</Text>
          </Stack>
        </Group>

        <Group className="ml-auto">
          {setLanguageFilter && (
            <Select clearable data={LANGUAGE_OPTIONS} placeholder="Language" onChange={setLanguageFilter} />
          )}

          {setExamsFiltersApplied && <AdminFilters onApplyFilters={setFilters} setFiltersApplied={setFilters} />}

          {onApplyDateRange && (
            <DatePickerInput
              clearable
              type="range"
              placeholder="Select dates"
              leftSection={<IconCalendar />}
              onChange={([start, end]) =>
                onApplyDateRange({
                  startDate: start ? new Date(start) : null,
                  endDate: end ? new Date(end) : null,
                })
              }
            />
          )}
        </Group>
      </Group>
      {dataPoints && dataPoints.length ? (
        <div>
          <Line
            height={'370'}
            data={{
              labels: labelsPoints,
              datasets: [
                {
                  data: dataPoints,
                  borderColor: 'black',
                  fill: false,
                  cubicInterpolationMode: 'monotone',
                  tension: 0.4,
                },
              ],
            }}
            options={{
              interaction: {
                intersect: false,
              },
              responsive: true,
              maintainAspectRatio: false,
              scales: {
                x: {
                  display: true,
                  title: {
                    display: true,
                  },
                  grid: {
                    display: false,
                  },
                },
                y: {
                  display: true,
                  title: {
                    display: false,
                    text: 'Value',
                  },
                  min: 0,
                  grid: {
                    display: false,
                  },
                  ticks: {
                    display: true,
                    color: '#888',
                    font: {
                      size: 12,
                      lineHeight: 12,
                      weight: 400,
                      family: "'Helvetica Neue', 'Helvetica', 'Arial', sans-serif",
                    },
                    autoSkip: false,
                    callback: function (value: any, index, values) {
                      const tickValue = parseFloat(value)

                      if (currencyChart) {
                        if (tickValue >= 0) {
                          return '$' + tickValue.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',')
                        } else {
                          return (
                            '-$' +
                            Math.abs(tickValue)
                              .toString()
                              .replace(/\B(?=(\d{3})+(?!\d))/g, ',')
                          )
                        }
                      } else {
                        return nFormatter(tickValue, 1)
                      }
                    },
                  },
                },
              },
              plugins: {
                title: {
                  display: false,
                  text: '',
                },
                legend: {
                  display: false,
                },
              },
            }}
          />
        </div>
      ) : (
        <Center>No Data Found</Center>
      )}
    </Card>
  )
}

export default LineChart
