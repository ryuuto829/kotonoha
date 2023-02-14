import * as DropdownMenu from '@radix-ui/react-dropdown-menu'
import * as Switch from '@radix-ui/react-switch'

import { ChevronDownIcon } from '@radix-ui/react-icons'
import ArrowsUpDownIcon from '@heroicons/react/24/outline/ArrowsUpDownIcon'
import CalendarDaysIcon from '@heroicons/react/24/outline/CalendarDaysIcon'
import HashtagIcon from '@heroicons/react/24/outline/HashtagIcon'

const SORTING_OPTIONS = [
  {
    value: 'createdAt',
    label: 'Date created',
    icon: <CalendarDaysIcon />
  },
  {
    value: 'word',
    label: 'Alphabetical',
    icon: <HashtagIcon />
  }
]

export default function SortingMenu({
  isAscending,
  sortOption,
  changeAscending,
  changeSortOption
}: {
  isAscending: boolean
  sortOption: string
  changeAscending: (value: boolean) => void
  changeSortOption: (value: string) => void
}) {
  return (
    <DropdownMenu.Root modal={false}>
      <DropdownMenu.Trigger
        aria-label="Sorting options"
        className="inline-flex items-center space-x-2 p-1.5 text-base h-7 rounded-[3px] whitespace-nowrap hover:bg-white hover:bg-opacity-5 data-[state=open]:bg-white data-[state=open]:bg-opacity-5"
      >
        <ArrowsUpDownIcon className="w-4 h-4" />
        <span>Sort</span>
        <ChevronDownIcon className="w-4 h-4" />
      </DropdownMenu.Trigger>

      <DropdownMenu.Portal>
        <DropdownMenu.Content
          align="start"
          sideOffset={5}
          className={`py-2 rounded bg-[rgb(37,37,37)] text-sm text-white text-opacity-80 w-[230px]`}
        >
          <form className="flex items-center justify-between mx-1 rounded-[3px] h-7 hover:bg-white hover:bg-opacity-10 cursor-pointer">
            <label
              htmlFor="ascending-mode"
              className="ml-2.5 mr-1 flex-1 cursor-pointer"
            >
              Ascending
            </label>
            <Switch.Root
              id="ascending-mode"
              checked={isAscending}
              onCheckedChange={changeAscending}
              className="box-content relative ml-1.5 mr-3 p-0.5 w-[26px] h-[14px] rounded-full shadow-sm bg-[rgba(202,204,206,0.3)] data-[state=checked]:bg-[rgb(35,131,226)]"
            >
              <Switch.Thumb className="block w-3.5 h-3.5 bg-white rounded-full shadow-sm translate-x-0 data-[state=checked]:translate-x-[12px]" />
            </Switch.Root>
          </form>

          <DropdownMenu.Separator className="my-2 h-[1px] bg-white bg-opacity-20" />

          <DropdownMenu.RadioGroup
            value={sortOption}
            onValueChange={changeSortOption}
          >
            {SORTING_OPTIONS.map(({ value, icon, label }) => (
              <DropdownMenu.RadioItem
                key={value}
                value={value}
                className={`flex items-center mx-1 rounded-[3px] h-7 hover:bg-white hover:bg-opacity-10 cursor-pointer ${
                  sortOption === value ? 'text-blue-300' : ''
                }`}
              >
                <div className="ml-2.5 mr-1 flex items-center justify-center w-4 h-4">
                  {icon}
                </div>
                <div className="ml-1.5 mr-3 flex-1">{label}</div>
              </DropdownMenu.RadioItem>
            ))}
          </DropdownMenu.RadioGroup>
        </DropdownMenu.Content>
      </DropdownMenu.Portal>
    </DropdownMenu.Root>
  )
}
