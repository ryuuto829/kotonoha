import {
  createRxDatabase,
  addRxPlugin,
  RxDatabase,
  removeRxDatabase
} from 'rxdb'
import { getRxStorageDexie } from 'rxdb/plugins/dexie'
import { RxDBQueryBuilderPlugin } from 'rxdb/plugins/query-builder'
import { RxDBUpdatePlugin } from 'rxdb/plugins/update'
import { RxDBJsonDumpPlugin } from 'rxdb/plugins/json-dump'

import { cardSchema, profileSchema, progressSchema } from './schema'

// removeRxDatabase('kotonoha-db', getRxStorageDexie())

/**
 * Enable mango-query-syntax with chained methods
 */
addRxPlugin(RxDBQueryBuilderPlugin)
addRxPlugin(RxDBUpdatePlugin)
addRxPlugin(RxDBJsonDumpPlugin)

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

  db.cards.postInsert(async function (data, rxDocument) {
    console.log(data)
    const progressDoc = await db.progress
      ?.findOne(data.updatedAt.split('T')[0])
      .exec()

    const cardsLearned = data.status >= 4 ? 1 : 0
    const pointsEarned = 1 * data.status

    if (progressDoc) {
      await progressDoc.update({
        $inc: {
          cardsAdded: 1,
          pointsEarned,
          cardsLearned
        }
      })
    } else {
      await db.progress?.insert({
        name: data.updatedAt.split('T')[0],
        cardsAdded: 1,
        cardsReviewed: 0,
        pointsEarned,
        cardsLearned
      })
    }

    await userDoc.update({
      $inc: {
        points: pointsEarned
      }
    })

    console.log(progressDoc)
  }, false)

  db.cards.postSave(function (data, rxDocument) {
    console.log(data)
  }, false)

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
