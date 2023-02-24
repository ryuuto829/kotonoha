import { useState, useEffect } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/router'
import { useRxCollection } from 'rxdb-hooks'
import {
  PlusIcon,
  ArchiveIcon,
  MagnifyingGlassIcon
} from '@radix-ui/react-icons'

import { WordDocType } from '../../lib/types'
import MoreOptionsMenu from '../../components/MoreOptionsMenu'
import EditDialog from '../../components/EditDialog'
import { REVIEW_STATUS } from '../../components/StatusMenu'
import Review from '../../components/Review'
import {
  deleteCard,
  _formatCardContent,
  _calculateDueDate
} from '../../lib/words'
import FilterMenu from '../../components/FilterMenu'
import TableSearch from '../../components/TableSearch'

export default function Vocabulary() {
  const router = useRouter()
  const collection = useRxCollection<WordDocType>('cards')

  const [srs, review] = router.query?.params || []

  const [wordDocuments, setWordDocuments] = useState<WordDocType[] | null>(null)

  const [cards, setCards] = useState('25')
  const [sort, setSort] = useState('createdAt')
  const [status, setStatus] = useState(['1', '2', '3', '4', '5'])
  const [ascending, setAscending] = useState(false)

  const [search, setSearch] = useState('')

  const [wordDocumentsOffset, setWordDocumentsOffset] = useState(0)
  const [wordDocumentsCount, setWordDocumentsCount] = useState(0)

  useEffect(() => {
    let querySub: any

    if (collection && srs && !review) {
      const query = collection
        .find({
          selector: {
            srsDueDate: {
              $or: [
                {
                  srsDueDate: {
                    $lte:
                      srs === 'srs' && new Date().toISOString().split('T')[0],
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
        })
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
    await deleteCard({ collection, id })
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
          <EditDialog modal={true}>
            <button className="inline-flex items-center space-x-2">
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
            <span className="text-xs py-1 px-1.5 bg-black/10 rounded">
              {wordDocuments?.length || '0'}
            </span>
          </Link>

          {/* Sort, filter & search */}
          <TableSearch input={search} changeInput={setSearch} />

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
