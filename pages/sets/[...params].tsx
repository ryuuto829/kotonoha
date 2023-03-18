import { useState, useMemo } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/router'
import { formatISO } from 'date-fns'
import * as DropdownMenu from '@radix-ui/react-dropdown-menu'
import * as Collapsible from '@radix-ui/react-collapsible'
import {
  DotsHorizontalIcon,
  LayersIcon,
  DashboardIcon,
  Pencil2Icon,
  TrashIcon,
  CounterClockwiseClockIcon
} from '@radix-ui/react-icons'
import Review from '../../components/Review'
import SetModal from '../../components/SetModal'
import TermCard from '../../components/TermCard'
import Editor from '../../components/Editor'
import FilterMenu from '../../components/FilterMenu'
import { useRxDB, useRxQuery } from '../../lib/rxdb-hooks'
import { AppDatabase, CardDocument, DeckDocument } from '../../lib/types'

export function SetMenu({ set }: { set: DeckDocument }) {
  const router = useRouter()

  const deleteSet = async () => {
    await set.remove()
    router.push('/sets')
  }

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
          <button
            onClick={deleteSet}
            className="flex items-center gap-2.5 mx-1.5 px-1.5 w-full h-8 max-w-[calc(100%-12px)] rounded hover:bg-white/5 outline-none"
          >
            <TrashIcon className="w-4 h-4" />
            <span>Delete</span>
          </button>
        </DropdownMenu.Content>
      </DropdownMenu.Portal>
    </DropdownMenu.Root>
  )
}

export default function Vocabulary() {
  const db = useRxDB<AppDatabase>()
  const router = useRouter()
  const deckId = router.query?.params?.toString()
  const study = router.query?.study?.toString() as
    | 'flashcards'
    | 'match'
    | 'srs'
    | undefined

  const today = formatISO(new Date(), { representation: 'date' })

  const decksQuery = useMemo(
    () => db.decks?.findOne(deckId),
    [db.decks, deckId]
  )

  const { data: deck } = useRxQuery<DeckDocument>(decksQuery)

  const [openEditor, setOpenEditor] = useState(false)

  // const [cards, setCards] = useState('25')
  const [sort, setSort] = useState('createdAt')
  const [status, setStatus] = useState(['1', '2', '3', '4', '5'])
  const [ascending, setAscending] = useState(false)
  // const [search, setSearch] = useState('')

  const cardsQuery = useMemo(() => {
    return db.cards
      .find(
        // srs === 'all' || srs === 'srs'
        // ? {
        // selector: {
        //   srsDueDate: {
        //     $or: [
        //       {
        //         srsDueDate: {
        //           $lte:
        //             srs === 'srs' &&
        //             new Date().toISOString().split('T')[0],
        //           $ne: ''
        //         }
        //       },
        //       { srsDueDate: { $gte: srs !== 'srs' && '' } }
        //     ]
        //   },
        //   status: {
        //     $in: status.map((x) => Number(x))
        //   }
        // word: {
        //   $regex: search !== null ? new RegExp(`^${search}`) : ''
        // }
        // }
        // }
        // : {
        {
          selector: {
            deckId: deckId
          }
        }
        // }
      )
      .sort({ [sort]: ascending ? 'asc' : 'desc' })
  }, [db.cards, ascending, sort, deckId])
  const { data: cards } = useRxQuery<CardDocument[]>(cardsQuery)

  // REVIEW PAGE
  if (study && cards) {
    return (
      <Review
        cards={cards?.filter((x) =>
          study === 'srs' ? x.srsDueDate <= today : true
        )}
        study={study}
      />
    )
  }

  if (!deck && !cards) {
    return <div>Loading ...</div>
  }

  // VOCABULARY PAGE
  return (
    <section className="flex flex-col gap-3">
      {/* Toggle & review */}
      <div className="flex space-x-4 items-center justify-between">
        <h1 className="text-3xl font-bold">{deck?.name || 'All'}</h1>
        <div className="flex items-center space-x-2">
          <SetMenu set={deck} />
        </div>
      </div>
      <p className={`${deck?.description ? '' : 'hidden'}`}>
        {deck?.description}
      </p>
      <div className="grid grid-cols-3 gap-4">
        {[
          {
            name: 'Flashcards',
            url: `${router.asPath}?study=flashcards`,
            Icon: LayersIcon
          },
          {
            name: 'Match',
            url: `${router.asPath}?study=match`,
            Icon: DashboardIcon
          },
          {
            name: 'Learn',
            url: `${router.asPath}?study=srs`,
            Icon: CounterClockwiseClockIcon,
            count: cards?.filter((x) => x.srsDueDate <= today).length || 0
          }
        ].map(({ name, url, Icon, count }) => {
          if (count === 0) return null

          return (
            <Link
              key={name}
              href={url}
              className="inline-flex items-center gap-2 rounded-lg h-10 py-2 px-4 bg-[#303136]"
            >
              <Icon className="w-4 h-4" />
              <span>{`${name} ${count ? '(' + count + ')' : ''}`}</span>
            </Link>
          )
        })}
      </div>
      {/* Search & view */}
      <div className="flex items-center justify-between gap-3">
        <h2 className="text-xl font-bold">
          {'Terms in this set (' + (cards?.length || 0) + ')'}
        </h2>

        <FilterMenu
          // cards={cards}
          sort={sort}
          status={status}
          ascending={ascending}
          // changeCards={(value) => {
          //   setCards(value)
          //   setWordDocumentsOffset(0)
          // }}
          changeSort={setSort}
          changeStatus={setStatus}
          changeAscending={setAscending}
        />
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
  )
}
