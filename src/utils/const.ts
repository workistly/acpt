import { msg } from '@lingui/core/macro'
import { CSSProperties } from 'react'

export const EMPTY_ARRAY: any[] = []

export const DEFAULT_LANGUAGE = 'en'

export const DEFAULT_PER_PAGE = 20

export const FORMAT_DATE_ONLY = 'MMM d, yyyy'
export const FORMAT_DATE_WITH_TIME = 'yyyy-MM-dd HH:mm'
export const FORMAT_DATE_DATEPICKER = 'YYYY-MM-DD'
export const FORMAT_DATE_WITH_TIME_DATEPICKER = 'YYYY-MM-DD HH:mm'
export const FORMAT_DATE_WITH_WEEK = 'EEEE, do MMMM yyyy'

export const FIELD_REQUIRED_MESSAGE = msg`This field is required`
export const FIELD_EMAIL_MESSAGE = msg`Invalid email`
export const FIELD_PASSWORD_MESSAGE = msg`Password must be at least 8 characters`

export const QUERY_STALE_TIME = 60 * 1000
export const QUERY_RELOAD_TIME = 15 * 1000

export const OPEN_NEW_TAB = {
  target: '_blank',
  rel: 'noopener noreferrer',
}

export const TEXT_ELLIPSIS: CSSProperties = {
  overflow: 'hidden',
  whiteSpace: 'nowrap',
  textOverflow: 'ellipsis',
}

export const LANGUAGES: { label: string; value: string }[] = [
  { value: 'en', label: `English` },
  { value: 'es', label: `Español` },
  { value: 'tr', label: `Türkçe` },
]

export const LANGUAGE_OPTIONS = LANGUAGES.map((el) => el.label)
