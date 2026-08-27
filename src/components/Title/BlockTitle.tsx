import { Title, TitleOrder } from '@mantine/core'
import { FC, PropsWithChildren } from 'react'
import { twMerge } from 'tailwind-merge'
import classes from './BlockTitle.module.css'

interface Props extends PropsWithChildren {
  order?: TitleOrder
  className?: string
}

const BlockTitle: FC<Props> = ({ order = 2, className, children }) => {
  return (
    <Title order={order} className={twMerge('text-[32px]', classes.title, className)}>
      {children}
    </Title>
  )
}

export default BlockTitle
