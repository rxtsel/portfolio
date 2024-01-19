/**
 * Calculate the duration between the start date and the current date.
 * @function
 * @param {Date | string} startDate - The start date of the duration.
 * @returns {string} - The formatted duration string.
 */
export const calculateDuration = ({
  startDate,
  locale = 'es'
}: {
  startDate: Date | string
  locale: 'en' | 'es'
}): string => {
  /**
   * Convert a string or Date to a Date object.
   * @param {Date | string} date - The date to be converted.
   * @returns {Date} - The converted Date object.
   */
  const toDate = (date: Date | string): Date => {
    return typeof date === 'string' ? new Date(date) : date
  }

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
