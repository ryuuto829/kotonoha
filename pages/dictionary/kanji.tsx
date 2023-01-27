import { useEffect, useState } from 'react'
import { useRouter } from 'next/router'
import { useMutation } from '@tanstack/react-query'
import parse from 'html-react-parser'
import type { ReactElement } from 'react'
import { getStrokeCoordinatesFromSVGPath } from '../../utils/getStrokeCoordinatesFromSVGPath'
import DictionaryLayout from '../../components/DictionaryLayout'
import { Element } from 'html-react-parser'

function KanjiStroke({ stroke }: { stroke: ReactElement }) {
  return (
    <g
      style={{
        fill: 'none',
        stroke: '#404040',
        strokeWidth: '3',
        strokeLinecap: 'round',
        strokeLinejoin: 'round'
      }}
    >
      {stroke}
    </g>
  )
}

function KanjiStrokeWithOrder({ stroke }: { stroke: ReactElement }) {
  // Start coordinates of the kanji stroke
  const { cx, cy } = getStrokeCoordinatesFromSVGPath(stroke.props['d'])

  return (
    <>
      <g
        style={{
          fill: 'none',
          stroke: '#FF8000',
          strokeWidth: '3',
          strokeLinecap: 'round',
          strokeLinejoin: 'round'
        }}
      >
        {stroke}
      </g>
      <g style={{ fill: '#FF0000' }}>
        <circle cx={cx} cy={cy} r="6"></circle>
      </g>
    </>
  )
}

export default function Kanji() {
  const router = useRouter()
  const currentSearchKeyword = router.query.q as string

  const [strokeOrderList, setStrokeOrderList] = useState<ReactElement[][]>()

  const searchResults = useMutation({
    mutationFn: async (keyword: string) => {
      if (!keyword) return null

      const response = await fetch(`/api/dictionary/kanji?keyword=${keyword}`)
      const data = await response.json()

      console.log(data)

      return data
    }
  })

  useEffect(() => {
    if (currentSearchKeyword) {
      searchResults.mutate(currentSearchKeyword)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentSearchKeyword])

  useEffect(() => {
    if (!searchResults.data) return

    const svgPathList = [] as string[]

    parse(searchResults.data.svg, {
      replace: (domNode) => {
        if (domNode instanceof Element && domNode.name === 'path') {
          svgPathList.push(domNode.attribs.d)
        }
      }
    })

    const svgElementList = svgPathList.reduce<ReactElement[][]>(
      (list, svgPath, index) => {
        const elementsList = [] as ReactElement[]
        const element = parse(`<path d="${svgPath}"></path>`) as ReactElement

        if (index > 0) {
          elementsList.push(...list[index - 1])
        }

        if (element) {
          elementsList.push(element)
        }

        return [...list, elementsList]
      },
      []
    )

    console.log(svgElementList)
    setStrokeOrderList(svgElementList)
  }, [searchResults.data])

  return (
    <>
      {strokeOrderList &&
        strokeOrderList.map((strokeGroup, index) => (
          <div
            key={index}
            className="inline-flex border border-gray-600 rounded m-1"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="109"
              height="109"
              viewBox="0 0 109 109"
              className="h-14 w-14 p-2"
            >
              {strokeGroup.map((stroke, index) => {
                // Show stroke order for the last kanji stroke
                if (index + 1 === strokeGroup.length) {
                  return <KanjiStrokeWithOrder key={index} stroke={stroke} />
                }

                return <KanjiStroke key={index} stroke={stroke} />
              })}
            </svg>
          </div>
        ))}
    </>
  )
}

Kanji.getLayout = function getLayout(page: ReactElement) {
  return <DictionaryLayout>{page}</DictionaryLayout>
}
