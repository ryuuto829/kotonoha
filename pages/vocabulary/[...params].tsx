import { useState, useEffect } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/router'
import { useRxCollection } from 'rxdb-hooks'
import {
  PlusIcon,
  ArchiveIcon,
  MagnifyingGlassIcon,
  ArrowRightIcon,
  ReloadIcon,
  Cross1Icon,
  CheckIcon,
  ArrowDownIcon
} from '@radix-ui/react-icons'
import * as Progress from '@radix-ui/react-progress'

import AddWordDialog from '../../components/AddWordDialog'
import { REVIEW_STATUS } from '../../components/AddWordDialog'

import SortingMenu from '../../components/SortingMenu'
import ShowWordsMenu from '../../components/ShowWordsMenu'
import MoreOptionsMenu from '../../components/MoreOptionsMenu'

import { updateDueDate } from '../../utils'

const DEFAULT_REVIEW_INTERVALS = [1, 3, 7, 15]

export default function Vocabulary() {
  const router = useRouter()
  const wordsCollection = useRxCollection('words')

  const [srs, review] = router.query?.params || []

  const [wordDocuments, setWordDocuments] = useState()
  const [showWords, setShowWords] = useState('25')
  const [sortOption, setSortOption] = useState('createdAt')
  const [isAscending, setIsAscending] = useState(false)
  const [wordDocumentsOffset, setWordDocumentsOffset] = useState(0)
  const [wordDocumentsCount, setWordDocumentsCount] = useState(0)

  const [progress, setProgress] = useState(0)
  const [documentIndexes, setDocumentIndexes] = useState()
  const [showCardBack, setShowCardBack] = useState(false)

  useEffect(() => {
    let querySub: any

    if (wordsCollection && srs && !review) {
      const query = wordsCollection
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

      querySub = query.$.subscribe((results) => {
        console.log(results)

        if (results) {
          // 1. Update all documents count
          wordsCollection.count().exec().then(setWordDocumentsCount)

          // 2. Set document indexes for reviews
          setDocumentIndexes([...Array.from(Array(results.length).keys())])

          // 3. Update documents
          setWordDocuments(results)
        }
      })
    }

    return () => querySub?.unsubscribe()
  }, [
    wordsCollection,
    sortOption,
    isAscending,
    showWords,
    wordDocumentsOffset,
    review,
    srs
  ])

  const deleteWord = async (id) => {
    const wordDocument = wordsCollection?.findOne(id)

    await wordDocument?.remove()
    console.log('DatabaseService: delete doc')
  }

  const skipCard = () => {
    setShowCardBack(false)
    setProgress(progress + 1)
  }

  const flipCard = () => {
    setShowCardBack(true)
  }

  const reviewCardAgain = () => {
    if (!documentIndexes) return

    const indexes = [...documentIndexes]

    // push to the end of the stack
    const [currentIndex] = indexes.splice(progress, 1)
    indexes.push(currentIndex)

    setDocumentIndexes(indexes)
    setShowCardBack(false)
  }

  const forgetCard = async () => {
    // db: update dueDate
    if (!wordDocuments || !documentIndexes) return

    const doc = wordDocuments[documentIndexes[progress]]
    const today = new Date().toISOString()

    await doc.update({
      $set: {
        lastReviewedAt: today,
        dueDate: updateDueDate(
          doc.reviewStatus,
          today,
          DEFAULT_REVIEW_INTERVALS
        )
      }
    })

    setShowCardBack(false)
    setProgress(progress + 1)
  }

  const rememberCard = async () => {
    if (!wordDocuments || !documentIndexes) return

    // db: update dueDate and status
    const doc = wordDocuments[documentIndexes[progress]]
    const today = new Date().toISOString()

    if (srs === 'all') {
      await doc.update({
        $set: {
          lastReviewedAt: today
        }
      })
    }

    if (srs === 'srs') {
      const newStatus = doc.reviewStatus < 5 && doc.reviewStatus + 1

      await doc.update({
        $set: {
          lastReviewedAt: today,
          dueDate: newStatus
            ? updateDueDate(newStatus, today, DEFAULT_REVIEW_INTERVALS)
            : null,
          reviewStatus: newStatus || doc.reviewStatus
        }
      })
    }

    setShowCardBack(false)
    setProgress(progress + 1)

    console.log('DatabaseService: update remebered card')
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
  if (review && documentIndexes?.length) {
    return (
      <div className="relative h-full">
        <div className="flex items-center justify-end">{`${progress} / ${documentIndexes.length}`}</div>
        <Progress.Root
          className="relative overflow-hidden bg-black rounded-full w-full h-2"
          value={progress}
          max={documentIndexes.length || 0}
        >
          <Progress.Indicator
            className="bg-white w-full h-full transition"
            style={{
              transform: `translateX(-${
                100 - (100 / documentIndexes.length) * progress
              }%)`
            }}
          />
        </Progress.Root>

        {progress < documentIndexes.length && documentIndexes && (
          <div className="h-full flex flex-col items-center gap-5">
            <div className="h-[calc((100vh-600px)*.3)]"></div>
            <div className="text-lg p-7">
              {wordDocuments[documentIndexes[progress]].word}
            </div>
            {!showCardBack && (
              <button
                className="inline-flex items-center space-x-2"
                onClick={flipCard}
              >
                <ArrowDownIcon className="w-5 h-5" />
                <span>Show meaning</span>
              </button>
            )}
            <div className={`p-7 ${showCardBack ? '' : 'invisible'}`}>
              {wordDocuments[documentIndexes[progress]].meaning}
            </div>
          </div>
        )}

        {progress === documentIndexes.length && (
          <>
            <div>No more cards left.</div>
            <Link href="/vocabulary/all">Back to vocab</Link>
          </>
        )}

        {progress !== documentIndexes.length && (
          <div className="flex items-center absolute bottom-0 w-full h-9">
            <div className="flex items-center space-x-2 z-20">
              <button
                className="inline-flex items-center space-x-2"
                onClick={skipCard}
              >
                <span>Skip</span>
                <ArrowRightIcon className="w-5 h-5" />
              </button>
              <button
                className="inline-flex items-center space-x-2"
                onClick={reviewCardAgain}
              >
                <span>Again</span>
                <ReloadIcon className="w-5 h-5" />
              </button>
            </div>

            <div className="flex justify-center w-full -ml-[135px] space-x-4">
              {srs === 'srs' && (
                <button
                  className="inline-flex items-center space-x-2 rounded-full h-9 px-4 bg-white/10 text-[#f1f1f1]"
                  onClick={forgetCard}
                >
                  <Cross1Icon className="w-5 h-5" />
                  <span>Forgot</span>
                </button>
              )}
              <button
                className="inline-flex items-center space-x-2 rounded-full h-9 px-4 bg-[#f1f1f1] text-[#0f0f0f]"
                onClick={rememberCard}
              >
                <CheckIcon className="w-5 h-5" />
                <span>Remembered</span>
              </button>
            </div>
          </div>
        )}
      </div>
    )
  }
  // END OF REVIEW PAGE

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
          <AddWordDialog>
            <button className="flex items-center text-white border border-white border-opacity-20 px-3 rounded-[3px] h-8 space-x-2">
              <PlusIcon className="w-4 h-4" />
              <span>Add word</span>
            </button>
          </AddWordDialog>
          <Link
            href={`${srs}/review`}
            className="flex items-center text-white bg-[rgb(35,131,226)] px-3 rounded-[3px] h-8 space-x-2"
          >
            <ArchiveIcon className="w-4 h-4" />
            <span>Review</span>
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

      {/* Vocab list */}
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

      {/* Pagination */}
      <div>
        <button onClick={goToPreviousPage}>Prev page</button>
        <button onClick={goToNextPage}>Next page</button>
        <div>{`Showing ${wordDocumentsOffset + 1}-${
          wordDocumentsOffset + (wordDocuments?.length || 0)
        } of ${wordDocumentsCount} Entries`}</div>
      </div>
    </>
  )
}
