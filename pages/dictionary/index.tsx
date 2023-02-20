import { useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/router'
import { useInfiniteQuery } from '@tanstack/react-query'
import * as Collapsible from '@radix-ui/react-collapsible'
import { MagnifyingGlassIcon, PlusIcon } from '@radix-ui/react-icons'
import type { ReactElement } from 'react'

import type { WordResult } from '../../lib/types'
import AddCard from '../../components/AddCard'
import DictionaryLayout from '../../layouts/DictionaryLayout'

function WordCard({ word }: { word: WordResult }) {
  const [mainReading, ...otherReadings] = word.japanese
  const tags = [word.is_common && 'common', ...word.jlpt].filter((el) => el)

  const [open, setOpen] = useState(false)

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
      <Collapsible.Root open={open} onOpenChange={setOpen}>
        <Collapsible.Trigger className="data-[state=open]:hidden inline-flex items-center space-x-2">
          <PlusIcon className="w- h-5" />
          <span>Add</span>
        </Collapsible.Trigger>
        <Collapsible.Content className="flex flex-col data-[state=open]:border border-white/20 rounded-lg">
          <AddCard
            close={() => setOpen(false)}
            textContent={`${mainReading.word || mainReading.reading}\n---\n${
              mainReading.reading
            } `}
          />
        </Collapsible.Content>
      </Collapsible.Root>

      {/* Divide */}
      <div className="w-full h-[1px] bg-white/20"></div>
    </dl>
  )
}

export default function Dictionary() {
  const router = useRouter()
  const searchKeyword = router.query?.q?.toString()

  const searchQuery = useInfiniteQuery({
    queryKey: ['words', searchKeyword],
    queryFn: async ({ queryKey, pageParam = 1 }) => {
      const [_key, searchKeyword] = queryKey

      if (!searchKeyword) return null

      const response = await fetch(
        `/api/dictionary?keyword=${searchKeyword}&page=${pageParam}`
      )
      const json = await response.json()

      return {
        /**
         * Jisho API returns a results array shaped [ oldWord, ...newWords ]
         * for all pages except the first one. We should remove the first element
         * to avoid duplication when rendering all search results
         */
        data: pageParam === 1 ? json.data : json.data.slice(1),
        /**
         * Provide the current cursor for `getNextPageParam()`
         */
        pageParam
      } as { data: WordResult[]; pageParam: number }
    },
    getNextPageParam: (lastPage) => {
      /**
       * Jisho API doesn't provide information about the page cursor
       * for determining if there is more data to load,
       * so we should to stop fetching when API returns []
       */
      if (lastPage && lastPage?.data.length !== 0) {
        return lastPage.pageParam + 1
      }
    }
  })

  // Loading
  if (searchQuery.isLoading) {
    return <div>Loading ...</div>
  }

  // Empty
  if (!searchKeyword) {
    return (
      <div className="w-full max-w-md h-full mx-auto flex items-center space-x-4 text-white/40">
        <div className="flex-1">
          <MagnifyingGlassIcon className="w-10 h-10" />
        </div>
        <span>
          Start typing any Japanese text or English word in the search box above
          to begin searching
        </span>
      </div>
    )
  }

  // Search results
  if (searchKeyword && searchQuery.data?.pages.length) {
    return (
      <div>
        {searchQuery.data.pages.map((page) => {
          if (!page) return null

          return (
            <div key={page.pageParam} className="flex flex-col gap-5">
              {page.data.map((word) => {
                return <WordCard key={word.slug} word={word} />
              })}
            </div>
          )
        })}

        {/* Load more */}
        <div className="flex items-center justify-center">
          {!searchQuery.hasNextPage && !searchQuery.isFetchingNextPage && (
            <div>No more results to load</div>
          )}

          {searchQuery.hasNextPage && (
            <button
              onClick={() => searchQuery.fetchNextPage()}
              disabled={
                !searchQuery.hasNextPage ||
                searchQuery.isFetchingNextPage ||
                searchQuery.isFetching
              }
              className="inline-flex items-center justify-center whitespace-nowrap rounded h-8 px-3 text-sm leading-5	border border-white/20 hover:bg-white/5 transition disabled:text-gray-700 disabled:pointer-events-none"
            >
              {searchQuery.isFetchingNextPage
                ? 'Loading more...'
                : searchQuery.hasNextPage && 'Load More'}
            </button>
          )}
        </div>
      </div>
    )
  }
}

Dictionary.getLayout = function getLayout(page: ReactElement) {
  return <DictionaryLayout>{page}</DictionaryLayout>
}
