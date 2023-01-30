import kanjiDictionary from '../../../resources/kanjis.json'
import kanjiStrokes from '../../../resources/kanjiStrokes.json'

import Link from 'next/link'
import { toHiragana } from 'wanakana'
import { Fragment, ReactElement } from 'react'
import { KanjiDetails, KanjiStrokePath } from '../../../lib/types'

import DictionaryLayout from '../../../components/DictionaryLayout'

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
        <span key={reading}>
          {index > 0 ? '、 ' : null}
          <Link
            href={`/dictionary?q=${getWordWithReadingURL(kanji, reading)}`}
            className="text-blue-400"
          >
            {reading}
          </Link>
        </span>
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
            className="inline-flex border border-gray-600 rounded m-1"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="109"
              height="109"
              viewBox="0 0 109 109"
              className="h-14 w-14 p-2"
            >
              {strokePaths.map((strokePath, index) => {
                const hasKanjiDirection = index + 1 === strokePaths.length

                return (
                  <Fragment key={strokePath.id}>
                    <g
                      style={{
                        fill: 'none',
                        stroke: hasKanjiDirection ? '#FF8000' : '#404040',
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
                          r="6"
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
    <div className="bg-[rgb(32,32,32)] p-6 mt-5 rounded-xl">
      <div className="text-3xl">{kanji.kanji}</div>
      <div>
        {/* Stroke count */}
        <div>
          <span>Strokes: </span>
          <span className="font-bold">{kanji.stroke_count}</span>
        </div>

        {/* Jlpt */}
        {kanji.jlpt && (
          <div>
            <span>JLPT level </span>
            <span className="font-bold">{`N${kanji.jlpt}`}</span>
          </div>
        )}

        {/* Grade */}
        {kanjiListByGrade && (
          <div>
            <span>{`${kanjiListByGrade}, taught in `}</span>
            <span className="font-bold">{`grade ${kanji.grade}`}</span>
          </div>
        )}
      </div>
      <div>
        <div>Definitions</div>
        <div>{kanji.meanings.join(', ')}</div>
      </div>

      {/* Readings */}
      <div>
        <span>Kun: </span>
        <ReadingLinks kanji={kanji.kanji} readings={kanji.kun_readings} />
      </div>
      <div>
        <span>On: </span>
        <ReadingLinks kanji={kanji.kanji} readings={kanji.on_readings} />
      </div>

      {/* Stroke Order */}
      <div>
        <div>Stroke Order</div>
        <StrokeOrderDiagrams kanjiStrokes={kanjiStrokes} />
      </div>
    </div>
  )
}

Kanji.getLayout = function getLayout(page: ReactElement) {
  return <DictionaryLayout>{page}</DictionaryLayout>
}
