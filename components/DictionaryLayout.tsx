import Link from 'next/link'
import { useRouter } from 'next/router'
import type { FormEvent, ReactNode } from 'react'

import getKanjisFromText from '../lib/getKanjisFromText'
import { BackspaceIcon, MagnifyingGlassIcon } from '@heroicons/react/24/outline'

export default function DictionaryLayout({
  children
}: {
  children: ReactNode
}) {
  const router = useRouter()
  const currentSearchKeyword = router.query.q as string
  const kanjiList = getKanjisFromText(currentSearchKeyword)

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
          <Link
            href={`/dictionary?q=${currentSearchKeyword}`}
            className={`inline-flex px-3 py-2 mr-1 text-sm text-white text-center rounded-lg border border-gray-600 ${
              router.pathname === '/dictionary' && !router.query.details
                ? 'bg-blue-700'
                : ''
            }`}
          >
            Search results
          </Link>

          {/* Get kanji details */}
          {kanjiList &&
            kanjiList.map((kanji) => (
              <Link
                key={kanji}
                href={`/dictionary/kanji?q=${kanji}`}
                className={`inline-flex px-3 py-2 mr-1 text-sm text-white text-center rounded-lg border border-gray-600 ${
                  router.pathname === '/dictionary/kanji' ? 'bg-blue-700' : ''
                }`}
              >
                {kanji}
              </Link>
            ))}

          {/* Current details */}
          {router.query.details && (
            <span className="inline-flex px-3 py-2 mr-1 text-sm text-white text-center rounded-lg border border-gray-600 bg-blue-700">
              Details here
            </span>
          )}
        </div>

        {/* SEARCH RESULTS */}
        {children}
      </main>
    </>
  )
}
