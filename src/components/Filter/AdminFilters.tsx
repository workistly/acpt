import { Button, Group, Popover, Select, Stack } from '@mantine/core'
import { IconFilter2 } from '@tabler/icons-react'
import { FC, useImperativeHandle, useState } from 'react'

interface Props {
  ref?: any
  onApplyFilters?: (e: any) => void
  setFiltersApplied?: (val: boolean) => void
}

const AdminFilters: FC<Props> = ({ ref, onApplyFilters, setFiltersApplied }) => {
  const defaultValues = { email: '', complete: '', payment: '' }

  // States
  const [open, setOpen] = useState(false)
  const [filterValues, setFilterValues] = useState(defaultValues)

  const resetFilters = () => {
    if (setFiltersApplied) {
      setFiltersApplied(false)
    }
    setFilterValues(defaultValues)
    setOpen(false)
  }

  // Forward Ref function
  useImperativeHandle(ref, () => ({
    handleRemoveFilter(name: string, value: string | null) {
      handleRemoveFilter(name, value)
    },
  }))

  const handleRemoveFilter = (name: string, value: string | null) => {
    const tempData: any = { ...filterValues }
    tempData[name] = value ?? ''
    setFilterValues(tempData)
    if (onApplyFilters) {
      onApplyFilters(tempData)
    }
  }

  const handleChangeFilter = (name: string, value: string | null) => {
    const tempData: any = { ...filterValues }
    tempData[name] = value ?? ''
    setFilterValues(tempData)
  }

  const handleApplyFilters = () => {
    setOpen(false)
    if (onApplyFilters) {
      onApplyFilters(filterValues)
    }
  }

  return (
    <Popover opened={open}>
      <Popover.Target>
        <Button
          variant="outline"
          size="lg"
          color="gray.4"
          c="gray.6"
          fw={400}
          leftSection={<IconFilter2 />}
          onClick={() => setOpen((o) => !o)}
        >
          Filters
        </Button>
      </Popover.Target>
      <Popover.Dropdown>
        <Stack>
          <Select
            clearable
            placeholder="Email Status"
            data={['Email Sent', 'Email Not Sent']}
            value={filterValues.email}
            onChange={(val) => handleChangeFilter('email', val)}
          />

          <Select
            clearable
            placeholder="Complete Status"
            data={['Complete', 'Incomplete']}
            value={filterValues.complete}
            onChange={(val) => handleChangeFilter('complete', val)}
          />

          <Select
            clearable
            placeholder="Payment Status"
            data={['Paid', 'Unpaid']}
            value={filterValues.payment}
            onChange={(val) => handleChangeFilter('payment', val)}
          />

          <Group>
            <Button onClick={resetFilters} variant="outline">
              Cancel
            </Button>

            <Button onClick={handleApplyFilters}>Apply Filter</Button>
          </Group>
        </Stack>
      </Popover.Dropdown>
    </Popover>
  )
}

export default AdminFilters
