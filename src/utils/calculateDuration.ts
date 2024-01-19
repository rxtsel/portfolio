import { differenceInCalendarMonths } from 'date-fns'

export const calculateDuration = ({
  startDate,
  locale
}: {
  startDate: Date
  locale: 'en' | 'es' | undefined
}): string => {
  if (locale === undefined) locale = 'es'

  const translateMonth = locale === 'es' ? 'mes' : 'month'
  const translateYear = locale === 'es' ? 'año' : 'year'
  const translateMonths = locale === 'es' ? 'meses' : 'months'
  const translateYears = locale === 'es' ? 'años' : 'years'

  const currentDate = new Date()
  const monthDifference = differenceInCalendarMonths(currentDate, startDate)

  if (monthDifference >= 12) {
    const years = Math.floor(monthDifference / 12)
    const months = monthDifference % 12

    const yearText =
      years > 0
        ? `${years} ${years === 1 ? translateYear : translateYears}`
        : ''
    const monthText =
      months > 0
        ? `${months} ${months === 1 ? translateMonth : translateMonths}`
        : ''

    return `${yearText} ${monthText}`
  } else {
    return `${monthDifference} ${
      monthDifference === 1 ? translateMonth : translateMonths
    }`
  }
}
