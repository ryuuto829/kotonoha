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
    username: {
      type: 'string'
    },
    dateJoined: {
      type: 'string'
    },
    settings: {
      type: 'object'
    }
  },
  required: ['id', 'username', 'settings', 'dateJoined']
} as const

export const deckSchema = {
  title: 'deck schema',
  description: 'deck',
  version: 0,
  primaryKey: 'id',
  type: 'object',
  properties: {
    id: {
      type: 'string',
      maxLength: 100
    },
    name: {
      type: 'string'
    },
    description: {
      type: 'string'
    },
    terms: {
      type: 'number'
    },
    createdAt: {
      type: 'string',
      format: 'date-time'
    },
    lastStudiedAt: {
      type: 'string',
      format: 'date-time'
    }
  },
  required: ['id', 'name', 'terms', 'createdAt', 'lastStudiedAt']
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

/**
 *
 *
 *
 *
 *
 */

export const userSchema = {
  title: 'User schema',
  description: 'User schema',
  version: 0,
  primaryKey: 'id',
  type: 'object',
  properties: {
    id: {
      type: 'string',
      maxLength: 100
    },
    meaning: {
      type: 'string'
    },
    user_id: {
      type: 'string'
    }
  },
  required: ['id']
} as const
