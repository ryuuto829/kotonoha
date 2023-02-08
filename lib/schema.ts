export const wordSchema = {
  title: 'word schema',
  description: '',
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
    }
  },
  required: ['id', 'word', 'meaning']
}
