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

  useEffect(() => {
    const query = decksCollection?.find()
    const querySub = (query?.$.subscribe as any)((docs: DeckDocument[]) => {
      setDecks(docs)
    })

    return () => querySub?.unsubscribe()
  }, [decksCollection])

  const addNewDeck = async () => {
    await decksCollection?.insert({
      id: nanoid(8),
      name: 'New Deck'
    })
  }

  return (
    <div
      className={`w-[240px] pt-7 bg-[rgb(25,25,25)] border-r border-white/20 ${
        open ? '' : 'hidden'
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
            {decks &&
              decks.map(({ id, name }) => (
                <Link
                  key={id}
                  href={`/vocabulary/${id}`}
                  className="p-1.5 h-9 flex items-center space-x-2 rounded-[5px] hover:bg-white/5"
                >
                  <span className="w-5 h-5 flex items-center justify-center">
                    <StackIcon />
                  </span>
                  <span className="text-sm leading-4">{name}</span>
                </Link>
              ))}
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
