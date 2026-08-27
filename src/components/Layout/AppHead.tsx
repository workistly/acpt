import Head from 'next/head'
import { useRouter } from 'next/router'
import { FC } from 'react'

type Props = {
  title?: string
  description?: string
  image?: string
}

const AppHead: FC<Props> = ({ title, description, image = `${process.env.NEXT_PUBLIC_URL}/img.jpg` }) => {
  const router = useRouter()

  const pageTitle = title ? (router.pathname !== '/' ? `${title} | ACPT` : title) : 'ACPT'

  return (
    <Head>
      <title>{pageTitle}</title>

      <link rel="icon" type="image/png" href="/favicon-96x96.png" sizes="96x96" />
      <link rel="icon" type="image/svg+xml" href="/favicon.svg" />
      <link rel="shortcut icon" href="/favicon.ico" />
      <link rel="apple-touch-icon" sizes="180x180" href="/apple-touch-icon.png" />
      <meta name="apple-mobile-web-app-title" content="ACPT" />
      <link rel="manifest" href="/site.webmanifest" />

      {description && <meta name="description" content={description} />}
      <meta property="og:title" content={pageTitle} />
      <meta property="og:site_name" content="ACPT" />
      {description && <meta property="og:description" content={description} />}
      <meta property="og:image" content={image} />
      <meta property="og:url" content={`${process.env.NEXT_PUBLIC_URL}${router.asPath}`} />
      <meta name="twitter:card" content="summary_large_image" />
    </Head>
  )
}

export default AppHead
