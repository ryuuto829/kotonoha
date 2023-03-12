import { useState, useEffect } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/router'
import { useRxCollection } from 'rxdb-hooks'
import {
  DotsHorizontalIcon,
  LayersIcon,
  DashboardIcon,
  Pencil2Icon
} from '@radix-ui/react-icons'
import { CardDocument, DeckDocument } from '../../lib/types'
import MoreOptionsMenu from '../../components/MoreOptionsMenu'
import Review from '../../components/Review'
import FilterMenu from '../../components/FilterMenu'
import * as Collapsible from '@radix-ui/react-collapsible'
import Editor from '../../components/Editor'

function Card({ doc }) {
  const [open, setOpen] = useState(false)

  return (
    <Collapsible.Root open={open} onOpenChange={setOpen}>
      {!open && (
        <div
          key={doc.id}
          className="flex items-center rounded-md h-14 bg-[#303136] p-4 whitespace-pre-wrap"
        >
          <div className="flex-1 grid grid-cols-[1fr_2fr] divide-x divide-white/40">
            <div className="pr-8">{doc.word || ' '}</div>
            <div className="px-8">{doc.meaning || ' '}</div>
          </div>
          <div>
            <Collapsible.Trigger className="h-8 w-8 inline-flex items-center justify-center rounded hover:bg-white/5 transition-colors">
              <Pencil2Icon className="w-4 h-4" />
            </Collapsible.Trigger>
            <MoreOptionsMenu doc={doc} edit={() => setOpen(true)} />
          </div>
        </div>
      )}
      <Collapsible.Content asChild>
        <Editor close={() => setOpen(false)} card={doc} />
      </Collapsible.Content>
    </Collapsible.Root>
  )
}

export default function Vocabulary() {
  const router = useRouter()
  const collection = useRxCollection<CardDocument>('cards')
  const decksCollection = useRxCollection('decks')

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

  const [deck, setDeck] = useState<DeckDocument>()
  const [deckName, setDeckName] = useState('')

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

          if (results && !review) {
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

  useEffect(() => {
    const query = decksCollection?.findOne(srs)
    const querySub = (query?.$.subscribe as any)((doc: DeckDocument) => {
      setDeck(doc)
      setDeckName(doc?.name)
    })

    return () => querySub?.unsubscribe()
  }, [decksCollection, srs])

  // const deleteWord = async (id: string) => {
  //   await collection?.findOne(id).remove()
  // }

  // const goToNextPage = () => {
  //   const count = wordDocumentsOffset + Number(cards)

  //   if (count <= wordDocumentsCount) {
  //     setWordDocumentsOffset(count)
  //   }
  // }

  // const goToPreviousPage = () => {
  //   const count = wordDocumentsOffset - Number(cards)

  //   if (count >= 0) {
  //     setWordDocumentsOffset(count)
  //   }
  // }

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
          <h1 className="text-3xl font-bold">{deckName || 'All'}</h1>
          <div className="flex items-center space-x-2">
            {[
              {
                name: 'Flashcards',
                url: '/vocabulary?study=flashcards',
                Icon: LayersIcon
              },
              {
                name: 'Match',
                url: '/vocabulary?study=match',
                Icon: DashboardIcon
              }
            ].map(({ name, url, Icon }) => (
              <Link
                key={name}
                href={url}
                className="inline-flex items-center gap-2 rounded-lg h-10 py-2 px-4 bg-[#303136]"
              >
                <Icon className="w-4 h-4" />
                <span>{name}</span>
              </Link>
            ))}
            <Link
              href="#"
              className="h-8 w-8 inline-flex items-center justify-center rounded hover:bg-white/5 transition-colors"
            >
              <DotsHorizontalIcon className="w-5 h-5" />
            </Link>
          </div>
        </div>
        <p>Description</p>

        {/* Search & view */}
        <div className="flex items-center justify-between space-x-4">
          <h2 className="text-xl font-bold">
            {'Terms in this set (' + (wordDocuments?.length || 0) + ')'}
          </h2>

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

          {/* Search */}
          {/* <div className="relative w-full">
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
          </div> */}

          {/* <div className="flex items-center space-x-2 justify-end"> */}
          {/* Pagination */}
          {/* <div className="flex items-center border border-white/40 rounded h-7 divide-x-2 divide-white/20">
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
            </div> */}
          {/* View */}

          {/* <DeckMenu deck={deck} /> */}
          {/* </div> */}
        </div>
        {wordDocuments?.length === 0 && <div>No data</div>}

        {/* Terms */}
        {wordDocuments && wordDocuments?.length !== 0 && (
          <div className="flex flex-col gap-3">
            {wordDocuments.map((doc) => (
              // <div
              //   key={doc.id}
              //   className="flex items-center rounded-md h-14 bg-[#303136] p-4 whitespace-pre-wrap"
              // >
              //   <div className="flex-1 grid grid-cols-[1fr_2fr] divide-x divide-white/40">
              //     <div className="pr-8">{doc.word || ' '}</div>
              //     <div className="px-8">{doc.meaning || ' '}</div>
              //   </div>
              //   <div>
              //     <MoreOptionsMenu doc={doc} />
              //   </div>
              // </div>
              <Card key={doc.id} doc={doc} />
            ))}
          </div>
        )}
      </section>
    </>
  )
}
