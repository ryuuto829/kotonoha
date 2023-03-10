import { ReactElement } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/router'
import { useInfiniteQuery } from '@tanstack/react-query'
import { WordResult } from '../../lib/types'
import DictionaryLayout from '../../layouts/DictionaryLayout'
import WordCard from '../../components/WordCard'

function LoadingIcon() {
  return (
    <svg
      aria-hidden="true"
      className="w-8 h-8 animate-spin text-white/10 fill-[#9da2ff]"
      viewBox="0 0 100 101"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z"
        fill="currentColor"
      />
      <path
        d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z"
        fill="currentFill"
      />
    </svg>
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
    return (
      <div role="status" className="flex items-center w-full justify-center">
        <LoadingIcon />
        <span className="sr-only">Loading...</span>
      </div>
    )
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
