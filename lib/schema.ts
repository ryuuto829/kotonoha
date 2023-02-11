export const wordSchema = {
  title: 'word schema',
  description: 'word schema',
  version: 0,
  primaryKey: 'id',
  type: 'object',
  properties: {
    id: {
      type: 'string',
      maxLength: 100
    },
    word: {
      type: 'string'
    },
    meaning: {
      type: 'string'
    },
    createdAt: {
      type: 'string',
      format: 'date-time'
    },
    updatedAt: {
      type: 'string',
      format: 'date-time'
    },
    lastReviewedAt: {
      type: 'string',
      format: 'date-time'
    },
    dueDate: {
      type: 'string',
      format: 'date-time'
    },
    reviewStatus: {
      type: 'number',
      minimum: 1,
      maximum: 5
    }
  },
  required: [
    'id',
    'word',
    'meaning',
    'createdAt',
    'updatedAt',
    'lastReviewedAt',
    'dueDate',
    'reviewStatus'
  ]
}
