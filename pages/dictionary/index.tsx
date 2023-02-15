import Link from 'next/link'
import { useRouter } from 'next/router'
import { useInfiniteQuery } from '@tanstack/react-query'
import type { ReactElement } from 'react'
import { MagnifyingGlassIcon, PlusIcon } from '@radix-ui/react-icons'
import type { QueryFunctionContext } from '@tanstack/react-query'

import type { WordResult } from '../../lib/types'
import DictionaryLayout from '../../layouts/DictionaryLayout'
import AddWordDialog from '../../components/AddWordDialog'

function createWordTagsList(isCommon: boolean, jlpt: string[]) {
  const commonTag = isCommon
    ? [
        {
          label: 'common',
          title: 'Common word',
          color: 'bg-[rgb(43,89,63)]'
        }
      ]
    : []
  const jlptTags = jlpt.length
    ? jlpt.map((label) => ({
        label: label,
        title: 'Japanese-Language Proficiency Test',
        color: 'bg-[rgb(40,69,108)]'
      }))
    : []

  return [...commonTag, ...jlptTags]
}

async function fetchWords({
  queryKey,
  pageParam = 1
}: QueryFunctionContext<[string, string | null | undefined]>) {
  const [_key, searchKeyword] = queryKey

  if (!searchKeyword) return null

  const response = await fetch(
    `/api/dictionary?keyword=${searchKeyword}&page=${pageParam}`
  )
  const json = await response.json()

  const data = {
    // Jisho API returns a results array shaped [ oldWord, ...newWords ]
    // for all pages except the first one. We should remove the first element
    // to avoid duplication when rendering all search results
    data: pageParam === 1 ? json.data : json.data.slice(1),

    // Provide the current cursor for `getNextPageParam()`
    pageParam
  }

  return data as { data: WordResult[]; pageParam: number }
}

export default function Dictionary() {
  const router = useRouter()
  const searchKeyword = router.query?.q?.toString()

  const searchQuery = useInfiniteQuery({
    queryKey: ['words', searchKeyword],
    queryFn: fetchWords,
    getNextPageParam: (lastPage) => {
      // Jisho API doesn't provide information about the page cursor
      // determining if there is more data to load,
      // so we should to stop fetching when API returns []
      if (lastPage && lastPage?.data.length !== 0) {
        return lastPage.pageParam + 1
      }
    }
  })

  return (
    <>
      {/* Loading */}
      {searchQuery.isLoading && <div>Loading ...</div>}

      {!searchKeyword && (
        <div className="w-full max-w-md h-full mx-auto flex items-center space-x-4 text-white/40">
          <div className="flex-1">
            <MagnifyingGlassIcon className="w-10 h-10" />
          </div>
          <span>
            Start typing any Japanese text or English word in the search box
            above to begin searching
          </span>
        </div>
      )}

      {/* Search results */}
      {searchKeyword &&
        searchQuery.data?.pages.length &&
        searchQuery.data.pages.map((page) => {
          if (!page) return null

          return (
            <div key={page.pageParam} className="divide-y divide-white/20">
              {page.data.map((word) => {
                const [mainReading, ...otherReadings] = word.japanese
                const wordTags = createWordTagsList(word.is_common, word.jlpt)

                return (
                  <div key={word.slug} className="block w-full py-5">
                    <dl className="grid gap-4">
                      {/* Word literal, reading, tags & save */}
                      <div>
                        <div className="flex items-center justify-between">
                          <div className="flex items-center space-x-6">
                            <h1 className="text-3xl">
                              {mainReading.word || mainReading.reading}
                            </h1>

                            {wordTags.length !== 0 && (
                              <div className="inline-flex items-center space-x-2">
                                {wordTags.map((tag) => (
                                  <abbr
                                    key={tag.label}
                                    title={tag.title}
                                    className={`inline-flex items-center font-medium h-5 rounded-md px-[9px] text-xs no-underline bg-indigo-300 text-indigo-800`}
                                  >
                                    {tag.label}
                                  </abbr>
                                ))}
                              </div>
                            )}
                          </div>

                          <AddWordDialog word={word}>
                            <button className="inline-flex items-center space-x-2 whitespace-nowrap rounded h-8 px-3 text-sm leading-5 border border-white/20 hover:bg-white/5 transition">
                              <PlusIcon className="w-4 h-4" />
                              <span>Save</span>
                            </button>
                          </AddWordDialog>
                        </div>

                        {mainReading.word && (
                          <div className="mt-2">{mainReading.reading}</div>
                        )}
                      </div>

                      {/* Meanings */}
                      <dd>
                        {word.senses.map((meaning, index) => {
                          const partOfSpeech =
                            meaning.parts_of_speech.join(', ')

                          return (
                            <>
                              <p
                                key={index + 'p'}
                                className="text-sm font-medium text-white text-opacity-50 mt-1"
                              >
                                {partOfSpeech}
                              </p>

                              <div
                                key={index + 'd'}
                                className="text-lg text-white text-opacity-80 mt-1"
                              >
                                <span>
                                  {`${
                                    index + 1
                                  }. ${meaning.english_definitions.join(', ')}`}
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
                                    {`. Only applies to ${meaning.restrictions.join(
                                      ', '
                                    )}`}
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

                                {meaning.links.length > 0 && (
                                  <span className="text-gray-500 text-sm">
                                    {' '}
                                    <a
                                      href={meaning.links[0].url}
                                      className="text-blue-400"
                                    >
                                      Read on Wikipedia
                                    </a>
                                  </span>
                                )}
                              </div>
                            </>
                          )
                        })}
                      </dd>

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
                                  href={`/dictionary?q=${
                                    readings.word || readings.reading
                                  }`}
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
                    </dl>
                  </div>
                )
              })}
            </div>
          )
        })}
      {/* END of Search results */}

      {/* Load more */}
      {searchKeyword && !searchQuery.isFetching && (
        <div className="flex items-center justify-center">
          {searchQuery.hasNextPage && (
            <button
              onClick={() => searchQuery.fetchNextPage()}
              disabled={
                !searchQuery.hasNextPage || searchQuery.isFetchingNextPage
              }
              className={`inline-flex items-center justify-center whitespace-nowrap rounded h-8 px-3 text-sm leading-5	border border-white/20 hover:bg-white/5 transition`}
            >
              {searchQuery.isFetchingNextPage
                ? 'Loading more...'
                : searchQuery.hasNextPage && 'Load More'}
            </button>
          )}

          {!searchQuery.hasNextPage && !searchQuery.isFetchingNextPage && (
            <div>No more results to load</div>
          )}
        </div>
      )}
    </>
  )
}

Dictionary.getLayout = function getLayout(page: ReactElement) {
  return <DictionaryLayout>{page}</DictionaryLayout>
}
