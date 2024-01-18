export const calculateDurationWork = (startDate: Date): string => {
  const currentDate = new Date()
  const monthDifference =
    (currentDate.getFullYear() - startDate.getFullYear()) * 12 +
    (currentDate.getMonth() - startDate.getMonth())

  if (monthDifference >= 12) {
    const years = Math.floor(monthDifference / 12)
    const months = monthDifference % 12
    return `${years} ${years === 1 ? 'año' : 'años'} ${months} ${
      months === 1 ? 'mes' : 'meses'
    }`
  } else {
    return `${monthDifference} ${monthDifference === 1 ? 'mes' : 'meses'}`
  }
}
