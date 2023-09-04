import {
  createRxDatabase,
  addRxPlugin,
  RxDatabase,
  removeRxDatabase
} from 'rxdb'
import { getRxStorageDexie } from 'rxdb/plugins/storage-dexie'
import { RxDBQueryBuilderPlugin } from 'rxdb/plugins/query-builder'
import { RxDBUpdatePlugin } from 'rxdb/plugins/update'
import { RxDBJsonDumpPlugin } from 'rxdb/plugins/json-dump'

import {
  cardSchema,
  profileSchema,
  progressSchema,
  deckSchema,
  userSchema
} from './schema'

// removeRxDatabase('kotonoha-default', getRxStorageDexie())

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
let dbUserID: string | null = null

export const create = async (uid: string | null) => {
  const db = await createRxDatabase({
    name: `kotonoha-${uid ? uid : 'default'}`,
    storage: getRxStorageDexie()
  })

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
    },
    new: {
      schema: userSchema
    }
  })

  // hooks

  // db.cards.postInsert(async (data, rxDocument) => {
  //   const progressDoc = await db.progress
  //     ?.findOne(data.updatedAt.split('T')[0])
  //     .exec()

  //   if (!progressDoc) {
  //     await db.progress?.insert({
  //       name: data.updatedAt.split('T')[0]
  //     })
  //   }

  //   await progressDoc.update({
  //     $inc: {
  //       cardsAdded: 1
  //     }
  //   })
  // }, false)

  // db.cards.postSave(async (data, rxDocument) => {
  //   const progressDoc = await db.progress
  //     ?.findOne(data.updatedAt.split('T')[0])
  //     .exec()

  //   if (!progressDoc) {
  //     await db.progress?.insert({
  //       name: data.updatedAt.split('T')[0]
  //     })
  //   }

  //   await progressDoc.update({
  //     $inc: {
  //       cardsReviewed: rxDocument.lastReviewed !== data.lastReviewed ? 1 : 0,
  //       cardsLearned:
  //         rxDocument.status !== data.status && rxDocument.status < 4 ? 1 : 0
  //     }
  //   })
  // }, false)

  db.decks.postRemove(async (data) => {
    const cards = await db.cards
      .find({
        selector: {
          deckId: data.id
        }
      })
      .exec()

    cards.forEach(async (x) => {
      await x.remove()
    })
  }, false)

  // maybe sync collection to a remote
  // ...

  return db
}

export const get = (uid: string | null) => {
  if (!dbPromise || dbUserID !== uid) {
    dbPromise = create(uid)
    dbUserID = uid || null

    console.log(`[Database] Create database (user: ${uid})`)
  }

  return dbPromise
}
