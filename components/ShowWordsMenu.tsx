import * as DropdownMenu from '@radix-ui/react-dropdown-menu'
import { ChevronDownIcon } from '@radix-ui/react-icons'
import theme from '../lib/theme'

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
        className={theme.menu.triggerButton}
      >
        <span>{`Show: ${wordsNumber}`}</span>
        <ChevronDownIcon className="w-4 h-4" />
      </DropdownMenu.Trigger>

      <DropdownMenu.Portal>
        <DropdownMenu.Content
          align="start"
          sideOffset={5}
          className={`${theme.menu.content} w-[230px]`}
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
                className={theme.menu.menuItem({
                  active: wordsNumber === option
                })}
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
