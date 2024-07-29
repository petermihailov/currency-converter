export const getWeekDates = (date: Date = new Date()) => {
  const currentDate = new Date(date)
  const week: Date[] = [new Date(currentDate)]

  for (let i = 0; i < 6; i++) {
    week.push(new Date(currentDate.setDate(currentDate.getDate() - 1)))
  }

  return week
}

export const toISODate = (date: Date): string => {
  return date.toISOString().substring(0, 10)
}
