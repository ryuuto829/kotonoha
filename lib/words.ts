export const DEFAULT_REVIEW_INTERVALS = [1, 3, 7, 15]
const MS_IN_DAY = 86400000 // 86,400,000 Milliseconds (ms) = 1 Day

export function _formatDueDate(date: Date) {
  return date.toISOString().split('T')[0]
}

// export function _updateDueDate(
//   status: number,
//   startDay: string,
//   intervals: number[] = DEFAULT_REVIEW_INTERVALS
// ) {
//   if (status === 5) return ''

//   return _formatDueDate(
//     new Date(new Date(startDay).getTime() + MS_IN_DAY * intervals[status - 1])
//   )
// }

export function _calculateDueDate(
  status: number,
  intervals: number[] = DEFAULT_REVIEW_INTERVALS
) {
  if (status === 5) return ''

  const today = new Date()

  if (status === 1) return _formatDueDate(today)

  return _formatDueDate(
    new Date(today.getTime() + MS_IN_DAY * intervals[status - 1])
  )
}

export function _formatCardContent(content: string) {
  return content.split('\n---\n')
}
