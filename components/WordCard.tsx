import Link from 'next/link'
import { PlusIcon } from '@radix-ui/react-icons'
import { _formatCardContent, _calculateDueDate } from '../lib/words'
import type { WordResult } from '../lib/types'
import EditDialog from './EditDialog'

export default function WordCard({ word }: { word: WordResult }) {
  const [mainReading, ...otherReadings] = word.japanese
  const tags = [word.is_common && 'common', ...word.jlpt].filter((el) => el)

  const textContent = `${mainReading.word || mainReading.reading}\n---\n${
    mainReading.reading
  } `

  return (
    <dl className="grid gap-4">
      {/* Word literal, reading, tags */}
      <div>
        <div className="flex items-center space-x-6">
          <h1 className="text-3xl whitespace-nowrap">
            {mainReading.word || mainReading.reading}
          </h1>

          <div className="inline-flex items-center space-x-2">
            {tags.map((label, index) => (
              <span
                key={index}
                className="inline-flex items-center font-medium h-5 rounded-md px-[9px] text-xs bg-indigo-300 text-indigo-800"
              >
                {label}
              </span>
            ))}
          </div>
        </div>
        {mainReading.word && <div className="mt-2">{mainReading.reading}</div>}
      </div>

      {/* Meanings */}
      <dd className="flex flex-col space-y-2">
        {word.senses.map((meaning, index) => {
          const supplementalInfo = [
            meaning.info.join(', '),
            meaning.tags.join(', '),
            ...meaning.restrictions.map((el) => `Only applies to ${el}`),
            ...meaning.see_also.map((el) => (
              <>
                {'See also '}
                <Link href={`/dictionary?q=${el}`} className="text-blue-400">
                  {el}
                </Link>
              </>
            )),
            meaning.links.length && (
              <a
                href={meaning.links[0].url}
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-400"
              >
                Read on Wikipedia
              </a>
            )
          ].filter((el) => el)

          return (
            <div key={index} className="flex flex-col space-y-1">
              <p className="text-sm font-medium text-white/50">
                {meaning.parts_of_speech.join(', ')}
              </p>
              <p className="text-lg text-white/80">
                <span className="text-white/50">{`${index + 1}. `}</span>
                <span>{`${meaning.english_definitions.join(', ')}`}</span>

                {supplementalInfo && (
                  <span className="ml-2">
                    {supplementalInfo.map((el, index, arr) => (
                      <span key={index} className="text-white/50 text-sm">
                        {el}
                        {index < arr.length - 1 ? ', ' : ''}
                      </span>
                    ))}
                  </span>
                )}
              </p>
            </div>
          )
        })}
      </dd>

      {/* Different forms */}
      {otherReadings.length !== 0 && (
        <div>
          <h2 className="text-sm font-medium text-white text-opacity-50">
            Other forms
          </h2>
          <div className="flex items-center mt-2 space-x-2">
            {otherReadings.map((readings, index) => (
              <Link
                key={index}
                href={`/dictionary?q=${readings.word || readings.reading}${
                  readings.word ? ' ' + readings.reading : ''
                }`}
                className="inline-flex border border-white border-opacity-20 px-4 py-2 rounded hover:bg-white hover:bg-opacity-5"
              >
                {`${readings.word || readings.reading}${
                  readings.word ? ' 【' + readings.reading + '】' : ''
                }`}
              </Link>
            ))}
          </div>
        </div>
      )}

      {/* Add word */}
      <EditDialog textContent={textContent}>
        <button className="data-[state=open]:hidden inline-flex items-center space-x-2">
          <PlusIcon className="w-5 h-5" />
          <span>Add</span>
        </button>
      </EditDialog>

      {/* Divide */}
      <div className="w-full h-[1px] bg-white/20"></div>
    </dl>
  )
}
