import { ReactNode } from 'react'
import { WordReading, WordMeaning, WordResult } from '../lib/types'

/**
 * Comma-separated list of word readings and kanji forms
 */
function WordReadings({ readings }: { readings: WordReading[] }) {
  return (
    <dt className="mb-2 text-lg font-bold tracking-tight text-gray-900 dark:text-white">
      {readings.map(({ word, reading }, index) => {
        return (
          <span key={index}>
            {index == 1 && '、　'}
            <span className={index === 0 ? '' : 'text-gray-400'}>
              {index > 1 && '、　'}
              {word ? `${word}　【${reading}】` : reading}
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

function JlptTag({ tagLablel }: { tagLablel: string }) {
  return (
    <abbr
      title="Japanese-Language Proficiency Test"
      className="bg-blue-100 text-blue-800 text-xs font-medium mr-2 px-2.5 py-0.5 rounded dark:bg-blue-900 dark:text-blue-300 no-underline"
    >
      {tagLablel}
    </abbr>
  )
}

function WordTags({ isCommon, jlpt }: { isCommon: boolean; jlpt: string[] }) {
  const isJlpt = jlpt.length > 0

  if (!isCommon && !isJlpt) {
    return null
  }

  return (
    <div>
      {isCommon && <CommonTag />}
      {isJlpt &&
        jlpt.map((tagLablel) => (
          <JlptTag key={tagLablel} tagLablel={tagLablel} />
        ))}
    </div>
  )
}

/**
 * List of all definitions
 */
function WordMeanings({ meanings }: { meanings: WordMeaning[] }) {
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
          <p key={index + 'p'} className="text-sm text-gray-600">
            {partOfSpeech}
          </p>
        )
      }

      // 2. Adding definitions with all additional info
      listItems.push(
        <div key={index + 'd'} className="text-gray-400">
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

export default function SearchResult({
  word,
  getDetails
}: {
  word: WordResult
}) {
  return (
    <div className="block w-full p-6 bg-white border border-gray-200 rounded-lg shadow-md hover:bg-gray-100 dark:bg-gray-800 dark:border-gray-700 dark:hover:bg-gray-700">
      <dl>
        <WordReadings readings={word.japanese} />
        <WordTags isCommon={word.is_common} jlpt={word.jlpt} />
        <WordMeanings meanings={word.senses} />
      </dl>
      <button onClick={() => getDetails(word.slug)}>More Details ...</button>
    </div>
  )
}
