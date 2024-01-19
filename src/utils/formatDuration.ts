import { format, differenceInCalendarMonths, add } from 'date-fns'
import { enUS, es } from 'date-fns/locale'

interface DurationOptions {
  startDate: Date
  endDate?: Date
  locale: 'es' | 'en' | undefined
}

export const formatDuration = ({
  startDate,
  endDate,
  locale = 'es'
}: DurationOptions): string => {
  const translateCurrently = locale === 'es' ? 'Actualmente' : 'Currently'

  const localeObject = locale === 'es' ? es : enUS

  if (endDate) {
    const monthsDifference = differenceInCalendarMonths(endDate, startDate)

    if (monthsDifference >= 12) {
      const years = Math.floor(monthsDifference / 12)
      const months = monthsDifference % 12

      const yearText = years > 0 ? `${years} años` : ''
      const monthText = months > 0 ? `${months} meses` : ''

      if (yearText !== '' && monthText !== '') {
        return `${yearText} ${monthText}`
      } else if (yearText !== '') {
        return yearText
      } else {
        return monthText
      }
    } else {
      const adjustedStartDate = add(startDate, { months: 1 })
      const endMonth = format(endDate, 'MMM', { locale: localeObject })
      const endYear = format(endDate, 'yyyy', { locale: localeObject })

      const startMonth = format(adjustedStartDate, 'MMM', {
        locale: localeObject
      })
      const startYear = format(adjustedStartDate, 'yyyy', {
        locale: localeObject
      })

      if (startMonth === endMonth && startYear === endYear) {
        return `${startMonth}. ${startYear} - ${translateCurrently}`
      } else {
        return `${startMonth}. ${startYear} - ${endMonth}. ${endYear}`
      }
    }
  } else {
    const adjustedStartDate = add(startDate, { months: 1 })
    const startMonth = format(adjustedStartDate, 'MMM', {
      locale: localeObject
    })
    const startYear = format(startDate, 'yyyy', { locale: localeObject })

    return `${startMonth}. ${startYear} - ${translateCurrently}`
  }
}
