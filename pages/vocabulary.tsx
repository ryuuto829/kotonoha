import { useState, useEffect } from 'react'
import { useRxCollection } from 'rxdb-hooks'
import {
  PlusIcon,
  ArchiveIcon,
  MagnifyingGlassIcon
} from '@radix-ui/react-icons'

import AddWordDialog from '../components/AddWordDialog'
import { REVIEW_STATUS } from '../components/AddWordDialog'

import SortingMenu from '../components/SortingMenu'
import ShowWordsMenu from '../components/ShowWordsMenu'
import MoreOptionsMenu from '../components/MoreOptionsMenu'

function VocabularyList({ wordDocuments, deleteWord }) {
  return (
    <div className="flex flex-col space-y-2 border-y border-white border-opacity-20 divide-y divide-white divide-opacity-20">
      <div className="grid grid-cols-[1fr_1fr_100px_50px] gap-2 px-2">
        <div>Word</div>
        <div>Meaning</div>
        <div>Status</div>
      </div>
      {wordDocuments &&
        wordDocuments.map((doc) => (
          <div
            key={doc.id}
            className="grid grid-cols-[1fr_1fr_100px_50px] gap-2 px-2 py-4"
          >
            <div className="text-lg">{doc.word}</div>
            <div className="text-sm">{doc.meaning}</div>
            <div>
              {REVIEW_STATUS.filter(
                (el) => el.status === doc.reviewStatus?.toString()
              ).map((el) => (
                <div
                  key={el.label}
                  className="inline-flex items-center space-x-2"
                >
                  {el.icon}
                  <span className="text-xs">{el.label}</span>
                </div>
              ))}
            </div>
            <div>
              <MoreOptionsMenu deleteWord={deleteWord} doc={doc} />
            </div>
          </div>
        ))}
    </div>
  )
}

export default function Vocabulary() {
  const wordsCollection = useRxCollection('words')

  const [wordDocuments, setWordDocuments] = useState()
  const [showWords, setShowWords] = useState('25')
  const [sortOption, setSortOption] = useState('createdAt')
  const [isAscending, setIsAscending] = useState(false)
  const [wordDocumentsOffset, setWordDocumentsOffset] = useState(0)
  const [wordDocumentsCount, setWordDocumentsCount] = useState(0)

  useEffect(() => {
    let querySub: any

    if (wordsCollection) {
      const query = wordsCollection
        .find()
        .sort({ [sortOption]: isAscending ? 1 : -1 })
        .skip(wordDocumentsOffset)
        .limit(Number(showWords))

      querySub = query.$.subscribe((results) => {
        console.log(results)

        wordsCollection.count().exec().then(setWordDocumentsCount)
        setWordDocuments(results)
      })
    }

    return () => querySub?.unsubscribe()
  }, [wordsCollection, sortOption, isAscending, showWords, wordDocumentsOffset])

  const deleteWord = async (id) => {
    const wordDocument = wordsCollection?.findOne(id)

    await wordDocument?.remove()
    console.log('DatabaseService: delete doc')
  }

  return (
    <>
      {/* Tabs, add & review */}
      <div className="border-b border-white border-opacity-20 flex items-center justify-between">
        <div className="flex items-center">
          <div className="py-3 relative">
            <div className="inline-flex items-center h-7 rounded px-2">All</div>
            <div className="absolute border-b-2 border-white border-opacity-80 px-2 left-2 right-2 bottom-0"></div>
          </div>
          <div className="py-3 relative">
            <div className="inline-flex items-center h-7 rounded px-2">
              Due for SRS
            </div>
            <div className="absolute border-b-2 border-white border-opacity-80 px-2 left-2 right-2 bottom-0"></div>
          </div>
        </div>

        <div className="flex items-center space-x-2">
          <AddWordDialog>
            <button className="flex items-center text-white border border-white border-opacity-20 px-3 rounded-[3px] h-8 space-x-2">
              <PlusIcon className="w-4 h-4" />
              <span>Add word</span>
            </button>
          </AddWordDialog>
          <button className="flex items-center text-white bg-[rgb(35,131,226)] px-3 rounded-[3px] h-8 space-x-2">
            <ArchiveIcon className="w-4 h-4" />
            <span>Review</span>
          </button>
        </div>
      </div>

      {/* Sort, filter & search */}
      <div className="flex items-center space-x-2 py-2">
        <SortingMenu
          isAscending={isAscending}
          changeAscending={setIsAscending}
          sortOption={sortOption}
          changeSortOption={setSortOption}
        />
        <ShowWordsMenu
          wordsNumber={showWords}
          changeOffset={setWordDocumentsOffset}
          changeWordsNumber={setShowWords}
        />

        <div className="relative w-full">
          <input
            type="text"
            name="search"
            defaultValue={''}
            className="block w-full p-2 pl-10 text-base bg-[color:rgb(37,37,37)] rounded"
            placeholder="Search"
            required
          />
          <div className="absolute inset-y-0 left-0">
            <button type="submit" className="p-2 hover:text-red-400 transition">
              <MagnifyingGlassIcon className="w-6 h-6" />
            </button>
          </div>
        </div>
      </div>

      <VocabularyList wordDocuments={wordDocuments} deleteWord={deleteWord} />

      <div>
        <button
          onClick={() => {
            const count = wordDocumentsOffset - Number(showWords)

            if (count >= 0) {
              setWordDocumentsOffset(count)
            }
          }}
        >
          Prev page
        </button>
        <button
          onClick={() => {
            const count = wordDocumentsOffset + Number(showWords)

            if (count <= wordDocumentsCount) {
              setWordDocumentsOffset(count)
            }
          }}
        >
          Next page
        </button>
        <div>{`Showing ${wordDocumentsOffset + 1}-${
          wordDocumentsOffset + (wordDocuments?.length || 0)
        } of ${wordDocumentsCount} Entries`}</div>
      </div>
    </>
  )
}
