import { nanoid } from 'nanoid'
import { WordDocType, WordsCollectionType } from './types'

export const DEFAULT_REVIEW_INTERVALS = [1, 3, 7, 15]
const MS_IN_DAY = 86400000 // 86,400,000 Milliseconds (ms) = 1 Day

// UTILS

export function _formatDueDate(date: Date) {
  return date.toISOString().split('T')[0]
}

export function _updateDueDate(
  status: number,
  startDay: string,
  intervals: number[] = DEFAULT_REVIEW_INTERVALS
) {
  if (status === 5) return ''

  return _formatDueDate(
    new Date(new Date(startDay).getTime() + MS_IN_DAY * intervals[status - 1])
  )
}

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

export function _getTodayISO() {
  return new Date().toISOString()
}

export function _formatCardContent(content: string) {
  return content.split('\n---\n')
}

// FUNCTIONS

export async function saveCard({
  collection,
  content,
  status
}: {
  collection: WordsCollectionType
  content: string
  status: number
}) {
  if (!collection) return

  const [word, meaning] = _formatCardContent(content)
  const today = _getTodayISO()

  await collection.upsert({
    id: nanoid(8),
    word: word || '',
    meaning: meaning || '',
    createdAt: today,
    updatedAt: today,
    lastReviewedAt: '',
    dueDate: _calculateDueDate(status, DEFAULT_REVIEW_INTERVALS),
    reviewStatus: status
  })

  console.log('DatabaseService: create document')
}

export async function updateCard({
  document,
  content,
  status
}: {
  document: WordDocType
  content: string
  status: number
}) {
  if (!document) return

  const [word, meaning] = _formatCardContent(content)
  const today = _getTodayISO()

  await document.update({
    $set: {
      word: word || '',
      meaning: meaning || '',
      updatedAt: today,
      dueDate: _updateDueDate(
        status,
        document.lastReviewedAt || document.createdAt,
        DEFAULT_REVIEW_INTERVALS
      ),
      reviewStatus: status
    }
  })

  console.log('DatabaseService: update document')
}

export async function updateCardReview({
  document,
  srs,
  success
}: {
  document: WordDocType
  srs: string
  success: boolean
}) {
  const today = _getTodayISO()

  // 1. Custom review
  let fields: any = {
    lastReviewedAt: today
  }

  // 2. Due for review - remember
  if (srs === 'srs' && success) {
    const newStatus = document.reviewStatus < 5 && document.reviewStatus + 1

    fields = {
      ...fields,
      dueDate: newStatus
        ? _updateDueDate(newStatus, today, DEFAULT_REVIEW_INTERVALS)
        : '',
      reviewStatus: newStatus || document.reviewStatus
    }
  }

  // 3. Due for review - fail
  if (srs === 'srs' && !success) {
    fields = {
      ...fields,
      dueDate: _updateDueDate(
        document.reviewStatus,
        today,
        DEFAULT_REVIEW_INTERVALS
      )
    }
  }

  await document.update({
    $set: {
      ...fields
    }
  })

  console.log('DatabaseService: update document')
}

export async function deleteCard({
  collection,
  docId
}: {
  collection: WordsCollectionType
  docId: string
}) {
  await collection?.findOne(docId).remove()

  console.log('DatabaseService: delete document')
}
