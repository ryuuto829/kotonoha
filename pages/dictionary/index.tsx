import { useEffect } from 'react'
import { useRouter } from 'next/router'
import { useMutation } from '@tanstack/react-query'
import type { ReactElement } from 'react'
import type { WordResult } from '../../lib/types'

import { WordTags, WordMeanings } from '../../components/SearchResult'

import DictionaryLayout from '../../components/DictionaryLayout'
import SearchResult from '../../components/SearchResult'
import Link from 'next/link'

export default function Dictionary() {
  const router = useRouter()
  const currentSearchKeyword = router.query.q as string
  const details = router.query.details

  const searchResults = useMutation({
    mutationFn: async (keyword: string) => {
      if (!keyword) return null

      const response = await fetch(`/api/dictionary?keyword=${keyword}`)
      const { data } = await response.json()

      console.log(data)

      return data as WordResult[]
    }
  })

  useEffect(() => {
    if (currentSearchKeyword) {
      searchResults.mutate(currentSearchKeyword)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentSearchKeyword])

  const wordDetails = searchResults.data?.find((el) => el.slug === details)

  if (details && wordDetails) {
    const mainWordReading = wordDetails.japanese[0]
    const otherWordForms =
      wordDetails.japanese.length > 1 && wordDetails.japanese.slice(1)

    return (
      <div className="bg-[rgb(32,32,32)] p-6 mt-5 rounded-xl">
        {/* WORD HEADER */}
        <div className="inline-flex">
          {/* Word readings */}
          <div>
            <div className="text-4xl">
              {mainWordReading.word
                ? mainWordReading.word
                : mainWordReading.reading}
            </div>
            <div className="mt-2">
              {mainWordReading.word && mainWordReading.reading}
            </div>
          </div>
          {/* Word tags */}
          <div className="flex items-center h-10 ml-6">
            <WordTags
              isCommon={wordDetails.is_common}
              jlpt={wordDetails.jlpt}
            />
          </div>
        </div>

        {/* OTHER FORMS */}
        {otherWordForms && (
          <div className="mt-6">
            <div className="text-sm text-gray-400">OTHER FORMS</div>
            <div className="mt-2">
              {otherWordForms.map((item, index) => {
                return (
                  <Link
                    key={index}
                    href={`/dictionary?q=${item.word || item.reading}`}
                    className="inline-flex border border-white border-opacity-20 px-4 py-2 rounded mr-2 hover:bg-white hover:bg-opacity-5"
                  >
                    {item.word
                      ? `${item.word} 【${item.reading}】`
                      : item.reading}
                  </Link>
                )
              })}
            </div>
          </div>
        )}

        {/* MEANINGS */}
        <div className="mt-6">
          <div className="text-sm text-gray-400">MEANINGS</div>
          <div className="mt-2">
            <WordMeanings meanings={wordDetails.senses} />
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="bg-[rgb(32,32,32)] mt-5 rounded-xl divide-y divide-white divide-opacity-20 shadow-md">
      {searchResults.isLoading && <div>Loading ...</div>}

      {/* SEARCH RESULTS */}
      {searchResults.data &&
        searchResults.data.map((word) => {
          return <SearchResult key={word.slug} word={word} />
        })}
    </div>
  )
}

Dictionary.getLayout = function getLayout(page: ReactElement) {
  return <DictionaryLayout>{page}</DictionaryLayout>
}
