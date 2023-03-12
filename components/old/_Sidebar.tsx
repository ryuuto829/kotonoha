import { useState, useEffect, useMemo } from 'react'
import { useRouter } from 'next/router'
import Link from 'next/link'
import { nanoid } from 'nanoid'
import { debounce } from 'lodash'
import { formatISO } from 'date-fns'
import { Reorder } from 'framer-motion'
import * as ScrollArea from '@radix-ui/react-scroll-area'
import {
  MagnifyingGlassIcon,
  ArchiveIcon,
  ClockIcon,
  PlusIcon,
  StackIcon
} from '@radix-ui/react-icons'
import { useRxQuery, useRxDB } from '../../lib/rxdb-hooks'
import { CardDocument, AppDatabase, DeckDocument } from '../../lib/types'
import Tooltip from '../Tooltip'

const NAV_LINKS = [
  {
    label: 'Dictionary',
    url: '/dictionary',
    icon: <MagnifyingGlassIcon />,
    description: 'Search word in dictionary'
  },
  {
    label: 'Vocabulary',
    url: '/vocabulary/all',
    icon: <ArchiveIcon />,
    description: 'All cards'
  },
  {
    label: 'Due for Review',
    url: '/vocabulary/srs',
    icon: <ClockIcon />,
    description: 'Cards due for review',
    hasCount: true
  }
]

export default function Sidebar({ open }: { open: boolean }) {
  const router = useRouter()
  const db = useRxDB<AppDatabase>()

  const decksQuery = useMemo(() => db.decks?.find(), [db.decks])
  const cardsQuery = useMemo(
    () =>
      db.cards?.find({
        selector: {
          srsDueDate: {
            $lte: formatISO(new Date(), { representation: 'date' }),
            $ne: null
          }
        }
      }),
    [db.cards]
  )

  const { data: decks } = useRxQuery<DeckDocument[]>(decksQuery)
  const { data: cards } = useRxQuery<CardDocument>(cardsQuery)
  const [order, setOrder] = useState<string[] | undefined>()

  useEffect(() => {
    setOrder(decks?.sort((a, b) => a.order - b.order).map((x) => x.id))
  }, [decks])

  const addNewDeck = async () => {
    const today = new Date().toISOString()
    await db.decks?.insert({
      id: nanoid(8),
      name: 'New Deck',
      order: order?.length || 0,
      terms: 0,
      createdAt: today,
      lastReviewed: ''
    })
  }

  const updateDeckOrder = debounce(() => {
    decks?.forEach(async (doc) => {
      await doc.update({
        $set: {
          order: order?.indexOf(doc.id)
        }
      })
    })
  }, 500)

  return (
    <div
      className={`fixed left-0 z-20 w-[var(--sidebar-width)] h-[calc(100vh-var(--navbar-heigth))] pt-7 bg-[var(--app-background-color)] transition shadow-[rgb(255,255,255,0.09)_-1px_0px_0px_0px_inset] select-none ${
        open ? 'translate-x-0' : '-translate-x-full'
      }`}
    >
      <div
        role="navigation"
        aria-label="Main navigation"
        className="flex flex-col gap-4 h-full"
      >
        {/* Main links */}
        <div aria-label="Main links" className="px-2">
          {NAV_LINKS.map(({ label, url, icon, description, hasCount }) => (
            <Tooltip key={url} content={description} side="right">
              <Link
                href={url}
                className={`p-1.5 h-9 w-full flex items-center space-x-2 rounded-[5px] hover:bg-white/10 transition-colors ${
                  router.asPath === url ? 'bg-white/10' : ''
                }`}
              >
                <span className="w-5 h-5 flex items-center justify-center">
                  {icon}
                </span>
                <span className="text-sm leading-4 flex-1">{label}</span>

                {hasCount && (
                  <span
                    className={`text-sm text-white/50 font-bold h-5 w-5 text-center ${
                      cards.length === 0 ? 'invisible' : ''
                    }`}
                  >
                    {cards.length}
                  </span>
                )}
              </Link>
            </Tooltip>
          ))}
        </div>

        {/* Decks */}
        <ScrollArea.Root
          type="scroll"
          aria-label="Decks"
          className="overflow-hidden px-2 flex-1"
        >
          <ScrollArea.Viewport className="h-full">
            {decks && order && (
              <Reorder.Group axis="y" values={order} onReorder={setOrder}>
                {order.map((deckId) => (
                  <Reorder.Item
                    key={deckId}
                    value={deckId}
                    onDragEnd={updateDeckOrder}
                  >
                    <Link
                      href={`/vocabulary/${deckId}`}
                      onPointerDownCapture={(e) => e.preventDefault()}
                      className={`p-1.5 h-9 w-full flex items-center space-x-2 rounded-[5px] hover:bg-white/10 transition-colors ${
                        router.asPath === `/vocabulary/${deckId}`
                          ? 'bg-white/10'
                          : ''
                      }`}
                    >
                      <span className="w-5 h-5 flex items-center justify-center">
                        <StackIcon />
                      </span>
                      <span className="flex-1 text-sm leading-4">
                        {decks.find((x) => x.id === deckId)?.name}
                      </span>
                      <span className="self-end invisible">menu</span>
                    </Link>
                  </Reorder.Item>
                ))}
              </Reorder.Group>
            )}
          </ScrollArea.Viewport>
          <ScrollArea.Scrollbar
            className="flex select-none touch-none p-0.5 bg-transparent w-2.5"
            orientation="vertical"
          >
            <ScrollArea.Thumb className="flex-1 bg-white/10 rounded-[10px]" />
          </ScrollArea.Scrollbar>
        </ScrollArea.Root>

        {/* New Deck */}
        <button
          onClick={addNewDeck}
          className="flex items-center space-x-2 px-3.5 rounded-[5px] text-white/50 font-bold hover:bg-white/10 h-11 shadow-[rgb(255,255,255,0.09)_0px_-1px_0px] transition-colors"
        >
          <PlusIcon />
          <span className="text-sm leading-4">New Deck</span>
        </button>
      </div>
    </div>
  )
}
