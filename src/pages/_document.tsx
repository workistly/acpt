import { font1 } from '@/styles/theme'
import { ColorSchemeScript } from '@mantine/core'
import { Html, Head, Main, NextScript } from 'next/document'

export default function Document() {
  return (
    <Html className={font1.className}>
      <Head>
        <ColorSchemeScript defaultColorScheme="light" forceColorScheme="light" />
      </Head>
      <body>
        <Main />
        <NextScript />
      </body>
    </Html>
  )
}
