import { ReactElement } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/router'
import { useInfiniteQuery } from '@tanstack/react-query'
import { WordResult } from '../../lib/types'
import DictionaryLayout from '../../layouts/DictionaryLayout'
import WordCard from '../../components/WordCard'

function WordSkeleton() {
  return (
    <div className="space-y-4 animate-pulse">
      {[...Array.from(Array(2))].map((_, index) => (
        <div key={index} className="flex flex-col gap-4">
          <div className="flex flex-col gap-2">
            <div className="h-9 rounded-full bg-white/5 w-32"></div>
            <div className="h-6 rounded-full bg-white/5 w-24"></div>
          </div>
          <div className="flex flex-col gap-1">
            <div className="h-5 rounded-full bg-white/5 w-72"></div>
            <div className="h-7 rounded-full bg-white/5 w-96"></div>
          </div>
          <div className="h-7 rounded-full bg-white/5 w-24"></div>
          <div className="h-[1px] rounded-full bg-white/10 w-full"></div>
        </div>
      ))}
    </div>
  )
}

function EmptyState() {
  return (
    <div className="flex flex-col items-center justify-center text-white/40">
      {/* Empty space */}
      <div className="h-[calc((100vh-400px)*0.3)]"></div>
      {/* Content */}
      <div className="flex flex-col gap-4 max-w-md">
        <h2 className="text-white/80 text-lg">Japanese Dictionary</h2>
        <p>
          Start typing any Japanese text or English word in the search box above
          to begin searching using Jisho dictionary.
        </p>
        <div>
          <div className="flex gap-2">
            <span>English word search example:</span>
            <Link href="/dictionary?q=house" className="text-[#9da2ff]">
              house
            </Link>
          </div>
          <div className="flex gap-2">
            <span>Japanese word search example:</span>
            <Link href="/dictionary?q=冷静" className="text-[#9da2ff]">
              冷静
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}

export default function Dictionary() {
  const router = useRouter()
  const searchKeyword = router.query?.q?.toString()

  const searchQuery = useInfiniteQuery({
    queryKey: ['words', searchKeyword],
    queryFn: async ({ queryKey, pageParam = 1 }) => {
      const [_, searchKeyword] = queryKey

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

  if (searchQuery.isLoading) {
    return <WordSkeleton />
  }

  if (!searchKeyword) {
    return <EmptyState />
  }

  if (searchKeyword && searchQuery.data?.pages.length) {
    return (
      <>
        {/* Search results */}
        {searchQuery.data.pages.map((page) => {
          if (!page) return null

          return (
            <div key={page.pageParam} className="flex flex-col gap-5">
              {page.data.map((word) => (
                <WordCard key={word.slug} word={word} />
              ))}
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
              className="inline-flex items-center whitespace-nowrap rounded h-8 px-3 text-sm leading-5 border border-white/20 hover:bg-white/5 transition-colors disabled:text-gray-700 disabled:pointer-events-none"
            >
              {searchQuery.isFetchingNextPage
                ? 'Loading more...'
                : searchQuery.hasNextPage && 'Load More'}
            </button>
          )}
        </div>
      </>
    )
  }
}

Dictionary.getLayout = function getLayout(page: ReactElement) {
  return <DictionaryLayout>{page}</DictionaryLayout>
}
