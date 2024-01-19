interface DurationOptions {
  startDate: Date | string
  endDate?: Date | string
  locale: 'es' | 'en' | undefined
}

export const formatDuration = ({
  startDate,
  endDate,
  locale = 'es'
}: DurationOptions): string => {
  if (locale === undefined) locale = 'es'

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
