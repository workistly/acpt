import { DEFAULT_LANGUAGE } from '@/utils/const'
import { format, formatDistance, formatDuration, intervalToDuration } from 'date-fns'
import { useRouter } from 'next/router'

export const locales: any = {
  en: undefined,
}

export const useFormatDate = () => {
  const router = useRouter()

  return (date: Date | number, formatStr: string) =>
    format(date, formatStr, { locale: locales[router.locale || DEFAULT_LANGUAGE] })
}

export const useFormatDistance = () => {
  const router = useRouter()

  return (date: Date | number, baseDate: Date | number) =>
    formatDistance(new Date(date), new Date(baseDate), {
      locale: locales[router.locale || DEFAULT_LANGUAGE],
      addSuffix: true,
    })
}

export const useFormatDuration = () => {
  const router = useRouter()

  return (date: Date | number) => {
    const duration = intervalToDuration({
      start: new Date(),
      end: new Date(date),
    })

    return formatDuration(duration, {
      format: ['days', 'hours', 'minutes'],
      locale: locales[router.locale || DEFAULT_LANGUAGE],
    })
  }
}

export const useFormatNumber = () => {
  const router = useRouter()

  return (value?: number | string | null, minimumFractionDigits?: number, maximumFractionDigits?: number) =>
    new Intl.NumberFormat(router.locale, {
      minimumFractionDigits,
      maximumFractionDigits,
    }).format(Number(value))
}

export const useFormatCurrency = () => {
  const router = useRouter()

  return (value?: number | string | null, minimumFractionDigits = 0, maximumFractionDigits = 2) =>
    new Intl.NumberFormat(router.locale, {
      minimumFractionDigits,
      maximumFractionDigits,
    }).format(Number(value))
}
