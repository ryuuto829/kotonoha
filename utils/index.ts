const MS_IN_DAY = 86400000 // 86,400,000 Milliseconds (ms) = 1 Day

const formatDueDate = (date: Date) => {
  return date.toISOString().split('T')[0]
}

export const updateDueDate = (
  status: number,
  startDay: string,
  intervals: number[]
) => {
  if (status === 5) return null

  return formatDueDate(
    new Date(new Date(startDay).getTime() + MS_IN_DAY * intervals[status - 1])
  )
}

export const calculateDueDate = (status: number, intervals: number[]) => {
  if (status === 5) return null

  const today = new Date()

  if (status === 1) return formatDueDate(today)

  return formatDueDate(
    new Date(today.getTime() + MS_IN_DAY * intervals[status - 1])
  )
}
