import { useQuery } from '@tanstack/react-query'

export default function SearchForm() {
  const { isLoading, isError, data, error } = useQuery({
    queryKey: ['myQuery'],
    queryFn: async () => {
      const data = await fetch('/api/search/words?keyword=funsui')
      const json = await data.json()
      console.log(json)
      return json
    }
  })

  return (
    <>
      <input type="text" placeholder="Search a word.." />
      {`data: ${data}`}
      {data &&
        data.data.map((query: any) => {
          return <div key={query.slug}>{query.slug}</div>
        })}
    </>
  )
}
