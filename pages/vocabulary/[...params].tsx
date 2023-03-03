import { useState, useEffect } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/router'
import { useRxCollection } from 'rxdb-hooks'
import {
  PlusIcon,
  ArchiveIcon,
  MagnifyingGlassIcon,
  ChevronLeftIcon,
  ChevronRightIcon
} from '@radix-ui/react-icons'

import { CardDocument } from '../../lib/types'
import MoreOptionsMenu from '../../components/MoreOptionsMenu'
import EditDialog from '../../components/CardEditor'
import { REVIEW_STATUS } from '../../components/StatusMenu'
import Review from '../../components/Review'
import FilterMenu from '../../components/FilterMenu'

export default function Vocabulary() {
  const router = useRouter()
  const collection = useRxCollection<CardDocument>('cards')

  // const [srs, review] = router.query?.params || []
  const [srs, review] = router.asPath.split('/').slice(2)

  const [wordDocuments, setWordDocuments] = useState<CardDocument[] | null>(
    null
  )

  const [cards, setCards] = useState('25')
  const [sort, setSort] = useState('createdAt')
  const [status, setStatus] = useState(['1', '2', '3', '4', '5'])
  const [ascending, setAscending] = useState(false)

  const [search, setSearch] = useState('')

  const [wordDocumentsOffset, setWordDocumentsOffset] = useState(0)
  const [wordDocumentsCount, setWordDocumentsCount] = useState(0)

  useEffect(() => {
    let querySub: any

    if (collection && srs) {
      const query = collection
        .find(
          srs === 'all' || srs === 'srs'
            ? {
                selector: {
                  srsDueDate: {
                    $or: [
                      {
                        srsDueDate: {
                          $lte:
                            srs === 'srs' &&
                            new Date().toISOString().split('T')[0],
                          $ne: ''
                        }
                      },
                      { srsDueDate: { $gte: srs !== 'srs' && '' } }
                    ]
                  },
                  status: {
                    $in: status.map((x) => Number(x))
                  },
                  word: {
                    $regex: search !== null ? new RegExp(`^${search}`) : ''
                  }
                }
              }
            : {
                selector: {
                  deckId: srs
                }
              }
        )
        .sort({ [sort]: ascending ? 1 : -1 })
        .skip(wordDocumentsOffset)
        .limit(Number(cards))

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
    cards,
    ascending,
    sort,
    wordDocumentsOffset,
    review,
    status,
    search,
    srs
  ])

  const deleteWord = async (id: string) => {
    await collection?.findOne(id).remove()
  }

  const goToNextPage = () => {
    const count = wordDocumentsOffset + Number(cards)

    if (count <= wordDocumentsCount) {
      setWordDocumentsOffset(count)
    }
  }

  const goToPreviousPage = () => {
    const count = wordDocumentsOffset - Number(cards)

    if (count >= 0) {
      setWordDocumentsOffset(count)
    }
  }

  // REVIEW PAGE
  if (review === 'review' && wordDocuments?.length) {
    return <Review cards={wordDocuments} srs={srs} />
  }

  // VOCABULARY PAGE
  return (
    <>
      <section className="flex flex-col space-y-2">
        {/* Toggle & review */}
        <div className="flex space-x-4 items-center justify-between">
          <div className="flex space-x-2 items-center justify-between">
            {[
              {
                url: '/vocabulary/all/',
                active: srs === 'all',
                label: 'All'
              },
              {
                url: '/vocabulary/srs/',
                active: srs === 'srs',
                label: 'Due for Review'
              }
            ].map(({ url, active, label }) => (
              <Link
                key={url}
                href={url}
                className={`inline-flex items-center rounded-lg h-8 bg-white/5 px-4 ${
                  active ? 'bg-white/60 text-black/80' : ''
                }`}
              >
                {label}
              </Link>
            ))}
          </div>

          <div className="flex items-center space-x-2">
            <EditDialog modal={true}>
              <button className="inline-flex items-center space-x-2 bg-white/5 rounded h-8 px-2">
                <PlusIcon className="w-5 h-5" />
                <span>Add</span>
              </button>
            </EditDialog>
            <Link
              href={`${srs}/review`}
              className="flex items-center text-white bg-[rgb(35,131,226)] px-3 rounded-[3px] h-8 space-x-2"
            >
              <ArchiveIcon className="w-4 h-4" />
              <span>Review</span>
            </Link>
          </div>
        </div>

        {/* Search & view */}
        <div className="border-b border-white/20 flex items-center justify-between py-4 space-x-4">
          {/* Search */}
          <div className="relative w-full">
            <input
              type="sumbit"
              value={search}
              placeholder="Search"
              className="bg-transparent border border-white/40 rounded-2xl h-[30px] w-full pl-8"
              onInput={(e) => setSearch(e.currentTarget.value)}
            />
            <div className="absolute top-0 left-0 h-[30px] w-[30px] flex items-center justify-center">
              <MagnifyingGlassIcon className="w-5 h-5" />
            </div>
          </div>

          <div className="flex items-center space-x-2 justify-end">
            {/* Pagination */}
            <div className="flex items-center border border-white/40 rounded h-7 divide-x-2 divide-white/20">
              <button
                onClick={goToPreviousPage}
                className="h-7 px-1.5 disabled:text-white/20"
                disabled={wordDocumentsOffset === 0}
              >
                <ChevronLeftIcon className="w-4 h-4" />
              </button>
              <button
                onClick={goToNextPage}
                className="h-7 px-1.5 disabled:text-white/20"
                disabled={
                  wordDocumentsOffset + Number(cards) >= wordDocumentsCount
                }
              >
                <ChevronRightIcon className="w-4 h-4" />
              </button>
            </div>

            {/* View */}
            <FilterMenu
              cards={cards}
              sort={sort}
              status={status}
              ascending={ascending}
              changeCards={(value) => {
                setCards(value)
                setWordDocumentsOffset(0)
              }}
              changeSort={setSort}
              changeStatus={setStatus}
              changeAscending={setAscending}
            />
          </div>
        </div>
      </section>

      {wordDocuments?.length === 0 && <div>No data</div>}

      {/* Vocab list */}
      {wordDocuments?.length !== 0 && (
        <>
          <div className="flex flex-col rounded-lg divide-y-[1px] divide-white/20 ">
            <div className="grid items-center grid-cols-[1fr_1fr_100px_50px] gap-2 px-2 h-8">
              <div>{`Word (${wordDocuments?.length || 0})`}</div>
              <div>Meaning</div>
              <div>Status</div>
            </div>

            {wordDocuments &&
              wordDocuments.map((doc) => (
                <div
                  key={doc.id}
                  className="grid grid-cols-[1fr_1fr_100px_50px] gap-2 px-2 py-4 items-center whitespace-pre-wrap"
                >
                  <div className="text-lg">{doc.word}</div>
                  <div className="text-sm">{doc.meaning}</div>
                  <div>
                    {REVIEW_STATUS.filter(
                      (el) => el.status === doc.status?.toString()
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
        </>
      )}
    </>
  )
}
