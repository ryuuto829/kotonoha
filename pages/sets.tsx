import { useMemo, useState } from 'react'
import Link from 'next/link'
import { nanoid } from 'nanoid'
import * as DropdownMenu from '@radix-ui/react-dropdown-menu'
import { ChevronDownIcon, PlusIcon } from '@radix-ui/react-icons'
import { useRxQuery, useRxDB } from '../lib/rxdb-hooks'
import { AppDatabase, DeckDocument } from '../lib/types'
import {
  isThisMonth,
  isThisWeek,
  isThisYear,
  isToday,
  parseISO
} from 'date-fns'
import { groupBy } from 'lodash'

const SORT_OPTIONS = ['Recent', 'Created', 'Alphabetical']

export function SortMenu({
  sort,
  changeSort
}: {
  sort: string
  changeSort: (x: string) => void
}) {
  return (
    <DropdownMenu.Root modal={false}>
      <DropdownMenu.Trigger
        aria-label="More options"
        className="inline-flex items-center gap-2 rounded-lg h-10 py-2 px-4 bg-[#303136]"
      >
        <span>{sort}</span>
        <ChevronDownIcon className="w-4 h-4" />
      </DropdownMenu.Trigger>
      <DropdownMenu.Portal>
        <DropdownMenu.Content
          align="start"
          sideOffset={5}
          className="py-1.5 z-50 w-[210px] rounded-md bg-[#303136] border border-white/10 text-sm"
        >
          <DropdownMenu.RadioGroup value={sort} onValueChange={changeSort}>
            {SORT_OPTIONS.map((sortValue) => (
              <DropdownMenu.RadioItem
                key={sortValue}
                value={sortValue}
                className="flex items-center gap-2.5 mx-1.5 px-1.5 w-full h-8 max-w-[calc(100%-12px)] rounded hover:bg-white/5 outline-none"
              >
                <span>{sortValue}</span>
              </DropdownMenu.RadioItem>
            ))}
          </DropdownMenu.RadioGroup>
        </DropdownMenu.Content>
      </DropdownMenu.Portal>
    </DropdownMenu.Root>
  )
}

export default function Sets() {
  const db = useRxDB<AppDatabase>()
  const decksQuery = useMemo(() => db.decks?.find(), [db.decks])
  const { data: decks } = useRxQuery<DeckDocument>(decksQuery)
  const [sort, setSort] = useState('Recent')

  const addNewSet = async () => {
    await db.decks?.insert({
      id: nanoid(8),
      name: 'New Deck',
      terms: 0,
      createdAt: new Date().toISOString(),
      lastStudiedAt: ''
    })
  }

  const group = groupBy(decks, ({ createdAt }) => {
    const created = parseISO(createdAt)

    switch (true) {
      case isToday(created):
        return 'today'
      case isThisWeek(created):
        return 'this week'
      case isThisMonth(created):
        return 'this month'
      case isThisYear(created):
        return 'this year'
      default:
        return 'over 1 year'
    }
  })

  return (
    <div className="flex flex-col gap-4">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold">Study sets</h1>
        <button
          className="inline-flex items-center gap-2 rounded-lg h-10 py-2 px-4 bg-[#303136]"
          onClick={addNewSet}
        >
          <PlusIcon className="w-4 h-4" />
          <span>Add set</span>
        </button>
      </div>

      <div>
        <SortMenu sort={sort} changeSort={setSort} />
      </div>

      <div className="flex flex-col gap-3">
        {['today', 'this week', 'this month', 'this year', 'over 1 year'].map(
          (title) => {
            if (!group[title] || group[title].length === 0) return null

            return (
              <div key={title} className="flex flex-col gap-5">
                <div className="inline-flex items-center gap-3">
                  <h3 className="uppercase text-sm font-bold">{title}</h3>
                  <hr className="flex-1 h-[1px] bg-white/10 border-none" />
                </div>
                {group[title]?.map(({ id, terms, name }) => (
                  <Link
                    key={id}
                    href={`/sets/${id}`}
                    className="px-5 py-3 bg-[#303136] flex flex-col rounded-md border-2 border-transparent hover:border-[#9da2ff] transition-colors"
                  >
                    <span className="text-sm">{`${terms || 0} Terms`}</span>
                    <span className="text-xl font-bold">{name}</span>
                  </Link>
                ))}
              </div>
            )
          }
        )}
      </div>
    </div>
  )
}
