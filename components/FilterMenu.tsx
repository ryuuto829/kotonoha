import * as DropdownMenu from '@radix-ui/react-dropdown-menu'
import * as Switch from '@radix-ui/react-switch'
import { useState } from 'react'
import {
  CheckIcon,
  ChevronRightIcon,
  MixerHorizontalIcon,
  ArrowDownIcon,
  CalendarIcon,
  LetterCaseCapitalizeIcon,
  BookmarkIcon,
  ClockIcon,
  TextAlignTopIcon
} from '@radix-ui/react-icons'

import ArrowsUpDownIcon from '@heroicons/react/24/outline/ArrowsUpDownIcon'

const SORT_OPTIONS = [
  {
    label: 'Date created',
    value: 'createdAt',
    icon: <CalendarIcon className="w-4 h-4" />
  },
  {
    label: 'Alphabetical',
    value: 'word',
    icon: <LetterCaseCapitalizeIcon className="w-4 h-4" />
  },
  {
    label: 'Last updated',
    value: 'updatedAt',
    icon: <ClockIcon className="w-4 h-4" />
  },
  {
    label: 'Status',
    value: 'status',
    icon: <BookmarkIcon className="w-4 h-4" />
  },
  {
    label: 'Last reviewed',
    value: 'lastReviewed',
    icon: <CalendarIcon className="w-4 h-4" />
  }
]

const STATUS_OPTIONS = [
  {
    value: '1',
    label: 'New',
    color: 'bg-[rgb(46,124,209)]',
    bg: 'bg-[rgb(40,69,108)]'
  },
  {
    value: '2',
    label: '3 days',
    color: 'bg-[rgb(155,155,155)]',
    bg: 'bg-[rgb(55,55,55)]'
  },
  {
    value: '3',
    label: '7 days',
    color: 'bg-[rgb(155,155,155)]',
    bg: 'bg-[rgb(55,55,55)]'
  },
  {
    value: '4',
    label: '15 days',
    color: 'bg-[rgb(155,155,155)]',
    bg: 'bg-[rgb(55,55,55)]'
  },
  {
    value: '5',
    label: 'Known',
    color: 'bg-[rgb(45,153,100)]',
    bg: 'bg-[rgb(43,89,63)]'
  }
]

export default function FilterMenu({
  cards,
  sort,
  status,
  ascending,
  changeCards,
  changeSort,
  changeStatus,
  changeAscending
}: {
  cards: string
  sort: string
  status: string[]
  ascending: boolean
  changeCards: (x: string) => void
  changeSort: (x: string) => void
  changeStatus: (x: string[]) => void
  changeAscending: (x: boolean) => void
}) {
  const [openLimit, setOpenLimit] = useState(true)
  const [openSort, setOpenSort] = useState(true)
  const [openStatus, setOpenStatus] = useState(true)

  return (
    <DropdownMenu.Root modal={false}>
      <DropdownMenu.Trigger asChild>
        <button
          className="h-[35px] inline-flex items-center justify-center space-x-2 outline-none hover:bg-white/5 rounded px-2"
          aria-label="Customise options"
        >
          <MixerHorizontalIcon className="w-5 h-5" />
          <span>View</span>
        </button>
      </DropdownMenu.Trigger>

      {/* Main menu */}
      <DropdownMenu.Portal>
        <DropdownMenu.Content
          className="min-w-[250px] bg-[#282828] text-white/80 text-sm rounded-md py-1 bAscending bAscending-black/40 shadow-sm"
          sideOffset={5}
        >
          {/* Ascending item */}
          <DropdownMenu.Item
            className="h-8 flex items-center space-x-2.5 rounded-[5px] mx-1 px-1.5 hover:bg-white/5"
            onSelect={(e) => {
              e.preventDefault()
              changeAscending(!ascending)
            }}
          >
            <TextAlignTopIcon className="w-5 h-5" />
            <div className="flex items-center justify-between flex-1">
              <span>Ascending</span>
              <Switch.Root
                id="ascending-mode"
                checked={ascending}
                onCheckedChange={changeAscending}
                className="box-content relative p-0.5 w-[26px] h-[14px] rounded-full shadow-sm bg-[rgba(202,204,206,0.3)] data-[state=checked]:bg-[rgb(35,131,226)]"
              >
                <Switch.Thumb className="block w-3.5 h-3.5 bg-white rounded-full shadow-sm translate-x-0 data-[state=checked]:translate-x-[12px]" />
              </Switch.Root>
            </div>
          </DropdownMenu.Item>

          <DropdownMenu.Separator className="h-[1px] bg-white/10 my-1.5" />

          {/* Sort submenu */}
          <DropdownMenu.Sub open={openSort} onOpenChange={setOpenSort}>
            <DropdownMenu.SubTrigger className="h-8 flex items-center space-x-2.5 rounded-[5px] mx-1 px-1.5 hover:bg-white/5">
              <ArrowsUpDownIcon className="w-5 h-5" />
              <div className="flex items-center justify-between flex-1">
                <span>Sort</span>
                <span className="flex items-center text-white/40">
                  <span>
                    {SORT_OPTIONS.find((x) => x.value === sort)?.label}
                  </span>
                  <ChevronRightIcon className="w-5 h-5" />
                </span>
              </div>
            </DropdownMenu.SubTrigger>
            <DropdownMenu.Portal>
              <DropdownMenu.SubContent
                className="min-w-[220px] bg-[#282828] bAscending bAscending-black/50 shadow-sm text-white/80 text-sm rounded-md py-1"
                sideOffset={2}
                alignOffset={-5}
              >
                <DropdownMenu.RadioGroup
                  value={sort}
                  onValueChange={changeSort}
                >
                  {SORT_OPTIONS.map((option) => (
                    <DropdownMenu.RadioItem
                      key={option.value}
                      value={option.value}
                      onSelect={(e) => {
                        e.preventDefault()
                        setOpenSort(false)
                      }}
                      className="h-8 flex items-center justify-between space-x-2.5 rounded-[5px] mx-1 px-1.5 hover:bg-white/5"
                    >
                      <span className="flex items-center space-x-2">
                        {option.icon}
                        <span>{option.label}</span>
                      </span>
                      <DropdownMenu.ItemIndicator className="inline-flex items-center justify-center">
                        <CheckIcon className="w-5 h-5" />
                      </DropdownMenu.ItemIndicator>
                    </DropdownMenu.RadioItem>
                  ))}
                </DropdownMenu.RadioGroup>
              </DropdownMenu.SubContent>
            </DropdownMenu.Portal>
          </DropdownMenu.Sub>

          {/* Status submenu */}
          <DropdownMenu.Sub open={openStatus} onOpenChange={setOpenStatus}>
            <DropdownMenu.SubTrigger className="h-8 flex items-center space-x-2.5 rounded-[5px] mx-1 px-1.5 hover:bg-white/5">
              <BookmarkIcon className="w-5 h-5" />
              <div className="flex items-center justify-between flex-1">
                <span>Status</span>
                <span className="flex items-center text-white/40">
                  <span>{`${status.length} shown`}</span>
                  <ChevronRightIcon className="w-5 h-5" />
                </span>
              </div>
            </DropdownMenu.SubTrigger>
            <DropdownMenu.Portal>
              <DropdownMenu.SubContent
                className="min-w-[220px] bg-[#282828] bAscending bAscending-black/50 shadow-sm text-white/80 text-sm rounded-md py-1"
                sideOffset={2}
                alignOffset={-5}
              >
                {STATUS_OPTIONS.map((option) => (
                  <DropdownMenu.CheckboxItem
                    key={option.value}
                    className="h-8 flex items-center justify-between space-x-2.5 rounded-[5px] mx-1 px-1.5 hover:bg-white/5"
                    checked={status.includes(option.value)}
                    onCheckedChange={() =>
                      changeStatus(
                        status.includes(option.value)
                          ? status.length > 1
                            ? status.filter((x) => x !== option.value)
                            : status
                          : [...status, option.value]
                      )
                    }
                    onSelect={(e) => e.preventDefault()}
                  >
                    <div className="flex items-center">
                      <div className="ml-2.5 mr-1 flex items-center justify-center w-4 h-4">
                        <div
                          className={`mr-1.5 rounded-full h-2 w-2 ${option.color}`}
                        ></div>
                      </div>
                      {option.label}
                    </div>
                    <DropdownMenu.ItemIndicator className="inline-flex items-center justify-center">
                      <CheckIcon className="w-5 h-5" />
                    </DropdownMenu.ItemIndicator>
                  </DropdownMenu.CheckboxItem>
                ))}
              </DropdownMenu.SubContent>
            </DropdownMenu.Portal>
          </DropdownMenu.Sub>

          <DropdownMenu.Separator className="h-[1px] bg-white/10 my-1.5" />

          {/* Load limit submenu */}
          <DropdownMenu.Sub open={openLimit} onOpenChange={setOpenLimit}>
            <DropdownMenu.SubTrigger className="h-8 flex items-center space-x-2.5 rounded-[5px] mx-1 px-1.5 hover:bg-white/5">
              <ArrowDownIcon className="w-5 h-5" />
              <div className="flex items-center justify-between flex-1">
                <span>Load limit</span>
                <span className="flex items-center text-white/40">
                  <span>{`${cards} cards`}</span>
                  <ChevronRightIcon className="w-5 h-5" />
                </span>
              </div>
            </DropdownMenu.SubTrigger>
            <DropdownMenu.Portal>
              <DropdownMenu.SubContent
                className="min-w-[220px] bg-[#282828] bAscending bAscending-black/50 shadow-sm text-white/80 text-sm rounded-md py-1"
                sideOffset={2}
                alignOffset={-5}
              >
                <DropdownMenu.RadioGroup
                  value={cards}
                  onValueChange={changeCards}
                >
                  {['10', '25', '50', '75', '100'].map((option) => (
                    <DropdownMenu.RadioItem
                      key={option}
                      value={option}
                      onSelect={(e) => {
                        e.preventDefault()
                        setOpenLimit(false)
                      }}
                      className="h-8 flex items-center justify-between space-x-2.5 rounded-[5px] mx-1 px-1.5 hover:bg-white/5"
                    >
                      {option + ' cards'}
                      <DropdownMenu.ItemIndicator className="inline-flex items-center justify-center">
                        <CheckIcon className="w-5 h-5" />
                      </DropdownMenu.ItemIndicator>
                    </DropdownMenu.RadioItem>
                  ))}
                </DropdownMenu.RadioGroup>
              </DropdownMenu.SubContent>
            </DropdownMenu.Portal>
          </DropdownMenu.Sub>
        </DropdownMenu.Content>
      </DropdownMenu.Portal>
    </DropdownMenu.Root>
  )
}
