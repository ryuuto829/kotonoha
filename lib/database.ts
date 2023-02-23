import {
  createRxDatabase,
  addRxPlugin,
  RxDatabase,
  removeRxDatabase
} from 'rxdb'
import { getRxStorageDexie } from 'rxdb/plugins/dexie'
import { RxDBQueryBuilderPlugin } from 'rxdb/plugins/query-builder'
import { RxDBUpdatePlugin } from 'rxdb/plugins/update'

import { cardSchema, profileSchema, progressSchema } from './schema'

removeRxDatabase('kotonoha-db', getRxStorageDexie())

/**
 * Enable mango-query-syntax with chained methods
 */
addRxPlugin(RxDBQueryBuilderPlugin)
addRxPlugin(RxDBUpdatePlugin)

/**
 * Dev Mode with readable error messages
 */
if (process.env.NODE_ENV === 'development') {
  import('rxdb/plugins/dev-mode').then(({ RxDBDevModePlugin }) =>
    addRxPlugin(RxDBDevModePlugin as any)
  )
}

let dbPromise: Promise<RxDatabase> | null = null

export const create = async () => {
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
    cards: {
      schema: cardSchema
    },
    profiles: {
      schema: profileSchema
    },
    progress: {
      schema: progressSchema
    }
  })

  console.log('DatabaseService: create collections')

  /**
   * Add default user account
   */
  const userDoc = await db.profiles.findOne('user').exec()
  if (!userDoc) {
    await db.profiles.upsert({
      id: 'user',
      username: 'user',
      points: 0,
      dateJoined: new Date().toISOString()
    })

    console.log('DatabaseService: create user')
  }

  // hooks
  // ...

  // maybe sync collection to a remote
  // ...

  return db
}

export const get = () => {
  if (!dbPromise) {
    dbPromise = create()
  }

  return dbPromise
}
