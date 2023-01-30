import type { NextPage } from 'next'
import type { ReactElement, ReactNode } from 'react'

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
  links: string[]
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
