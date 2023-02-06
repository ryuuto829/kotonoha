export const wordSchema = {
  title: 'word schema',
  description: '',
  version: 0,
  primaryKey: 'name',
  type: 'object',
  properties: {
    name: {
      type: 'string',
      maxLength: 100
    },
    reading: {
      type: 'string'
    },
    meaning: {
      type: 'string'
    }
  },
  required: ['name', 'meaning']
}
