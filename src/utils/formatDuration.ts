interface DurationOptions {
  startDate: Date | string
  endDate?: Date | string
  locale: 'es' | 'en'
}

/**
 * Options for formatting duration.
 * @interface DurationOptions
 * @property {Date | string} startDate - The start date of the duration.
 * @property {Date | string} [endDate] - The end date of the duration (optional).
 */

/**
 * Format the duration based on start and end dates.
 * @function
 * @param {DurationOptions} options - The options for formatting the duration.
 * @returns {string} - The formatted duration string.
 */
export const formatDuration = ({
  startDate,
  endDate,
  locale = 'es'
}: DurationOptions): string => {
  /**
   * Convert a string or Date to a Date object.
   * @param {Date | string} date - The date to be converted.
   * @returns {Date} - The converted Date object.
   */
  const toDate = (date: Date | string): Date => {
    return typeof date === 'string' ? new Date(date) : date
  }

  const startDateP = toDate(startDate)
  const endDateP = endDate ? toDate(endDate) : undefined

  const startMonth = new Intl.DateTimeFormat(`${locale}-US`, {
    month: 'short'
  }).format(startDateP)

  const startYear = startDateP.getFullYear()

  const translateCurrently = locale === 'es' ? 'Actualmente' : 'Currently'

  if (endDateP) {
    const endMonth = new Intl.DateTimeFormat(`${locale}-US`, {
      month: 'short'
    }).format(startDateP)
    const endYear = startDateP.getFullYear()

    if (startMonth === endMonth && startYear === endYear) {
      return `${startMonth}. ${startYear} - ${translateCurrently}`
    } else {
      return `${startMonth}. ${startYear} - ${endMonth}. ${endYear}`
    }
  } else {
    return `${startMonth}. ${startYear} - ${translateCurrently}`
  }
}
