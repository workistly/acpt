import '@/styles/globals.css'
import AppProvider from '@/components/AppProvider'
import { DEFAULT_LANGUAGE } from '@/utils/const'
import { i18n } from '@lingui/core'
import { I18nProvider } from '@lingui/react'
import { Notifications } from '@mantine/notifications'
import { HydrationBoundary } from '@tanstack/react-query'
import App, { AppContext, AppProps } from 'next/app'
import { useMemo } from 'react'

interface Props {
  language: string
  catalog: any
  dehydratedState?: any
}

const MyApp = ({ language, catalog, Component, pageProps }: Props & AppProps) => {
  const i18nConfig = useMemo(() => {
    if (catalog) {
      i18n.load(language, catalog.messages)
      i18n.activate(language)
    }
    return i18n
  }, [])

  return (
    <I18nProvider i18n={i18nConfig}>
      <AppProvider>
        <HydrationBoundary state={pageProps.dehydratedState}>
          <Notifications />
          <Component {...pageProps} />
        </HydrationBoundary>
      </AppProvider>
    </I18nProvider>
  )
}

MyApp.getInitialProps = async (ctx: AppContext) => {
  const appProps = await App.getInitialProps(ctx)
  const language = ctx.ctx.locale || DEFAULT_LANGUAGE
  const catalog = await import(`../locales/${language}/messages.ts`)

  return {
    ...appProps,
    language,
    catalog,
  }
}

export default MyApp
