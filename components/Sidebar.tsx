import { useState, useEffect } from 'react'
import Link from 'next/link'
import { useRxCollection } from 'rxdb-hooks'
import {
  MagnifyingGlassIcon,
  ArchiveIcon,
  ClockIcon,
  PlusIcon,
  StackIcon
} from '@radix-ui/react-icons'
import { nanoid } from 'nanoid'
import { DeckDocument } from '../lib/types'
import { Reorder } from 'framer-motion'

const NAV_LINKS = [
  {
    label: 'Dictionary',
    url: '/dictionary',
    icon: <MagnifyingGlassIcon />
  },
  {
    label: 'Vocabulary',
    url: '/vocabulary/all',
    icon: <ArchiveIcon />
  },
  {
    label: 'Due for Review',
    url: '/vocabulary/srs',
    icon: <ClockIcon />
  }
]

export default function Sidebar({ open }: { open: boolean }) {
  const decksCollection = useRxCollection('decks')

  const [decks, setDecks] = useState<DeckDocument[]>()
  const [order, setOrder] = useState()

  useEffect(() => {
    const query = decksCollection?.find()
    const querySub = (query?.$.subscribe as any)((docs: DeckDocument[]) => {
      setDecks(docs)
      setOrder(docs.sort((a, b) => a.order - b.order).map((x) => x.id))
    })

    return () => querySub?.unsubscribe()
  }, [decksCollection])

  const addNewDeck = async () => {
    await decksCollection?.insert({
      id: nanoid(8),
      name: 'New Deck'
    })
  }

  const reorder = async (newOrder) => {
    decks?.forEach(async (x) => {
      await x.update({
        $set: {
          order: newOrder.indexOf(x.id)
        }
      })
    })
  }

  return (
    <div
      className={`fixed top-0 left-0 z-20 w-[240px] h-screen pt-7 bg-[rgb(25,25,25)] border-r border-white/20 transition ${
        open ? 'translate-x-0' : '-translate-x-full'
      }`}
    >
      <div className="flex flex-col gap-4 px-4">
        <div>
          {NAV_LINKS.map(({ label, url, icon }) => (
            <Link
              key={url}
              href={url}
              className="p-1.5 h-9 flex items-center space-x-2 rounded-[5px] hover:bg-white/5"
            >
              <span className="w-5 h-5 flex items-center justify-center">
                {icon}
              </span>
              <span className="text-sm leading-4">{label}</span>
            </Link>
          ))}
        </div>
        <div>
          <div>
            {decks && order && (
              <Reorder.Group axis="y" values={order} onReorder={reorder}>
                {order.map((item) => (
                  <Reorder.Item key={item} value={item}>
                    <Link
                      href={`/vocabulary/${item}`}
                      onPointerDownCapture={(e) => e.preventDefault()}
                      className="p-1.5 h-9 flex items-center space-x-2 rounded-[5px] hover:bg-white/5"
                    >
                      <span className="w-5 h-5 flex items-center justify-center">
                        <StackIcon />
                      </span>
                      <span className="text-sm leading-4">
                        {decks.find((x) => x.id === item)?.name}
                      </span>
                    </Link>
                  </Reorder.Item>
                ))}
              </Reorder.Group>
            )}
            <button
              onClick={addNewDeck}
              className="w-full p-1.5 h-9 flex items-center space-x-2 rounded-[5px] hover:bg-white/5"
            >
              <PlusIcon />
              <span className="text-sm leading-4">New Deck</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
