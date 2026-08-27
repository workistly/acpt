import { Trans } from '@lingui/react/macro'
import { Group, Loader, Text } from '@mantine/core'
import { FC } from 'react'

interface Props {
  loading?: boolean
  length?: number
}

const TableTotal: FC<Props> = ({ loading, length }) => {
  return (
    <Group gap={6}>
      {loading ? <Loader size="xs" /> : <Text fz="sm">{length}</Text>}

      <Text fz="sm" c="dimmed">
        <Trans>row(s)</Trans>
      </Text>
    </Group>
  )
}

export default TableTotal
