export const cardSchema = {
  title: 'card schema',
  description: 'card schema',
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
    lastReviewed: {
      type: 'string',
      format: 'date-time'
    },
    lastReviewedCorrect: {
      type: 'string',
      format: 'date-time'
    },
    srsDueDate: {
      type: 'string',
      format: 'date-time'
    },
    status: {
      type: 'number',
      minimum: 1,
      maximum: 5
    },
    statusChangedDate: {
      type: 'string',
      format: 'date-time'
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
} as const

export const profileSchema = {
  title: 'profile schema',
  description: 'user profile',
  version: 0,
  primaryKey: 'id',
  type: 'object',
  properties: {
    id: {
      type: 'string',
      maxLength: 100
    },
    fullName: {
      type: 'string'
    },
    username: {
      type: 'string'
    },
    dateJoined: {
      type: 'string'
    },
    setting: {
      type: 'object'
    },
    points: {
      type: 'number'
    }
  },
  required: ['id', 'username', 'points', 'dateJoined']
} as const

export const progressSchema = {
  title: 'progress schema',
  description: 'statistics which are tracked daily',
  version: 0,
  primaryKey: 'name',
  type: 'object',
  properties: {
    name: {
      type: 'string',
      maxLength: 100
    },
    pointsEarned: {
      type: 'number'
    },
    cardsAdded: {
      type: 'number'
    },
    /**
     * Any time user move a card to status 4 or 5
     */
    cardsLearned: {
      type: 'number'
    },
    /**
     * Total reviews (including srs)
     */
    cardsReviewed: {
      type: 'number'
    }
  },
  required: ['name']
} as const
