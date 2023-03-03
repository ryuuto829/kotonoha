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

import { cardSchema, profileSchema, progressSchema, deckSchema } from './schema'

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
    },
    decks: {
      schema: deckSchema
    }
  })

  console.log('DatabaseService: create collections')

  // hooks

  db.cards.postInsert(async (data, rxDocument) => {
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
  }, false)

  db.cards.postSave(async (data, rxDocument) => {
    // const progressDoc = await db.progress
    //   ?.findOne(data.updatedAt.split('T')[0])
    //   .exec()

    // const cardsLearned = data.status >= 4 ? 1 : 0
    // const pointsEarned = 1 * data.status

    // if (progressDoc) {
    //   await progressDoc.update({
    //     $inc: {
    //       cardsReviewed: 1,
    //       pointsEarned,
    //       cardsLearned
    //     }
    //   })
    // } else {
    //   await db.progress?.insert({
    //     name: data.updatedAt.split('T')[0],
    //     cardsAdded: 0,
    //     cardsReviewed: 1,
    //     pointsEarned,
    //     cardsLearned
    //   })
    // }

    // console.log(data)

    console.log(await db.progress.find().exec())
  }, false)

  db.decks.postRemove(async (data) => {
    const cards = await db.cards
      .find({
        selector: {
          deckId: data.id
        }
      })
      .exec()

    cards.forEach(async (x) => {
      await x.update({
        $set: {
          deckId: null
        }
      })
    })
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
