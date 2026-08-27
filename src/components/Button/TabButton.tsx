import { createPolymorphicComponent, UnstyledButton, UnstyledButtonProps } from '@mantine/core'
import { FC, forwardRef, PropsWithChildren } from 'react'
import { twMerge } from 'tailwind-merge'

interface Props extends UnstyledButtonProps, PropsWithChildren {
  active: boolean
  onClick?: () => void
}

const TabButton: FC<Props> = createPolymorphicComponent<'button', Props>(
  // eslint-disable-next-line react/display-name
  forwardRef<HTMLButtonElement, Props>(({ active, className, ...props }, ref) => {
    return (
      <UnstyledButton
        ref={ref}
        className={twMerge(
          'font-semibold text-lg rounded-t-[8px] px-4 py-2 shrink-0',
          active ? 'bg-red-600 text-white' : 'bg-gray-50 text-gray-600 hover:bg-red-600 hover:text-white',
        )}
        {...props}
      />
    )
  }),
)

TabButton.displayName = 'TabButton'

export default TabButton
