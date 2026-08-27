import { ActionIcon, CopyButton, TextInput } from '@mantine/core'
import { IconCheck, IconCopy } from '@tabler/icons-react'
import { FC } from 'react'

interface Props {
  label?: string
  value: string
}

const CopyInput: FC<Props> = ({ label, value }) => {
  return (
    <TextInput
      label={label}
      value={value}
      readOnly
      rightSection={
        <CopyButton value={value}>
          {({ copied, copy }) => (
            <ActionIcon variant="subtle" size="lg" onClick={copy}>
              {copied ? <IconCheck size={18} /> : <IconCopy size={18} />}
            </ActionIcon>
          )}
        </CopyButton>
      }
    />
  )
}

export default CopyInput
