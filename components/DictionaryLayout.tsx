import { useEffect, useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/router'
import type { FormEvent, ReactNode } from 'react'

import getKanjisFromText from '../lib/getKanjisFromText'
import { BackspaceIcon, MagnifyingGlassIcon } from '@heroicons/react/24/outline'

const DICTIONARY_SEARCH_URL = '/dictionary'
const DICTIONARY_KANJI_URL = '/dictionary/kanji'
const DICTIONARY_KANJI_PATH = '/dictionary/kanji/[kanji]'

function SearchForm({
  currentSearchKeyword,
  handleSearchFormSubmit
}: {
  currentSearchKeyword: string | null
  handleSearchFormSubmit: (event: FormEvent) => void
}) {
  return (
    <form
      onSubmit={handleSearchFormSubmit}
      onReset={(event) => {
        // Override the default value of input when resetting form
        const input = event.currentTarget.querySelector("[name='search'")
        input?.setAttribute('value', '')
      }}
    >
      <div className="relative">
        <input
          type="text"
          name="search"
          defaultValue={currentSearchKeyword || ''}
          className="block w-full p-2 pr-20 text-base bg-[color:rgb(37,37,37)] rounded"
          placeholder="Search a Japanese or English word"
          required
        />
        <div className="absolute inset-y-0 right-0">
          <button type="reset" className="p-2 hover:text-red-400 transition">
            <BackspaceIcon className="w-6 h-6" />
          </button>
          <button type="submit" className="p-2 hover:text-red-400 transition">
            <MagnifyingGlassIcon className="w-6 h-6" />
          </button>
        </div>
      </div>
    </form>
  )
}

function ResultsContextToggle({
  currentSearchKeyword,
  wordDetails,
  kanjiDetails
}: {
  currentSearchKeyword: string | null
  wordDetails: string | null
  kanjiDetails: string | null
}) {
  const kanjiList =
    (currentSearchKeyword && getKanjisFromText(currentSearchKeyword)) || null

  return (
    <div className="flex items-center py-4">
      {/* All results context */}
      {currentSearchKeyword && (
        <Link
          href={`${DICTIONARY_SEARCH_URL}?q=${currentSearchKeyword}`}
          className={`inline-flex items-center h-9 px-3 text-sm text-white text-center rounded ${
            currentSearchKeyword && !wordDetails && !kanjiDetails
              ? 'bg-[rgb(35,131,226)] hover:bg-[rgb(0,117,211)]'
              : 'border border-white border-opacity-20 hover:bg-white hover:bg-opacity-5'
          }`}
        >
          Search results
        </Link>
      )}

      {/* Kanji details context */}
      {kanjiList &&
        kanjiList.map((kanji) => (
          <Link
            key={kanji}
            href={`${DICTIONARY_KANJI_URL}/${kanji}`}
            className={`inline-flex items-center h-9 px-3 ml-1.5 text-lg text-white text-center rounded ${
              kanjiDetails === kanji
                ? 'bg-[rgb(35,131,226)] hover:bg-[rgb(0,117,211)]'
                : 'border border-white border-opacity-20 hover:bg-white hover:bg-opacity-5'
            }`}
          >
            {kanji}
          </Link>
        ))}

      {/* Word details context */}
      {wordDetails && (
        <Link
          href={`${DICTIONARY_SEARCH_URL}?q=${currentSearchKeyword}&details=${wordDetails}`}
          className="inline-flex items-center h-9 px-3 ml-1.5 text-sm text-white text-center rounded shadow-md bg-[rgb(35,131,226)] hover:bg-[rgb(0,117,211)]"
        >
          <span className="pr-1">Details for</span>
          <span className="text-lg">{wordDetails}</span>
        </Link>
      )}
    </div>
  )
}

export default function DictionaryLayout({
  children
}: {
  children: ReactNode
}) {
  const router = useRouter()

  // Current search context from URL
  const [searchKeyword, wordDetails, kanjiDetails] = [
    (router.pathname === DICTIONARY_SEARCH_URL &&
      router.query?.q?.toString()) ||
      null,
    (router.pathname === DICTIONARY_SEARCH_URL &&
      router.query?.details?.toString()) ||
      null,
    (router.pathname === DICTIONARY_KANJI_PATH &&
      router.query?.kanji?.toString()) ||
      null
  ]

  const [currentSearchKeyword, setCurrentSearchKeyword] =
    useState(searchKeyword)

  useEffect(() => {
    // Persist search context history
    if (searchKeyword) {
      setCurrentSearchKeyword(searchKeyword)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [router])

  const handleSearchFormSubmit = (event: FormEvent) => {
    event.preventDefault()

    const formData = new FormData(event.target as HTMLFormElement)
    const searchInput = formData.get('search')

    router.push(`${DICTIONARY_SEARCH_URL}?q=${searchInput}`, undefined, {
      shallow: true
    })
  }

  return (
    <main className="w-full max-w-2xl mx-auto px-2 py-4 text-gray-200">
      {/* Search by context */}
      <SearchForm
        handleSearchFormSubmit={handleSearchFormSubmit}
        currentSearchKeyword={currentSearchKeyword}
      />
      <ResultsContextToggle
        currentSearchKeyword={currentSearchKeyword}
        wordDetails={wordDetails}
        kanjiDetails={kanjiDetails}
      />

      {/* Context pages */}
      {children}
    </main>
  )
}
