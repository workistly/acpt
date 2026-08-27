import { Title, TitleOrder } from '@mantine/core'
import { FC, PropsWithChildren } from 'react'
import { twMerge } from 'tailwind-merge'

interface Props extends PropsWithChildren {
  order?: TitleOrder
  className?: string
}

const PageTitle: FC<Props> = ({ order = 1, className, children }) => {
  return (
    <Title order={order} className={twMerge('text-[32px] text-center', className)}>
      {children}
    </Title>
  )
}

export default PageTitle
