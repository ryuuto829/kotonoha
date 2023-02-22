import {
  createRxDatabase,
  addRxPlugin,
  RxDatabase,
  removeRxDatabase
} from 'rxdb'
import { getRxStorageDexie } from 'rxdb/plugins/dexie'
import { RxDBQueryBuilderPlugin } from 'rxdb/plugins/query-builder'
import { RxDBUpdatePlugin } from 'rxdb/plugins/update'

import { wordSchema, userSchema, progressSchema } from './schema'

removeRxDatabase('kotonoha-db', getRxStorageDexie())

/**
 * Enable mango-query-syntax with chained methods
 */
addRxPlugin(RxDBQueryBuilderPlugin)
addRxPlugin(RxDBUpdatePlugin)

/**
 * Dev Mode adds readable error messages
 */
if (process.env.NODE_ENV === 'development') {
  import('rxdb/plugins/dev-mode').then(({ RxDBDevModePlugin }) =>
    addRxPlugin(RxDBDevModePlugin as any)
  )
}

let dbPromise: Promise<RxDatabase> | null = null

const _create = async () => {
  /**
   * Create RxDB
   */
  const db = await createRxDatabase({
    name: 'kotonoha-db',
    storage: getRxStorageDexie()
  })

  console.log('DatabaseService: create database')

  /**
   * Add collections
   */
  await db.addCollections({
    words: {
      schema: wordSchema
    },
    users: {
      schema: userSchema
    },
    progress: {
      schema: progressSchema
    }
  })

  console.log('DatabaseService: create collections')

  /**
   * Add default user account
   */
  const userDoc = await db.users.findOne('user').exec()

  if (!userDoc) {
    await db.users.upsert({
      id: 'user',
      experiencePoints: 0,
      stats: []
    })
  }

  // hooks
  // ...

  // maybe sync collection to a remote
  // ...

  return db
}

export const get = () => {
  if (!dbPromise) {
    dbPromise = _create()
  }

  return dbPromise
}
