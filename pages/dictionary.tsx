import { useEffect } from 'react'
import { useRouter } from 'next/router'
import { useMutation } from '@tanstack/react-query'
import type { ReactElement } from 'react'
import type { WordResult } from '../lib/types'

import DictionaryLayout from '../components/DictionaryLayout'
import SearchResult from '../components/SearchResult'

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

  const getDetails = (slug: string) => {
    router.push({
      href: router.pathname,
      query: { ...router.query, details: slug }
    })
  }

  if (details) {
    return <div>Additional info</div>
  }

  return (
    <div>
      {searchResults.isLoading && <div>Loading ...</div>}

      {/* SEARCH RESULTS */}
      {searchResults.data &&
        searchResults.data.map((word) => {
          return (
            <SearchResult key={word.slug} word={word} getDetails={getDetails} />
          )
        })}
    </div>
  )
}

Dictionary.getLayout = function getLayout(page: ReactElement) {
  return <DictionaryLayout>{page}</DictionaryLayout>
}
