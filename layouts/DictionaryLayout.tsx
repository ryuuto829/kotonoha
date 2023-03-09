import { useEffect, useState, FormEvent, ReactNode } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/router'
import { tokenize, isKanji } from 'wanakana'
import { MagnifyingGlassIcon } from '@radix-ui/react-icons'

function getKanjiFromText(text?: string) {
  if (!text) return []
  /**
   * Example: '1aあ冷静' -> ['冷', '静']
   */
  const kanjiList = tokenize(text).filter(isKanji).join('').split('')
  /**
   * Remove duplicates
   */
  return [...new Set(kanjiList)]
}

export default function DictionaryLayout({
  children
}: {
  children: ReactNode
}) {
  const router = useRouter()
  const searchKeyword = router.query?.q?.toString()
  const searchKanji = router.query?.kanji?.toString()
  const [keyword, setKeyword] = useState(searchKeyword)

  const searchContext = [
    {
      url: `/dictionary?q=${keyword}`,
      isActive: keyword && !searchKanji,
      name: 'Search results'
    },
    ...getKanjiFromText(keyword).map((kanji) => ({
      url: `/dictionary/kanji/${kanji}`,
      isActive: kanji === searchKanji,
      name: kanji
    }))
  ]

  useEffect(() => {
    /**
     * Persist search context history
     */
    if (searchKeyword) {
      setKeyword(searchKeyword)
    }
  }, [searchKeyword])

  const submitSearchForm = (event: FormEvent) => {
    event.preventDefault()

    const formData = new FormData(event.target as HTMLFormElement)
    const input = formData.get('search')

    router.push(`/dictionary?q=${input}`, undefined, {
      shallow: true
    })
  }

  return (
    <>
      <header className="flex flex-col gap-5 pt-9">
        {/* Search form */}
        <form onSubmit={submitSearchForm} className="relative">
          <MagnifyingGlassIcon
            aria-hidden={true}
            className="w-6 h-6 p-2 box-content absolute left-0 flex items-center justify-center text-white/40"
          />
          <input
            type="search"
            name="search"
            autoCapitalize="off"
            autoCorrect="off"
            spellCheck="false"
            autoComplete="off"
            defaultValue={keyword || ''}
            placeholder="Search a Japanese or English word"
            required
            className="flex w-full h-10 pl-9 pr-4 bg-transparent rounded-md outline-none text-lg border border-white/20 focus:border-[#9da2ff] placeholder:text-white/40 placeholder:text-base transition-colors"
          />
        </form>
        {/* Search context */}
        {keyword && (
          <div className="flex items-center flex-wrap gap-2">
            {searchContext.map(({ name, url, isActive }) => {
              const active = isActive
                ? 'bg-[#303136]'
                : 'border border-white/20 '

              return (
                <Link
                  key={name}
                  href={url}
                  className={`inline-flex items-center h-8 px-3 text-sm font-medium whitespace-nowrap rounded-lg hover:bg-white/5 ${active}`}
                >
                  {name}
                </Link>
              )
            })}
          </div>
        )}
      </header>

      {/* Context pages */}
      <section className="flex flex-col gap-8">{children}</section>
    </>
  )
}
