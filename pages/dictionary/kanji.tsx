import { useEffect } from 'react'
import { useRouter } from 'next/router'
import { useMutation } from '@tanstack/react-query'

import type { ReactElement } from 'react'
import DictionaryLayout from '../../components/DictionaryLayout'

export default function Kanji() {
  const router = useRouter()
  const currentSearchKeyword = router.query.q as string

  const searchResults = useMutation({
    mutationFn: async (keyword: string) => {
      if (!keyword) return null

      const response = await fetch(`/api/dictionary/word?keyword=${keyword}`)
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

  return <div>Kanji definition</div>
}

Kanji.getLayout = function getLayout(page: ReactElement) {
  return <DictionaryLayout>{page}</DictionaryLayout>
}
