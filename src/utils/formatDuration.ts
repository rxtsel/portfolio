interface DurationOptions {
  startDate: Date | string
  endDate?: Date | string
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
export const formatDuration = (options: DurationOptions): string => {
  /**
   * Convert a string or Date to a Date object.
   * @param {Date | string} date - The date to be converted.
   * @returns {Date} - The converted Date object.
   */
  const toDate = (date: Date | string): Date => {
    return typeof date === 'string' ? new Date(date) : date
  }

  const startDate = toDate(options.startDate)
  const endDate = options.endDate ? toDate(options.endDate) : undefined

  const startMonth = new Intl.DateTimeFormat('en-US', {
    month: 'short'
  }).format(startDate)
  const startYear = startDate.getFullYear()

  if (endDate) {
    const endMonth = new Intl.DateTimeFormat('en-US', {
      month: 'short'
    }).format(endDate)
    const endYear = endDate.getFullYear()

    if (startMonth === endMonth && startYear === endYear) {
      return `${startMonth}. ${startYear} - Present`
    } else {
      return `${startMonth}. ${startYear} - ${endMonth}. ${endYear}`
    }
  } else {
    return `${startMonth}. ${startYear} - Present`
  }
}
