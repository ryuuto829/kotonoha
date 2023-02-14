import { useEffect, useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/router'
import { tokenize, isKanji } from 'wanakana'
import type { FormEvent, ReactNode } from 'react'

import { MagnifyingGlassIcon } from '@radix-ui/react-icons'

function getKanjiListFromText(text?: string) {
  if (!text) return []

  // ex.: '1aあ冷静' -> ['冷', '静']
  const kanjiList = tokenize(text).filter(isKanji).join('').split('')

  // remove duplicates
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
      label: 'Search results'
    },
    ...getKanjiListFromText(keyword).map((kanji) => ({
      url: `/dictionary/kanji/${kanji}`,
      isActive: kanji === searchKanji,
      label: kanji
    }))
  ]

  useEffect(() => {
    // Persist search context history
    if (searchKeyword) {
      setKeyword(searchKeyword)
    }
  }, [searchKeyword])

  const handleSearchFormSubmit = (e: FormEvent) => {
    e.preventDefault()

    const formData = new FormData(e.target as HTMLFormElement)
    const searchInputData = formData.get('search')

    router.push(`/dictionary?q=${searchInputData}`, undefined, {
      shallow: true
    })
  }

  return (
    <>
      <div className="flex flex-col space-y-5">
        {/* Search form */}
        <form onSubmit={handleSearchFormSubmit} className="relative">
          <input
            type="search"
            name="search"
            autoCapitalize="off"
            autoCorrect="off"
            spellCheck="false"
            autoComplete="off"
            defaultValue={keyword || ''}
            className="block w-full h-10 pl-9 pr-4 placeholder:text-white/40 bg-transparent border border-white/20 rounded-md outline-none"
            placeholder="Search a Japanese or English word"
            required
          />
          <div className="absolute inset-y-0 left-0 flex items-center justify-center w-9 text-white/40">
            <MagnifyingGlassIcon className="w-5 h-5" />
          </div>
        </form>

        {/* Search context */}
        {keyword && (
          <div className="flex items-center flex-wrap gap-2">
            {searchContext.map((context) => (
              <Link
                key={context.label}
                href={context.url}
                className={`inline-flex items-center justify-center h-8 px-3 text-sm text-white text-center whitespace-nowrap rounded-lg ${
                  context.isActive
                    ? 'bg-[rgb(35,131,226)] hover:bg-[rgb(0,117,211)]'
                    : 'border border-white border-opacity-20 hover:bg-white hover:bg-opacity-5'
                }`}
              >
                {context.label}
              </Link>
            ))}
          </div>
        )}
      </div>

      {/* Context pages */}
      {children}
    </>
  )
}
