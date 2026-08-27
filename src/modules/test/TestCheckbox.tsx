import { Checkbox, Group, Text } from '@mantine/core'
import { FC } from 'react'

interface Props {
  checked: boolean
  onChange: () => void
  answer: string
}

const TestCheckbox: FC<Props> = ({ checked, onChange, answer }) => {
  return (
    <Checkbox.Card className="border-none" checked={checked} onChange={onChange}>
      <Group wrap="nowrap">
        <Checkbox.Indicator />

        <Text className="flex-1 px-4 py-2 bg-gray-100 border border-gray-400">{answer}</Text>
      </Group>
    </Checkbox.Card>
  )
}

export default TestCheckbox
