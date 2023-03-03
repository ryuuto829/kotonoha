import * as DropdownMenu from '@radix-ui/react-dropdown-menu'
import { ChevronDownIcon, CheckIcon } from '@radix-ui/react-icons'
import { useEffect, useState } from 'react'
import { useRxCollection } from 'rxdb-hooks'
import { DeckDocument } from '../lib/types'

export default function SelectDeckMenu({
  option,
  changeOption
}: {
  option: string
  changeOption: (x: string) => void
}) {
  const decksCollection = useRxCollection('decks')
  const [decks, setDecks] = useState<DeckDocument[]>()

  const getDecks = async () => {
    const decks = await decksCollection?.find().exec()
    setDecks(decks as DeckDocument[])
  }

  useEffect(() => {
    getDecks()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [decksCollection])

  return (
    <DropdownMenu.Root modal={false}>
      <DropdownMenu.Trigger
        aria-label="Sorting options"
        className="inline-flex items-center space-x-2 p-1.5 text-base h-7 rounded-[3px] whitespace-nowrap hover:bg-white hover:bg-opacity-5 data-[state=open]:bg-white data-[state=open]:bg-opacity-5"
      >
        <div className={`mr-1.5 rounded-full h-2 w-2`}></div>
        <span>
          {decks?.find((x) => x.id === option)?.name || 'default deck'}
        </span>
        <ChevronDownIcon className="w-4 h-4" />
      </DropdownMenu.Trigger>

      <DropdownMenu.Portal>
        <DropdownMenu.Content
          align="start"
          sideOffset={5}
          className={`py-2 rounded bg-[rgb(37,37,37)] text-sm text-white text-opacity-80 w-[230px] z-50`}
        >
          <DropdownMenu.RadioGroup value={option} onValueChange={changeOption}>
            {decks &&
              decks.map(({ id, name }) => (
                <DropdownMenu.RadioItem
                  key={id}
                  value={id}
                  className="flex items-center mx-1 rounded-[3px] h-7 hover:bg-white hover:bg-opacity-10 cursor-pointer"
                >
                  <div className="ml-2.5 mr-1 flex items-center justify-center w-4 h-4">
                    <div className={`mr-1.5 rounded-full h-2 w-2`}></div>
                  </div>
                  <div className="ml-1.5 mr-3 flex-1">{name}</div>
                  <CheckIcon
                    className={`w-4 h-4 mr-2.5 ${
                      id === option ? '' : 'hidden'
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
