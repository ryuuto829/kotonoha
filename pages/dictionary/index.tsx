import { useRouter } from 'next/router'
import { useInfiniteQuery } from '@tanstack/react-query'
import { MagnifyingGlassIcon } from '@radix-ui/react-icons'
import type { ReactElement } from 'react'

import { _formatCardContent, _calculateDueDate } from '../../lib/words'
import type { WordResult } from '../../lib/types'
import DictionaryLayout from '../../layouts/DictionaryLayout'
import WordCard from '../../components/WordCard'

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
