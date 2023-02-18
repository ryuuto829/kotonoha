import { nanoid } from 'nanoid'

export const DEFAULT_REVIEW_INTERVALS = [1, 3, 7, 15]
const MS_IN_DAY = 86400000 // 86,400,000 Milliseconds (ms) = 1 Day

export async function saveCard({ collection, content, status }) {
  if (!collection) return

  const [word, meaning] = content.split('\n---\n')
  const today = new Date().toISOString()

  await collection.upsert({
    id: nanoid(8),
    word: word || '',
    meaning: meaning || '',
    createdAt: today,
    updatedAt: today,
    lastReviewedAt: null,
    dueDate: _calculateDueDate(status, DEFAULT_REVIEW_INTERVALS),
    reviewStatus: status
  })

  console.log('DatabaseService: create doc')
}

export async function updateCard({ doc, content, status }) {
  if (!doc) return

  const [word, meaning] = content.split('\n---\n')
  const today = new Date().toISOString()

  await doc.update({
    $set: {
      word: word || '',
      meaning: meaning || '',
      updatedAt: today,
      dueDate: _updateDueDate(
        status,
        doc.lastReviewedAt || doc.createdAt,
        DEFAULT_REVIEW_INTERVALS
      ),
      reviewStatus: status
    }
  })

  console.log('DatabaseService: update doc')
}

// UTILS

function _formatDueDate(date: Date) {
  return date.toISOString().split('T')[0]
}

function _updateDueDate(status: number, startDay: string, intervals: number[]) {
  if (status === 5) return null

  return _formatDueDate(
    new Date(new Date(startDay).getTime() + MS_IN_DAY * intervals[status - 1])
  )
}

function _calculateDueDate(status: number, intervals: number[]) {
  if (status === 5) return null

  const today = new Date()

  if (status === 1) return _formatDueDate(today)

  return _formatDueDate(
    new Date(today.getTime() + MS_IN_DAY * intervals[status - 1])
  )
}
