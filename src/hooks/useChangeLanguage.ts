import { DEFAULT_LANGUAGE } from '@/utils/const'
import { i18n } from '@lingui/core'
import { useRouter } from 'next/router'
import { setCookie } from 'nookies'
import { useCallback, useEffect } from 'react'

const useChangeLanguage = () => {
  const router = useRouter()

  useEffect(() => {
    const get = async () => {
      const language = router.locale || DEFAULT_LANGUAGE

      const catalog = await import(`../locales/${language}/messages.ts`)

      if (catalog) {
        i18n.load(language, catalog.messages)
        i18n.activate(language)
      }
    }

    get()
  }, [router.locale])

  return useCallback(
    async (locale: string) => {
      setCookie(undefined, 'NEXT_LOCALE', locale, { path: '/', httpOnly: false, maxAge: 3600 * 24 * 365 })
      router.push(
        {
          pathname: router.pathname,
          query: router.query,
        },
        undefined,
        {
          shallow: true,
          locale,
        },
      )
    },
    [router],
  )
}

export default useChangeLanguage
