export const calculateDuration = ({
  startDate,
  locale = undefined
}: {
  startDate: Date | string
  locale: 'en' | 'es' | undefined
}): string => {
  const toDate = (date: Date | string): Date => {
    return typeof date === 'string' ? new Date(date) : date
  }
  if (locale === undefined) locale = 'es'

  const translateMonth = locale === 'es' ? 'mes' : 'month'
  const translateYear = locale === 'es' ? 'año' : 'year'
  const translateMonths = locale === 'es' ? 'meses' : 'months'
  const translateYears = locale === 'es' ? 'años' : 'years'

  const startDateObject = toDate(startDate)
  const currentDate = new Date()
  const monthDifference =
    (currentDate.getFullYear() - startDateObject.getFullYear()) * 12 +
    (currentDate.getMonth() - startDateObject.getMonth())

  if (monthDifference >= 12) {
    const years = Math.floor(monthDifference / 12)
    const months = monthDifference % 12
    return `${years} ${
      years === 1 ? translateYear : translateYears
    } ${months} ${months === 1 ? translateMonth : translateMonths}`
  } else {
    return `${monthDifference} ${
      monthDifference === 1 ? translateMonth : translateMonths
    }`
  }
}
