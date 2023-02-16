import {
  createRxDatabase,
  addRxPlugin,
  RxDatabase,
  removeRxDatabase
} from 'rxdb'
import { getRxStorageDexie } from 'rxdb/plugins/dexie'
import { RxDBQueryBuilderPlugin } from 'rxdb/plugins/query-builder'
import { RxDBUpdatePlugin } from 'rxdb/plugins/update'

import { wordSchema, userSchema } from './schema'

// removeRxDatabase('kotonoha-db', getRxStorageDexie())

// Enable mango-query-syntax with chained methods
addRxPlugin(RxDBQueryBuilderPlugin)
addRxPlugin(RxDBUpdatePlugin)

// Dev Mode adds readable error messages
if (process.env.NODE_ENV === 'development') {
  import('rxdb/plugins/dev-mode').then(({ RxDBDevModePlugin }) =>
    addRxPlugin(RxDBDevModePlugin as any)
  )
}

let dbPromise: Promise<RxDatabase> | null = null

const _create = async () => {
  // create RxDB
  const db = await createRxDatabase({
    name: 'kotonoha-db',
    storage: getRxStorageDexie()
  })

  console.log('DatabaseService: create database')

  // create collections
  await db.addCollections({
    words: {
      schema: wordSchema
    },
    users: {
      schema: userSchema
    }
  })

  console.log('DatabaseService: create collections')

  // hooks
  // ...

  // maybe sync collection to a remote
  // ...

  return db
}

export const get = () => {
  if (!dbPromise) dbPromise = _create()
  return dbPromise
}
