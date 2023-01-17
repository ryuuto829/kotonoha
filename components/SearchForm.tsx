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
        <div className="relative">
          <input
            type="text"
            className="block w-full p-4 pl-10 text-sm text-gray-900 border border-gray-300 rounded-lg bg-gray-50 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
            placeholder="Search a word.."
            name="search"
            required
          />
          <button
            type="submit"
            className="text-white absolute right-2.5 bottom-2.5 bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-4 py-2 dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
          >
            Search
          </button>
        </div>
      </form>

      {searchResult.isLoading && <div>Loading ...</div>}

      {searchResult.data &&
        searchResult.data.data.map((result) => {
          return (
            <a
              href="#"
              key={result.slug}
              className="block w-full p-6 bg-white border border-gray-200 rounded-lg shadow-md hover:bg-gray-100 dark:bg-gray-800 dark:border-gray-700 dark:hover:bg-gray-700"
            >
              <h5 className="mb-2 text-2xl font-bold tracking-tight text-gray-900 dark:text-white">
                {result.japanese[0].word} 「{result.japanese[0].reading}」
              </h5>
              {result.is_common && (
                <span className="bg-blue-100 text-blue-800 text-xs font-medium mr-2 px-2.5 py-0.5 rounded dark:bg-blue-900 dark:text-blue-300">
                  common
                </span>
              )}
              {result.jlpt[0] && (
                <span className="bg-blue-100 text-blue-800 text-xs font-medium mr-2 px-2.5 py-0.5 rounded dark:bg-blue-900 dark:text-blue-300">
                  {result.jlpt[0]}
                </span>
              )}

              {result.senses.map((sense, i) => (
                <p
                  key={i}
                  className="font-normal text-gray-700 dark:text-gray-400"
                >
                  {i + 1}. {sense.english_definitions}
                </p>
              ))}
            </a>
          )
        })}
    </>
  )
}
