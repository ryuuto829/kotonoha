import {
  toTypedRxJsonSchema,
  ExtractDocumentTypeFromTypedRxJsonSchema,
  RxJsonSchema
} from 'rxdb'

export const cardSchemaLiteral = {
  version: 0,
  primaryKey: 'id',
  type: 'object',
  properties: {
    id: {
      type: 'string',
      maxLength: 100
    },
    term: {
      type: 'string'
    },
    meaning: {
      type: 'string'
    },
    created_at: {
      type: 'string',
      format: 'date-time'
    },
    deck_id: {
      type: 'string'
    },
    new: {
      type: 'boolean'
    },
    user_id: {
      type: 'string'
    },
    replicationRevision: {
      type: 'string',
      minLength: 3
    },
    reviews: {
      type: 'array',
      items: {
        type: 'object',
        properties: {
          date: {
            type: 'string',
            format: 'date-time'
          },
          correct: {
            type: 'boolean'
          }
        }
      }
    }
  },
  required: ['id', 'created_at']
} as const

const schemaTyped = toTypedRxJsonSchema(cardSchemaLiteral)
export type Card = ExtractDocumentTypeFromTypedRxJsonSchema<typeof schemaTyped>
export const cardSchema: RxJsonSchema<Card> = cardSchemaLiteral
