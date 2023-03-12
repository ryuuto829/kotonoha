import { useState, useMemo } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/router'
import {
  DotsHorizontalIcon,
  LayersIcon,
  DashboardIcon,
  Pencil2Icon
} from '@radix-ui/react-icons'
import { AppDatabase, CardDocument, DeckDocument } from '../../lib/types'
import Review from '../../components/Review'
import * as DropdownMenu from '@radix-ui/react-dropdown-menu'

import SetModal from '../../components/SetModal'
import { useRxDB, useRxQuery } from '../../lib/rxdb-hooks'
import TermCard from '../../components/TermCard'
import Editor from '../../components/Editor'
import * as Collapsible from '@radix-ui/react-collapsible'

export function SetMenu({ set }: {}) {
  return (
    <DropdownMenu.Root modal={false}>
      <DropdownMenu.Trigger
        aria-label="More options"
        className="h-8 w-8 inline-flex items-center justify-center rounded hover:bg-white/5 transition-colors"
      >
        <DotsHorizontalIcon className="w-5 h-5" />
      </DropdownMenu.Trigger>
      <DropdownMenu.Portal>
        <DropdownMenu.Content
          align="start"
          sideOffset={5}
          className="py-1.5 z-50 w-[210px] rounded-md bg-[#303136] border border-white/10 text-sm"
        >
          <SetModal setDocument={set}>
            <button className="flex items-center gap-2.5 mx-1.5 px-1.5 w-full h-8 max-w-[calc(100%-12px)] rounded hover:bg-white/5 outline-none">
              <Pencil2Icon className="w-4 h-4" />
              <span>Edit</span>
            </button>
          </SetModal>
        </DropdownMenu.Content>
      </DropdownMenu.Portal>
    </DropdownMenu.Root>
  )
}

export default function Vocabulary() {
  const db = useRxDB<AppDatabase>()
  const router = useRouter()
  const [srs, review] = router.asPath.split('/').slice(2)

  const decksQuery = useMemo(() => db.decks?.findOne(srs), [db.decks, srs])
  const { data: deck } = useRxQuery<DeckDocument>(decksQuery)

  const [openEditor, setOpenEditor] = useState(false)

  // const [cards, setCards] = useState('25')
  const [sort, setSort] = useState('createdAt')
  const [status, setStatus] = useState(['1', '2', '3', '4', '5'])
  const [ascending, setAscending] = useState(false)
  const [search, setSearch] = useState('')

  const cardsQuery = useMemo(() => {
    return db.cards
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
      .sort({ [sort]: ascending ? 'asc' : 'desc' })
  }, [db.cards, ascending, sort, status, search, srs])
  const { data: cards } = useRxQuery<CardDocument[]>(cardsQuery)

  // REVIEW PAGE
  if (review === 'review' && cards?.length) {
    return <Review cards={cards} srs={srs} />
  }

  // VOCABULARY PAGE
  return (
    <>
      <section className="flex flex-col gap-3">
        {/* Toggle & review */}
        <div className="flex space-x-4 items-center justify-between">
          <h1 className="text-3xl font-bold">{deck?.name || 'All'}</h1>
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

            <SetMenu set={deck} />
          </div>
        </div>
        <p>Description</p>

        {/* Search & view */}
        <div className="flex items-center justify-between gap-3">
          <h2 className="text-xl font-bold">
            {'Terms in this set (' + (cards?.length || 0) + ')'}
          </h2>

          {/* <FilterMenu
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
          /> */}

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
        {/* Empty */}
        {cards?.length === 0 && <div>No data</div>}
        {/* Terms */}
        {cards && deck && cards?.length !== 0 && (
          <div className="flex flex-col gap-3">
            {cards.map((doc) => (
              <TermCard key={doc.id} card={doc} deck={deck} />
            ))}
          </div>
        )}
        {/* Create card */}
        <Collapsible.Root
          open={openEditor}
          onOpenChange={setOpenEditor}
          className="flex items-center justify-center"
        >
          <Collapsible.Trigger
            className={`inline-flex items-center gap-2 rounded-lg h-10 py-2 px-4 bg-[#303136] ${
              openEditor ? 'hidden' : ''
            }`}
          >
            Add a new term
          </Collapsible.Trigger>
          <Collapsible.Content className="w-full">
            <Editor close={() => setOpenEditor(false)} deck={deck} />
          </Collapsible.Content>
        </Collapsible.Root>
      </section>
    </>
  )
}
