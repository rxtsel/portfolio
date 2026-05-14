import { Temporal } from "@js-temporal/polyfill"
import { getLocaleLanguageTag, type Locale } from "@/lib/i18n"
import { dateTimeLabels, getDateTimeUnitLabel } from "@/lib/date-time-labels"

type DateInput = Date | string | Temporal.PlainDate

function getDateString(value: DateInput) {
  if (value instanceof Temporal.PlainDate) {
    return value.toString()
  }

  if (value instanceof Date) {
    return value.toISOString().slice(0, 10)
  }

  return value
}

export function toPlainDate(value: DateInput) {
  return Temporal.PlainDate.from(getDateString(value))
}

export function toDate(value: DateInput) {
  const plainDate = toPlainDate(value)

  return new Date(plainDate.year, plainDate.month - 1, plainDate.day)
}

export function toIsoDate(value: DateInput) {
  return toPlainDate(value).toString()
}

export function toIsoDateTime(value: DateInput) {
  return `${toIsoDate(value)}T00:00:00.000Z`
}

export function compareDatesDescending(current: DateInput, next: DateInput) {
  return Temporal.PlainDate.compare(toPlainDate(next), toPlainDate(current))
}

export function formatBlogDate(value: DateInput, locale: Locale) {
  return new Intl.DateTimeFormat(getLocaleLanguageTag(locale), {
    day: "numeric",
    month: "short",
    year: "numeric",
  }).format(toDate(value))
}

export function formatExperienceDate(value: DateInput, locale: Locale) {
  return new Intl.DateTimeFormat(getLocaleLanguageTag(locale), {
    month: "short",
    year: "numeric",
  }).format(toDate(value))
}

export function formatDuration(startValue: DateInput, endValue: DateInput, locale: Locale) {
  const duration = toPlainDate(startValue).until(toPlainDate(endValue), { largestUnit: "years" })
  const parts = []

  if (duration.years > 0) {
    parts.push(`${duration.years} ${getDateTimeUnitLabel("year", duration.years, locale)}`)
  }

  if (duration.months > 0) {
    parts.push(`${duration.months} ${getDateTimeUnitLabel("month", duration.months, locale)}`)
  }

  return parts.join(", ") || `0 ${getDateTimeUnitLabel("month", 0, locale)}`
}

export function formatInclusiveMonthDuration(startValue: DateInput, endValue: DateInput, locale: Locale) {
  const startDate = toPlainDate(startValue)
  const endDate = toPlainDate(endValue)
  const totalMonths = Math.max(0, (endDate.year - startDate.year) * 12 + endDate.month - startDate.month + 1)
  const years = Math.floor(totalMonths / 12)
  const months = totalMonths % 12
  const parts = []

  if (years > 0) {
    parts.push(`${years} ${getDateTimeUnitLabel("year", years, locale)}`)
  }

  if (months > 0) {
    parts.push(`${months} ${getDateTimeUnitLabel("month", months, locale)}`)
  }

  return parts.join(", ") || `0 ${getDateTimeUnitLabel("month", 0, locale)}`
}

export function formatExperienceRange(startValue: DateInput, endValue: DateInput | "", locale: Locale) {
  const today = Temporal.Now.plainDateISO()
  const endDate = endValue ? toPlainDate(endValue) : today
  const dateRange = `${formatExperienceDate(startValue, locale)} - ${
    endValue ? formatExperienceDate(endValue, locale) : getPresentLabel(locale)
  }`

  return `${dateRange} · ${formatInclusiveMonthDuration(startValue, endDate, locale)}`
}

export function getPresentLabel(locale: Locale) {
  return dateTimeLabels[locale].present
}
