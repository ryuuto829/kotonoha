import Link from 'next/link'
import { useRouter } from 'next/router'
import { useEffect, useState } from 'react'
import type { FormEvent, ReactNode } from 'react'

import getKanjisFromText from '../lib/getKanjisFromText'
import { BackspaceIcon, MagnifyingGlassIcon } from '@heroicons/react/24/outline'

export default function DictionaryLayout({
  children
}: {
  children: ReactNode
}) {
  const router = useRouter()

  const [currentSearchKeyword, setCurrentSearchKeyword] = useState(
    router.query.q as string
  )
  const kanjiList = getKanjisFromText(currentSearchKeyword)

  useEffect(() => {
    if (router.pathname === '/dictionary' && router.query.q) {
      setCurrentSearchKeyword(router.query.q)
    }
  }, [router])

  const handleSearchFormSubmit = (event: FormEvent) => {
    event.preventDefault()

    const formData = new FormData(event.target as HTMLFormElement)
    const searchInput = formData.get('search')

    router.push(`/dictionary?q=${searchInput}`, undefined, { shallow: true })
  }
  return (
    <>
      <main className="w-full max-w-2xl mx-auto px-2 py-4 text-gray-200">
        {/* SEARCH FORM */}
        <form onSubmit={handleSearchFormSubmit}>
          <div className="relative">
            <input
              type="text"
              className="block w-full p-2 pr-20 text-base bg-[color:rgb(37,37,37)] rounded"
              placeholder="Search a Japanese or English word"
              name="search"
              required
            />
            <div className="absolute inset-y-0 right-0">
              <button
                type="reset"
                className="p-2 hover:text-red-400 transition"
              >
                <BackspaceIcon className="w-6 h-6" />
              </button>
              <button
                type="submit"
                className="p-2 hover:text-red-400 transition"
              >
                <MagnifyingGlassIcon className="w-6 h-6" />
              </button>
            </div>
          </div>
        </form>

        {/* SEARCH FILTER */}
        <div className="flex items-center py-4">
          {/* All results */}

          {currentSearchKeyword && (
            <Link
              href={`/dictionary?q=${currentSearchKeyword}`}
              className={`inline-flex items-center h-9 px-3 text-sm text-white text-center rounded ${
                router.pathname === '/dictionary' && !router.query.details
                  ? 'bg-[rgb(35,131,226)] hover:bg-[rgb(0,117,211)]'
                  : 'border border-white border-opacity-20 hover:bg-white hover:bg-opacity-5'
              }`}
            >
              Search results
            </Link>
          )}

          {/* Get kanji details */}
          {kanjiList &&
            kanjiList.map((kanji) => (
              <Link
                key={kanji}
                href={`/dictionary/kanji/${kanji}`}
                className={`inline-flex items-center h-9 px-3 ml-1.5 text-lg text-white text-center rounded ${
                  router.pathname === `/dictionary/kanji/${kanji}`
                    ? 'bg-[rgb(35,131,226)] hover:bg-[rgb(0,117,211)]'
                    : 'border border-white border-opacity-20 hover:bg-white hover:bg-opacity-5'
                }`}
              >
                {kanji}
              </Link>
            ))}

          {/* Current details */}
          {router.query.details && (
            <Link
              href={`/dictionary?q=${currentSearchKeyword}&details=${router.query.details}`}
              className="inline-flex items-center h-9 px-3 ml-1.5 text-sm text-white text-center rounded shadow-md bg-[rgb(35,131,226)] hover:bg-[rgb(0,117,211)]"
            >
              <span className="pr-1">Details for</span>
              <span className="text-lg">{router.query.details}</span>
            </Link>
          )}
        </div>

        {/* SEARCH RESULTS */}
        {children}
      </main>
    </>
  )
}
