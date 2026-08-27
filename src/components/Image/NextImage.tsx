import Image, { ImageProps } from 'next/image'
import { FC } from 'react'
import { twMerge } from 'tailwind-merge'

const NextImage: FC<Omit<ImageProps, 'alt'> & { alt?: string }> = ({ className, ...props }) => {
  return <Image {...props} alt={props.alt || ''} className={twMerge('max-w-full h-auto object-cover', className)} />
}

export default NextImage
