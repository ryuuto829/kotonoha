import { useEffect } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/router'
import { useMutation } from '@tanstack/react-query'
import type { ReactElement, ReactNode } from 'react'
import type { WordReading, WordMeaning, WordResult } from '../../lib/types'

import ArrowLongRightIcon from '@heroicons/react/24/outline/ArrowLongRightIcon'
import DictionaryLayout from '../../components/DictionaryLayout'

function WordReadings({ readings }: { readings: WordReading[] }) {
  return (
    <dt className="text-lg font-bold tracking-tight text-gray-900 dark:text-white">
      {readings.map(({ word, reading }, index) => {
        return (
          <span key={index}>
            {index == 1 && '、 '}
            <span className={index === 0 ? '' : 'text-gray-400'}>
              {index > 1 && '、 '}
              <span>{word || reading}</span>
              {word && <span>{` 【${reading}】`}</span>}
            </span>
          </span>
        )
      })}
    </dt>
  )
}

function CommonTag() {
  return (
    <abbr className="bg-blue-100 text-blue-800 text-xs font-medium mr-2 px-2.5 py-0.5 rounded dark:bg-blue-900 dark:text-blue-300">
      common
    </abbr>
  )
}

function JlptTag({ label }: { label: string }) {
  return (
    <abbr
      title="Japanese-Language Proficiency Test"
      className="bg-blue-100 text-blue-800 text-xs font-medium mr-2 px-2.5 py-0.5 rounded dark:bg-blue-900 dark:text-blue-300 no-underline"
    >
      {label}
    </abbr>
  )
}

export function WordTags({
  isCommon,
  jlpt
}: {
  isCommon: boolean
  jlpt: string[]
}) {
  return (
    <div className="inline-flex items-center">
      {isCommon && <CommonTag />}
      {jlpt?.map((label) => (
        <JlptTag key={label} label={label} />
      ))}
    </div>
  )
}

export function WordMeanings({ meanings }: { meanings: WordMeaning[] }) {
  let currentPartOfSpeech: string

  const definitionList = meanings.reduce<ReactNode[]>(
    (list, meaning, index) => {
      const partOfSpeech = meaning.parts_of_speech.join(', ')
      const listItems = [...list]

      // Remove wikipedia definition from the list
      if (partOfSpeech === 'Wikipedia definition') {
        return listItems
      }

      // 1. Adding a part of the speech info above definitions of the same type
      if (currentPartOfSpeech !== partOfSpeech) {
        currentPartOfSpeech = partOfSpeech
        listItems.push(
          <p
            key={index + 'p'}
            className="text-sm font-medium text-white text-opacity-50 mt-1"
          >
            {partOfSpeech}
          </p>
        )
      }

      // 2. Adding definitions with all additional info
      listItems.push(
        <div
          key={index + 'd'}
          className="text-lg text-white text-opacity-80 mt-1"
        >
          <span>
            {`${index + 1}. ${meaning.english_definitions.join(', ')}`}
          </span>

          {meaning.info.length > 0 && (
            <span className="text-gray-500 text-sm">
              {` - ${meaning.info.join(', ')}`}
            </span>
          )}

          {meaning.tags.length > 0 && (
            <span className="text-gray-500 text-sm">
              {` ${meaning.tags.join(', ')}`}
            </span>
          )}

          {meaning.restrictions.length > 0 && (
            <span className="text-gray-500 text-sm">
              {`. Only applies to ${meaning.restrictions.join(', ')}`}
            </span>
          )}

          {meaning.see_also.length > 0 && (
            <span className="text-gray-500 text-sm">
              {`. See also `}
              <a href="#" className="text-blue-400">
                {meaning.see_also.join(', ')}
              </a>
            </span>
          )}
        </div>
      )

      return listItems
    },
    []
  )

  return <dd>{definitionList}</dd>
}

function SearchResults({
  words,
  currentSearchWord
}: {
  words: WordResult[]
  currentSearchWord: string
}) {
  return (
    <div className="bg-[rgb(32,32,32)] mt-5 rounded-xl divide-y divide-white divide-opacity-20 shadow-md">
      {words.map((word) => {
        return (
          <div key={word.slug} className="block w-full p-6">
            <dl className="grid gap-4">
              <WordReadings readings={word.japanese} />

              {(word.is_common || word.jlpt.length > 0) && (
                <WordTags isCommon={word.is_common} jlpt={word.jlpt} />
              )}

              <WordMeanings meanings={word.senses} />
            </dl>
            <Link
              href={`/dictionary?q=${currentSearchWord}&details=${word.slug}`}
              className="inline-flex items-center mt-2 text-white text-opacity-80 text-sm rounded h-7 px-2 hover:bg-white hover:bg-opacity-5"
            >
              <span className="mr-2">More Details</span>
              <ArrowLongRightIcon className="h-5 w-5" />
            </Link>
          </div>
        )
      })}
    </div>
  )
}

function WordDetails({ word }: { word: WordResult }) {
  const [mainReading, ...otherReadings] = word.japanese

  return (
    <div className="grid gap-4 bg-[rgb(32,32,32)] p-6 mt-5 rounded-xl shadow-md">
      {/* Word literal, reading, jlpt and common tags */}
      <div>
        <div className="flex items-center space-x-6">
          <h1 className="text-4xl">
            {mainReading.word || mainReading.reading}
          </h1>

          {(word.is_common || word.jlpt.length > 0) && (
            <WordTags isCommon={word.is_common} jlpt={word.jlpt} />
          )}
        </div>

        {mainReading.word && <div className="mt-2">{mainReading.reading}</div>}
      </div>

      {/* Meanings */}
      <WordMeanings meanings={word.senses} />

      {/* Different forms */}
      {otherReadings.length > 0 && (
        <div>
          <h2 className="text-sm font-medium text-white text-opacity-50">
            Other forms
          </h2>
          <div className="flex items-center mt-2 space-x-2">
            {otherReadings.map((readings, index) => {
              return (
                <Link
                  key={index}
                  href={`/dictionary?q=${readings.word || readings.reading}`}
                  className="inline-flex border border-white border-opacity-20 px-4 py-2 rounded hover:bg-white hover:bg-opacity-5"
                >
                  {readings.word
                    ? `${readings.word} 【${readings.reading}】`
                    : readings.reading}
                </Link>
              )
            })}
          </div>
        </div>
      )}
    </div>
  )
}

export default function Dictionary() {
  const router = useRouter()
  const { q: currentSearchWord, details: currentSelectedWord } = router.query

  const searchResults = useMutation({
    mutationFn: async (keyword: string) => {
      if (!keyword) return null

      const response = await fetch(`/api/dictionary?keyword=${keyword}`)
      const { data } = await response.json()

      return data as WordResult[]
    }
  })

  useEffect(() => {
    if (currentSearchWord) {
      searchResults.mutate(currentSearchWord.toString())
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentSearchWord])

  const details = currentSelectedWord
    ? searchResults.data?.find((word) => word.slug === currentSelectedWord)
    : null

  return (
    <>
      {/* Loading */}
      {searchResults.isLoading && <div>Loading ...</div>}

      {/* All search results */}
      {!currentSelectedWord && currentSearchWord && searchResults.data && (
        <SearchResults
          words={searchResults.data}
          currentSearchWord={currentSearchWord.toString()}
        />
      )}

      {/* Word details */}
      {details && <WordDetails word={details} />}
    </>
  )
}

Dictionary.getLayout = function getLayout(page: ReactElement) {
  return <DictionaryLayout>{page}</DictionaryLayout>
}
