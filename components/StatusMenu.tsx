import * as DropdownMenu from '@radix-ui/react-dropdown-menu'
import { ChevronDownIcon, CheckIcon } from '@radix-ui/react-icons'

export const REVIEW_STATUS = [
  {
    status: '1',
    label: 'NEW',
    color: 'bg-[rgb(46,124,209)]',
    bg: 'bg-[rgb(40,69,108)]'
  },
  {
    status: '2',
    label: '3 DAYS',
    color: 'bg-[rgb(155,155,155)]',
    bg: 'bg-[rgb(55,55,55)]'
  },
  {
    status: '3',
    label: '7 DAYS',
    color: 'bg-[rgb(155,155,155)]',
    bg: 'bg-[rgb(55,55,55)]'
  },
  {
    status: '4',
    label: '15 DAYS',
    color: 'bg-[rgb(155,155,155)]',
    bg: 'bg-[rgb(55,55,55)]'
  },
  {
    status: '5',
    label: 'KNOWN',
    color: 'bg-[rgb(45,153,100)]',
    bg: 'bg-[rgb(43,89,63)]'
  }
]

export default function StatusMenu({
  statusOption,
  changeStatus
}: {
  statusOption: number
  changeStatus: (value: number) => void
}) {
  return (
    <DropdownMenu.Root modal={false}>
      <DropdownMenu.Trigger
        aria-label="Sorting options"
        className="inline-flex items-center space-x-2 p-1.5 text-base h-7 rounded-[3px] whitespace-nowrap hover:bg-white hover:bg-opacity-5 data-[state=open]:bg-white data-[state=open]:bg-opacity-5"
      >
        <div
          className={`mr-1.5 rounded-full h-2 w-2 ${
            REVIEW_STATUS[statusOption - 1].color
          }`}
        ></div>
        <span>{REVIEW_STATUS[statusOption - 1].label}</span>
        <ChevronDownIcon className="w-4 h-4" />
      </DropdownMenu.Trigger>

      <DropdownMenu.Portal>
        <DropdownMenu.Content
          align="start"
          sideOffset={5}
          className={`py-2 rounded bg-[rgb(37,37,37)] text-sm text-white text-opacity-80 w-[230px] z-50`}
        >
          <DropdownMenu.RadioGroup
            value={statusOption.toString()}
            onValueChange={(value) => changeStatus(Number(value))}
          >
            {REVIEW_STATUS.map(({ status, label, color }) => (
              <DropdownMenu.RadioItem
                key={status}
                value={status}
                className="flex items-center mx-1 rounded-[3px] h-7 hover:bg-white hover:bg-opacity-10 cursor-pointer"
              >
                <div className="ml-2.5 mr-1 flex items-center justify-center w-4 h-4">
                  <div className={`mr-1.5 rounded-full h-2 w-2 ${color}`}></div>
                </div>
                <div className="ml-1.5 mr-3 flex-1">{label}</div>
                <CheckIcon
                  className={`w-4 h-4 mr-2.5 ${
                    statusOption === Number(status) ? '' : 'hidden'
                  }`}
                />
              </DropdownMenu.RadioItem>
            ))}
          </DropdownMenu.RadioGroup>
        </DropdownMenu.Content>
      </DropdownMenu.Portal>
    </DropdownMenu.Root>
  )
}
