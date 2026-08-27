import { Collapse, Group, Stack, Text, UnstyledButton } from '@mantine/core'
import { useDisclosure } from '@mantine/hooks'
import { IconMinus, IconPlus } from '@tabler/icons-react'
import clsx from 'clsx'
import { FC } from 'react'

interface Props {
  question: string
  answer: string
}

const FAQItem: FC<Props> = ({ question, answer }) => {
  const [open, { toggle }] = useDisclosure(false)

  return (
    <Stack gap={0} className="border-b border-gray-200">
      <UnstyledButton
        className={clsx('font-semibold sm:text-lg py-4 sm:py-6', open ? 'text-red-600' : 'hover:text-red-600')}
        onClick={toggle}
      >
        <Group>
          {open ? <IconMinus size={18} /> : <IconPlus size={18} />}

          <div className="flex-1">{question}</div>
        </Group>
      </UnstyledButton>

      <Collapse in={open}>
        <Text className="sm:text-lg pl-8 pb-4">{answer}</Text>
      </Collapse>
    </Stack>
  )
}

export default FAQItem
