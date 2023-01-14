import { useMutation } from '@tanstack/react-query'
import { useRouter } from 'next/router'
import { useEffect, FormEvent } from 'react'

export default function SearchForm() {
  const router = useRouter()
  const searchWord = router.query.q

  const searchResult = useMutation({
    mutationFn: async (keyword: string) => {
      if (!keyword) return null

      const data = await fetch(`/api/search/words?keyword=${keyword}`)
      const json = await data.json()

      console.log(json.data)

      return json
    }
  })

  useEffect(() => {
    if (searchWord) {
      searchResult.mutate(searchWord)
    }
  }, [searchWord])

  const handleSearchFormSubmit = (event: FormEvent) => {
    event.preventDefault()

    const formData = new FormData(event.target as HTMLFormElement)
    const searchInput = formData.get('search')

    router.push(`/search?q=${searchInput}`)
  }

  return (
    <>
      <form onSubmit={handleSearchFormSubmit}>
        <input type="text" placeholder="Search a word.." name="search" />
        <button type="submit">Search</button>
      </form>

      {searchResult.isLoading && <div>Loading ...</div>}

      {searchResult.data &&
        searchResult.data.data.map((result) => {
          return <div key={result.slug}>{result.slug}</div>
        })}
    </>
  )
}
