import { useState, useEffect } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/router'
import { useRxCollection } from 'rxdb-hooks'
import * as Dialog from '@radix-ui/react-dialog'
import {
  PlusIcon,
  ArchiveIcon,
  MagnifyingGlassIcon
} from '@radix-ui/react-icons'

import { WordDocType } from '../../lib/types'
import SortingMenu from '../../components/SortingMenu'
import ShowWordsMenu from '../../components/ShowWordsMenu'
import MoreOptionsMenu from '../../components/MoreOptionsMenu'
import AddCard from '../../components/AddCard'
import { REVIEW_STATUS } from '../../components/StatusMenu'
import Review from '../../components/Review'
import { deleteCard } from '../../lib/words'

export default function Vocabulary() {
  const router = useRouter()
  const collection = useRxCollection<WordDocType>('words')

  const [srs, review] = router.query?.params || []

  const [wordDocuments, setWordDocuments] = useState<WordDocType[] | null>(null)
  const [showWords, setShowWords] = useState('25')
  const [sortOption, setSortOption] = useState('createdAt')
  const [isAscending, setIsAscending] = useState(false)
  const [wordDocumentsOffset, setWordDocumentsOffset] = useState(0)
  const [wordDocumentsCount, setWordDocumentsCount] = useState(0)

  const [open, setOpen] = useState(false)

  useEffect(() => {
    let querySub: any

    if (collection && srs && !review) {
      const query = collection
        .find(
          srs === 'srs'
            ? {
                selector: {
                  dueDate: {
                    $lte: new Date().toISOString().split('T')[0]
                  }
                }
              }
            : undefined
        )
        .sort({ [sortOption]: isAscending ? 1 : -1 })
        .skip(wordDocumentsOffset)
        .limit(Number(showWords))

      querySub = (query.$.subscribe as any)(
        (results: WordDocType[] | undefined) => {
          console.log(results)

          if (results) {
            // 1. Update all documents count
            collection.count().exec().then(setWordDocumentsCount)

            // 2. Update documents
            setWordDocuments(results)
          }
        }
      )
    }

    return () => querySub?.unsubscribe()
  }, [
    collection,
    sortOption,
    isAscending,
    showWords,
    wordDocumentsOffset,
    review,
    srs
  ])

  const deleteWord = async (id: string) => {
    await deleteCard({ collection, id })
  }

  const goToNextPage = () => {
    const count = wordDocumentsOffset + Number(showWords)

    if (count <= wordDocumentsCount) {
      setWordDocumentsOffset(count)
    }
  }

  const goToPreviousPage = () => {
    const count = wordDocumentsOffset - Number(showWords)

    if (count >= 0) {
      setWordDocumentsOffset(count)
    }
  }

  // REVIEW PAGE
  if (review && wordDocuments?.length) {
    return <Review wordDocuments={wordDocuments} srs={srs} />
  }

  // VOCABULARY PAGE
  return (
    <>
      {/* Tabs, add & review */}
      <div className="border-b border-white border-opacity-20 flex items-center justify-between">
        <div className="flex items-center">
          <div className="py-3 relative">
            <Link
              href="/vocabulary/all/"
              className="inline-flex items-center h-7 rounded px-2"
            >
              All
            </Link>

            {router.asPath === '/vocabulary/all' && (
              <div className="absolute border-b-2 border-white border-opacity-80 px-2 left-2 right-2 bottom-0"></div>
            )}
          </div>
          <div className="py-3 relative">
            <Link
              href="/vocabulary/srs/"
              className="inline-flex items-center h-7 rounded px-2"
            >
              Due for SRS
            </Link>
            {router.asPath === '/vocabulary/srs' && (
              <div className="absolute border-b-2 border-white border-opacity-80 px-2 left-2 right-2 bottom-0"></div>
            )}
          </div>
        </div>

        <div className="flex items-center space-x-2">
          {/* Add word */}
          <Dialog.Root open={open} onOpenChange={setOpen}>
            <Dialog.Trigger className="inline-flex items-center space-x-2">
              <PlusIcon className="w- h-5" />
              <span>Add</span>
            </Dialog.Trigger>
            <Dialog.Portal>
              <Dialog.Content className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-md grid gap-4 bg-[rgb(32,32,32)] p-6 mt-5 rounded-xl shadow-md">
                <AddCard close={() => setOpen(false)} />
              </Dialog.Content>
            </Dialog.Portal>
          </Dialog.Root>
          <Link
            href={`${srs}/review`}
            className="flex items-center text-white bg-[rgb(35,131,226)] px-3 rounded-[3px] h-8 space-x-2"
          >
            <ArchiveIcon className="w-4 h-4" />
            <span>Review</span>
            <span className="text-xs py-1 px-1.5 bg-black/10 rounded">
              {wordDocuments?.length || '0'}
            </span>
          </Link>
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

      {wordDocuments?.length === 0 && <div>No data</div>}

      {/* Vocab list */}
      {wordDocuments?.length !== 0 && (
        <>
          {/* <div className="flex flex-col space-y-2 border-y border-white border-opacity-20 divide-y divide-white divide-opacity-20"> */}
          <div className="flex flex-col space-y-2">
            <div className="grid grid-cols-[1fr_1fr_100px_50px] gap-2 px-2">
              <div>Word</div>
              <div>Meaning</div>
              <div>Status</div>
            </div>
            {wordDocuments &&
              wordDocuments.map((doc) => (
                <div
                  key={doc.id}
                  // className="grid grid-cols-[1fr_1fr_100px_50px] gap-2 px-2 py-4"
                  className="grid grid-cols-[1fr_1fr_100px_50px] gap-2 px-2 py-4 border border-white/20 rounded-lg items-center"
                >
                  <div className="text-lg">{doc.word}</div>
                  <div className="text-sm">{doc.meaning}</div>
                  <div>
                    {REVIEW_STATUS.filter(
                      (el) => el.status === doc.reviewStatus?.toString()
                    ).map((el) => (
                      <div
                        key={el.label}
                        className={`inline-flex items-center space-x-1 h-5 rounded-full px-2 text-xs ${el.bg}`}
                      >
                        <div
                          className={`mr-1.5 rounded-full h-2 w-2 ${el.color}`}
                        ></div>
                        <span>{el.label}</span>
                      </div>
                    ))}
                  </div>
                  <div>
                    <MoreOptionsMenu deleteWord={deleteWord} doc={doc} />
                  </div>
                </div>
              ))}
          </div>

          {/* Pagination */}
          <div className="flex items-center justify-between">
            <div>{`Showing ${wordDocumentsOffset + 1}-${
              wordDocumentsOffset + (wordDocuments?.length || 0)
            } of ${wordDocumentsCount} Entries`}</div>
            <div className="inline-flex items-center space-x-2">
              <button onClick={goToPreviousPage}>Prev page</button>
              <button onClick={goToNextPage}>Next page</button>
            </div>
          </div>
        </>
      )}
    </>
  )
}
