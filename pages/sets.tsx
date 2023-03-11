import { FormEvent, useMemo, useState } from 'react'
import Link from 'next/link'
import { nanoid } from 'nanoid'
import * as DropdownMenu from '@radix-ui/react-dropdown-menu'
import * as Dialog from '@radix-ui/react-dialog'
import { ChevronDownIcon, Cross1Icon, PlusIcon } from '@radix-ui/react-icons'
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
import * as Form from '@radix-ui/react-form'

const SORT_OPTIONS = [
  { name: 'Recent', value: 'lastStudiedAt', order: 'desc' },
  { name: 'Created', value: 'createdAt', order: 'desc' },
  { name: 'Alphabetical', value: 'name', order: 'asc' }
]

function AddSetModal() {
  const db = useRxDB<AppDatabase>()
  const [open, setOpen] = useState(false)

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()

    const today = new Date().toISOString()
    const { name = 'New Deck', description } = Object.fromEntries(
      new FormData(event.currentTarget)
    ) as { [x: string]: string | undefined }

    await db.decks?.insert({
      id: nanoid(8),
      name,
      description,
      terms: 0,
      createdAt: today,
      lastStudiedAt: today
    })

    setOpen(false)
  }

  return (
    <Dialog.Root open={open} onOpenChange={setOpen}>
      <Dialog.Trigger className="inline-flex items-center gap-2 rounded-lg h-10 py-2 px-4 bg-[#303136]">
        <PlusIcon className="w-4 h-4" />
        <span>Add set</span>
      </Dialog.Trigger>
      <Dialog.Portal>
        <Dialog.Overlay className="fixed inset-0 overflow-y-auto z-50 flex items-start justify-center">
          <Dialog.Content className="flex flex-col gap-5 w-full max-w-[550px] my-14 bg-[#303136] p-6 rounded-xl shadow-md border border-white/20">
            {/* Header */}
            <header className="flex items-center justify-between">
              <Dialog.Title className="text-2xl font-bold">
                Create a new study set
              </Dialog.Title>
              <Dialog.Trigger>
                <Cross1Icon className="w-5 h-5" />
              </Dialog.Trigger>
            </header>
            {/* Form */}
            <Form.Root onSubmit={handleSubmit} className="flex flex-col gap-4">
              <Form.Field name="name">
                <Form.Label className="sr-only">Set title</Form.Label>
                <Form.Control asChild>
                  <input
                    className="w-full bg-[#202124] inline-flex h-[35px] appearance-none items-center justify-center rounded px-4 text-[15px] leading-none shadow-[0_0_0_1px_transparent] outline-none hover:shadow-[0_0_0_1px_#9da2ff] focus:shadow-[0_0_0_2px_#9da2ff] transition-colors placeholder:text-white/50"
                    type="text"
                    placeholder="Enter set name"
                    required
                  />
                </Form.Control>
              </Form.Field>
              <Form.Field name="description">
                <Form.Label className="sr-only">Set description</Form.Label>
                <Form.Control asChild>
                  <input
                    className="w-full bg-[#202124] inline-flex h-[35px] appearance-none items-center justify-center rounded px-4 text-[15px] leading-none shadow-[0_0_0_1px_transparent] outline-none hover:shadow-[0_0_0_1px_#9da2ff] focus:shadow-[0_0_0_2px_#9da2ff] transition-colors placeholder:text-white/50"
                    type="text"
                    placeholder="Enter a description (optional)"
                  />
                </Form.Control>
              </Form.Field>
              <Form.Submit className="self-end inline-flex items-center gap-2 rounded-lg h-10 py-2 px-4 bg-white/10">
                Submit
              </Form.Submit>
            </Form.Root>
          </Dialog.Content>
        </Dialog.Overlay>
      </Dialog.Portal>
    </Dialog.Root>
  )
}

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
        <span>{SORT_OPTIONS.find((x) => x.value === sort)?.name}</span>
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
                key={sortValue.value}
                value={sortValue.value}
                className="flex items-center gap-2.5 mx-1.5 px-1.5 w-full h-8 max-w-[calc(100%-12px)] rounded hover:bg-white/5 outline-none"
              >
                <span>{sortValue.name}</span>
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
  const [sort, setSort] = useState('createdAt')
  const decksQuery = useMemo(
    () =>
      db.decks?.find({
        sort: [
          {
            [sort]:
              (SORT_OPTIONS.find((x) => x.value === sort)?.order as
                | 'asc'
                | 'desc') || 'desc'
          }
        ]
      }),
    [db.decks, sort]
  )
  const { data: decks } = useRxQuery<DeckDocument>(decksQuery)

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
    <div className="flex flex-col gap-8">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold">Study sets</h1>
        <AddSetModal />
      </div>
      <div>
        <SortMenu sort={sort} changeSort={setSort} />
      </div>
      <div className="flex flex-col gap-3">
        {sort !== 'name' &&
          ['today', 'this week', 'this month', 'this year', 'over 1 year'].map(
            (title) => {
              if (!group[title] || group[title].length === 0) return null

              return (
                <div key={title} className="flex flex-col gap-3">
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

        {sort === 'name' && (
          <>
            {decks?.map(({ id, terms, name }) => (
              <Link
                key={id}
                href={`/sets/${id}`}
                className="px-5 py-3 bg-[#303136] flex flex-col rounded-md border-2 border-transparent hover:border-[#9da2ff] transition-colors"
              >
                <span className="text-sm">{`${terms || 0} Terms`}</span>
                <span className="text-xl font-bold">{name}</span>
              </Link>
            ))}
          </>
        )}
      </div>
    </div>
  )
}
