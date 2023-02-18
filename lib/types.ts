import type { NextPage } from 'next'
import type { ReactElement, ReactNode } from 'react'
import {
  toTypedRxJsonSchema,
  ExtractDocumentTypeFromTypedRxJsonSchema,
  RxDocument,
  RxCollection
} from 'rxdb'
import { wordSchema, userSchema } from './schema'

/**
 * Jisho API
 */

export type WordResult = {
  attribution: {
    dbpedia: boolean
    jmdict: boolean
    jmnedict: boolean
  }
  is_common: boolean
  japanese: WordReading[]
  jlpt: string[]
  senses: WordMeaning[]
  slug: string
  tags: string[]
}

export type WordReading = {
  word?: string
  reading: string
}

export type WordMeaning = {
  antonyms: string[]
  english_definitions: string[]
  info: string[]
  links: { text: string; url: string }[]
  parts_of_speech: string[]
  restrictions: string[]
  see_also: string[]
  source: string[]
  tags: string[]
}

/**
 * Layout page
 */

export type NextPageWithLayout<P = {}, IP = P> = NextPage<P, IP> & {
  getLayout?: (page: ReactElement) => ReactNode
}

/**
 * Dictionaries
 */

export type KanjiDetails = {
  kanji: string
  grade: number
  stroke_count: number
  meanings: string[]
  kun_readings: string[]
  on_readings: string[]
  name_readings: string[]
  jlpt: number
  unicode: string
  heisig_en: string
}

export type KanjiStrokePath = {
  id: string
  d: string
  start: {
    x: string
    y: string
  }
}

/**
 * Using RxDB with TypeScript
 * @link https://rxdb.info/tutorials/typescript.html
 */
const _wordSchemaTyped = toTypedRxJsonSchema(wordSchema)
const _userSchemaTyped = toTypedRxJsonSchema(userSchema)

export type WordDocType = RxDocument<
  ExtractDocumentTypeFromTypedRxJsonSchema<typeof _wordSchemaTyped>
>

export type UserDocType = RxDocument<
  ExtractDocumentTypeFromTypedRxJsonSchema<typeof _userSchemaTyped>
>

export type WordsCollectionType = RxCollection<WordDocType, {}, {}, {}>
