import kanjiDictionary from '../../../resources/kanjis.json'
import kanjiStrokes from '../../../resources/kanjiStrokes.json'

import { Fragment } from 'react'
import Link from 'next/link'
import { toHiragana } from 'wanakana'
import type { ReactElement } from 'react'
import type { KanjiDetails, KanjiStrokePath } from '../../../lib/types'

import DictionaryLayout from '../../../layouts/DictionaryLayout'

export async function getStaticPaths() {
  const paths = Object.keys(kanjiDictionary.kanjis).map((kanji) => {
    return {
      params: { kanji }
    }
  })

  return { paths, fallback: false }
}

export async function getStaticProps({
  params
}: {
  params: { kanji: keyof typeof kanjiDictionary.kanjis }
}) {
  const kanji = kanjiDictionary.kanjis[params.kanji]

  // NOTE: Add leading '0' to match kanji unicode and svg file name
  const kanjiUnicode = ('0' + kanji.unicode) as keyof typeof kanjiStrokes

  return {
    props: {
      kanji: kanji,
      kanjiStrokes: kanjiUnicode ? kanjiStrokes[kanjiUnicode] : null
    }
  }
}

function getKanjiListByGrade(grade: number) {
  switch (grade) {
    case grade > 0 && grade < 8 && grade:
      return '教育漢字, 常用漢字'
    case 8:
      return '常用漢字'
    case (grade === 9 || grade === 10) && grade:
      return '人名用漢字'
    default:
      return null
  }
}

function getWordWithReadingURL(kanji: string, reading: string) {
  return encodeURIComponent(
    `${kanji} ${toHiragana(reading.replaceAll('.', ''))}`
  )
}

function ReadingLinks({
  kanji,
  readings
}: {
  kanji: string
  readings: string[]
}) {
  return (
    <>
      {readings.map((reading, index) => (
        <dd key={reading}>
          {index > 0 ? '、 ' : null}
          <Link
            href={`/dictionary?q=${getWordWithReadingURL(kanji, reading)}`}
            className="text-blue-400 text-xl"
          >
            {reading}
          </Link>
        </dd>
      ))}
    </>
  )
}

function StrokeOrderDiagrams({
  kanjiStrokes
}: {
  kanjiStrokes: KanjiStrokePath[]
}) {
  return (
    <>
      {kanjiStrokes.map((stroke, index) => {
        const strokePaths = kanjiStrokes.slice(0, index + 1)

        return (
          <div
            key={stroke.id}
            className="inline-flex border border-white border-opacity-20 rounded"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="109"
              height="109"
              viewBox="0 0 109 109"
              className="h-16 w-16 p-2"
            >
              {strokePaths.map((strokePath, index) => {
                const hasKanjiDirection = index + 1 === strokePaths.length

                return (
                  <Fragment key={strokePath.id}>
                    <g
                      style={{
                        fill: 'none',
                        stroke: hasKanjiDirection ? '#FFFFFF' : '#999',
                        strokeWidth: '3',
                        strokeLinecap: 'round',
                        strokeLinejoin: 'round'
                      }}
                    >
                      <path d={strokePath.d}></path>
                    </g>

                    {hasKanjiDirection && (
                      <g style={{ fill: '#FF0000' }}>
                        <circle
                          cx={strokePath.start.x}
                          cy={strokePath.start.y}
                          r="5"
                        ></circle>
                      </g>
                    )}
                  </Fragment>
                )
              })}
            </svg>
          </div>
        )
      })}
    </>
  )
}

export default function Kanji({
  kanji,
  kanjiStrokes
}: {
  kanji: KanjiDetails
  kanjiStrokes: KanjiStrokePath[]
}) {
  const kanjiListByGrade = getKanjiListByGrade(kanji.grade)

  return (
    <dl className="grid gap-4 bg-[rgb(32,32,32)] p-6 mt-5 rounded-xl shadow-md">
      {/* Kanji literal */}
      <dt className="sr-only">Kanji literal</dt>
      <dd>
        <h1 className="text-5xl">{kanji.kanji}</h1>
      </dd>

      {/* Stroke count, JLPT and grade */}
      <div>
        <div>
          <dt className="sr-only">Stroke count</dt>
          <dd>
            <span>Strokes: </span>
            <strong className="font-bold">{kanji.stroke_count}</strong>
          </dd>
        </div>

        {kanji.jlpt && (
          <div>
            <dt className="sr-only">JLPT level</dt>
            <dd>
              <span>JLPT level </span>
              <strong className="font-bold">{`N${kanji.jlpt}`}</strong>
            </dd>
          </div>
        )}

        {kanjiListByGrade && (
          <div>
            <dt className="sr-only">Kanji grade</dt>
            <dd>
              <span>{`${kanjiListByGrade}, taught in `}</span>
              <strong className="font-bold">{`grade ${kanji.grade}`}</strong>
            </dd>
          </div>
        )}
      </div>

      {/* Meanings */}
      <div>
        <dt className="text-sm font-medium text-white text-opacity-50">
          Definitions
        </dt>
        <dd className="mt-1 text-lg">{kanji.meanings.join(', ')}</dd>
      </div>

      {/* Readings */}
      <div>
        <h2 className="text-sm font-medium text-white text-opacity-50">
          Readings
        </h2>

        {kanji.kun_readings.length > 0 && (
          <dl className="mt-1 flex items-baseline space-x-2">
            <dt>Kun: </dt>
            <ReadingLinks kanji={kanji.kanji} readings={kanji.kun_readings} />
          </dl>
        )}

        {kanji.on_readings.length > 0 && (
          <dl className="mt-1 flex items-baseline space-x-2">
            <dt>On: </dt>
            <ReadingLinks kanji={kanji.kanji} readings={kanji.on_readings} />
          </dl>
        )}
      </div>

      {/* Stroke Order */}
      <div>
        <h2 className="text-sm font-medium text-white text-opacity-50">
          Stroke Order
        </h2>
        <div className="mt-2 flex flex-wrap gap-2">
          <StrokeOrderDiagrams kanjiStrokes={kanjiStrokes} />
        </div>
      </div>
    </dl>
  )
}

Kanji.getLayout = function getLayout(page: ReactElement) {
  return <DictionaryLayout>{page}</DictionaryLayout>
}
