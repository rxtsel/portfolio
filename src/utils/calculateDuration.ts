import { format, differenceInMonths, add } from 'date-fns'
import { es, enUS } from 'date-fns/locale'

export const calculateDuration = ({
  startDate,
  endDate,
  locale = 'es'
}: {
  startDate: Date
  endDate?: Date
  locale?: 'es' | 'en' | undefined
}): string => {
  // Si no se especifica locale, usar es
  if (locale === undefined) locale = 'es'

  // Traducir meses, años y actualidad
  const localeMonths = locale === 'es' ? 'Meses' : 'Months'
  const localeYears = locale === 'es' ? 'Años' : 'Years'
  const localeMonth = locale === 'es' ? 'Mes' : 'Month'
  const localeYear = locale === 'es' ? 'Año' : 'Year'
  const localeCurrently = locale === 'es' ? 'Actualidad' : 'Currently'

  // Si endDate no está presente, usar la fecha actual
  const endDateActual = endDate || new Date()
  const endDateActualWithOneMonthMore = add(endDateActual, { months: 1 }) // Para aumentar el mes en 1 ya que empieza en 0

  // Calcular la diferencia en meses y años
  const mesesTotales = differenceInMonths(
    endDateActualWithOneMonthMore,
    startDate
  )
  const anos = Math.floor(mesesTotales / 12)
  const mesesRestantes = mesesTotales % 12

  // Añadir traducciones al mes de inicio. Ej: Ene. o Jan.
  const localeFormat = locale === 'es' ? es : enUS

  // Formatear las fechas
  const startDateActualWithOneMonthMore = add(startDate, { months: 1 })
  const startDateFormatted = format(
    startDateActualWithOneMonthMore,
    'MMM. yyyy',
    { locale: localeFormat }
  )
  const endDateFormatted = endDate
    ? format(endDate, 'MMM. yyyy')
    : localeCurrently

  // Crear y devolver la cadena de resultado
  let resultado = `${startDateFormatted} - ${endDateFormatted} · `

  // Agregar años a la salida si es más de 1 año
  if (anos > 0) {
    resultado += `${anos} ${anos === 1 ? localeYear : localeYears} `
  }

  // Agregar meses a la salida si es más de 0 meses
  if (mesesRestantes > 0) {
    resultado += `${mesesRestantes} ${mesesRestantes === 1 ? localeMonth : localeMonths}`
  }

  return resultado
}
