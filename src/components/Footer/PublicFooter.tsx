import logo from '@/assets/logo-full.svg'
import NextImage from '@/components/Image/NextImage'
import { useLingui } from '@lingui/react/macro'
import { Anchor, Container, Flex, Text } from '@mantine/core'
import Link from 'next/link'
import { FC, useMemo } from 'react'

const today = new Date()

interface Props {}

const PublicFooter: FC<Props> = () => {
  const { t } = useLingui()

  const menu = useMemo(
    () => [
      {
        title: t`Terms`,
        url: '/terms',
      },
      {
        title: t`Privacy`,
        url: '/privacy',
      },
      {
        title: t`Cookie`,
        url: '/cookie',
      },
      {
        title: t`FAQ`,
        url: '/faq',
      },
      {
        title: t`Contact Us`,
        url: '/contact',
      },
    ],
    [t],
  )

  return (
    <Container className="pt-6 pb-15">
      <Flex className="max-sm:flex-col gap-4">
        <Link href="/">
          <NextImage src={logo} alt="ACPT" />
        </Link>

        <Flex className="max-sm:flex-col sm:ml-auto sm:items-center">
          {menu.map((el) => (
            <Anchor
              key={el.title}
              component={Link}
              href={el.url}
              fz={18}
              c="red.6"
              lh={1}
              className="max-sm:py-2 sm:px-2 sm:border-r sm:border-r-gray-600"
            >
              {el.title}
            </Anchor>
          ))}

          <Text fz={18} className="max-sm:mt-2 sm:ml-2">
            &copy; {today.getFullYear()} ACPT
          </Text>
        </Flex>
      </Flex>
    </Container>
  )
}

export default PublicFooter
