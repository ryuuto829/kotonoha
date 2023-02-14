import * as DropdownMenu from '@radix-ui/react-dropdown-menu'
import { ChevronDownIcon } from '@radix-ui/react-icons'

const WORDS_LIMIT_OPTIONS = ['25', '50', '75', '100', '150', '200']

export default function ShowWordsMenu({
  wordsNumber,
  changeOffset,
  changeWordsNumber
}: {
  wordsNumber: string
  changeOffset: (value: number) => void
  changeWordsNumber: (value: string) => void
}) {
  return (
    <DropdownMenu.Root modal={false}>
      <DropdownMenu.Trigger
        aria-label="Show words"
        className="inline-flex items-center space-x-2 p-1.5 text-base h-7 rounded-[3px] whitespace-nowrap hover:bg-white hover:bg-opacity-5 data-[state=open]:bg-white data-[state=open]:bg-opacity-5"
      >
        <span>{`Show: ${wordsNumber}`}</span>
        <ChevronDownIcon className="w-4 h-4" />
      </DropdownMenu.Trigger>

      <DropdownMenu.Portal>
        <DropdownMenu.Content
          align="start"
          sideOffset={5}
          className={`py-2 rounded bg-[rgb(37,37,37)] text-sm text-white text-opacity-80 w-[230px]`}
        >
          <DropdownMenu.RadioGroup
            value={wordsNumber}
            onValueChange={(value) => {
              changeOffset(0)
              changeWordsNumber(value)
            }}
          >
            {WORDS_LIMIT_OPTIONS.map((option) => (
              <DropdownMenu.RadioItem
                key={option}
                value={option}
                className={`flex items-center mx-1 rounded-[3px] h-7 hover:bg-white hover:bg-opacity-10 cursor-pointer ${
                  wordsNumber === option ? 'text-blue-300' : ''
                }`}
              >
                <div className="ml-1.5 mr-3 flex-1">{option}</div>
              </DropdownMenu.RadioItem>
            ))}
          </DropdownMenu.RadioGroup>
        </DropdownMenu.Content>
      </DropdownMenu.Portal>
    </DropdownMenu.Root>
  )
}
