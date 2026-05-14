import { dateTimeLabels, getDateTimeUnitLabel } from "@/lib/date-time-labels"
import type { Locale } from "@/lib/i18n"

function getLocale(): Locale {
  return document.documentElement.lang.toLowerCase().startsWith("es") ? "es" : "en"
}

function getLanguageTag(locale: Locale) {
  return dateTimeLabels[locale].languageTag
}

function parseDate(value: string) {
  const [year = 0, month = 1, day = 1] = value.split("-").map(Number)

  return new Date(year, month - 1, day)
}

function formatDate(value: string, locale: Locale) {
  return new Intl.DateTimeFormat(getLanguageTag(locale), {
    month: "short",
    year: "numeric",
  }).format(parseDate(value))
}

function formatDuration(startValue: string, endDate: Date, locale: Locale) {
  const startDate = parseDate(startValue)
  const totalMonths = Math.max(
    0,
    (endDate.getFullYear() - startDate.getFullYear()) * 12 + endDate.getMonth() - startDate.getMonth() + 1,
  )
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

function updateExperienceDates() {
  const locale = getLocale()
  const today = new Date()

  document.querySelectorAll("[data-experience-range]").forEach((node) => {
    const startValue = node.getAttribute("data-start")
    const endValue = node.getAttribute("data-end")
    const isCurrent = node.getAttribute("data-current") === "true"

    if (!startValue) {
      return
    }

    const endDate = isCurrent || !endValue ? today : parseDate(endValue)
    const dateRange = `${formatDate(startValue, locale)} - ${
      isCurrent || !endValue ? dateTimeLabels[locale].present : formatDate(endValue, locale)
    }`

    node.textContent = `${dateRange} · ${formatDuration(startValue, endDate, locale)}`
  })
}

document.addEventListener("DOMContentLoaded", updateExperienceDates)
updateExperienceDates()
