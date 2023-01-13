import { useQuery } from '@tanstack/react-query'

export default function SearchForm() {
  const myQuery = useQuery({
    queryKey: ['myQuery'],
    queryFn: async () => {
      const data = await fetch(
        'https://cors-anywhere.herokuapp.com/jisho.org/api/v1/search/words?keyword=せんせい?page=2'
      )
      const json = await data.json()
      return json
    }
  })
  console.log(myQuery)

  return (
    <>
      <input type="text" placeholder="Search a word.." />
      {myQuery.data &&
        myQuery.data.data.map((query: any) => {
          return <div key={query.slug}>{query.slug}</div>
        })}
    </>
  )
}
