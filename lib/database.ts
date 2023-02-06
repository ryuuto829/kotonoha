import { createRxDatabase, addRxPlugin, RxDatabase } from 'rxdb'
import { getRxStorageDexie } from 'rxdb/plugins/dexie'
import { RxDBDevModePlugin } from 'rxdb/plugins/dev-mode'

import { wordSchema } from './schema'

addRxPlugin(RxDBDevModePlugin)

let dbPromise: Promise<RxDatabase> | null = null

export const _create = async () => {
  const db = await createRxDatabase({
    name: 'kotonoha-db',
    storage: getRxStorageDexie()
  })

  console.log('db created')

  // create collections
  await db.addCollections({
    words: {
      schema: wordSchema
    }
  })

  console.log('db add collections')

  return db
}

export const get = () => {
  if (!dbPromise) dbPromise = _create()
  return dbPromise
}
