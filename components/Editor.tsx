import { useRef, useState, useEffect } from 'react'
import {
  _calculateDueDate,
  _formatCardContent,
  _updateDueDate
} from '../lib/words'
import { nanoid } from 'nanoid'
import { useRxDB } from '..//lib/rxdb-hooks'
import * as DropdownMenu from '@radix-ui/react-dropdown-menu'
import { Cross1Icon, CheckIcon, StackIcon } from '@radix-ui/react-icons'
import { AppDatabase, CardDocument, DeckDocument } from '../lib/types'

export function SelectDeckMenu({
  option,
  changeOption
}: {
  option: string
  changeOption: (x: string) => void
}) {
  const db = useRxDB<AppDatabase>()
  const [decks, setDecks] = useState<DeckDocument[]>()

  useEffect(() => {
    if (!db) return

    const getDecks = async () => {
      const decks = await db.decks.find().exec()
      setDecks(decks as DeckDocument[])
    }

    getDecks()
  }, [db])

  return (
    <DropdownMenu.Root modal={false}>
      <DropdownMenu.Trigger
        aria-label="Sorting options"
        className="flex items-center text-sm text-white border border-white border-opacity-20 px-3 rounded-[3px] h-8 space-x-2"
      >
        <StackIcon />
        <span>{decks?.find((x) => x.id === option)?.name || 'New set'}</span>
        {option && (
          <div onClick={() => changeOption('')}>
            <Cross1Icon />
          </div>
        )}
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

export default function Editor({
  close,
  card,
  content
}: {
  close: () => void
  card: CardDocument
  content: string
}) {
  const inputRef = useRef<HTMLInputElement | null>(null)
  const db = useRxDB<AppDatabase>()
  const [deckId, setDeckId] = useState('')

  const initialText = card
    ? `${card.word || ''}\n---\n${card.meaning || ''}`
    : content

  const saveWord = async () => {
    const [word, meaning] = _formatCardContent(
      inputRef.current?.innerText || ''
    )
    const today = new Date().toISOString()
    const newSetId = nanoid(8)

    /**
     * Update term
     */
    if (card) {
      await card?.update({
        $set: {
          word: word || '',
          meaning: meaning || '',
          updatedAt: today
        }
      })
    }

    /**
     * Save term
     */
    if (!card) {
      await db?.cards?.upsert({
        id: nanoid(8),
        word: word || '',
        meaning: meaning || '',
        createdAt: today,
        updatedAt: today,
        lastReviewed: '',
        srsDueDate: _calculateDueDate(1),
        status: 1,
        previousStatus: 1,
        statusChangedDate: today,
        deckId: deckId || newSetId
      })
    }

    if (!card && deckId) {
      const setDocument = await db?.decks?.findOne(deckId).exec()
      await setDocument?.update({
        $inc: {
          terms: 1
        }
      })
    }

    if (!card && !deckId) {
      await db?.decks?.insert({
        id: newSetId,
        name: 'New set',
        description: '',
        terms: 1,
        createdAt: today,
        lastStudiedAt: today
      })
    }

    close()
  }

  return (
    <div className="flex flex-col gap-3 py-2.5 border border-white/20 rounded-lg overflow-hidden bg-[#303136]">
      <div
        ref={inputRef}
        contentEditable="true"
        suppressContentEditableWarning
        placeholder={'text'}
        className="relative font-mono w-full min-h-[140px] overflow-hidden resize-y rounded px-2.5 whitespace-pre-wrap bg-transparent empty:before:content-[attr(placeholder)] before:absolute before:whitespace-pre-wrap"
      >
        {initialText || ''}
      </div>
      <hr className="border-none h-[1px] bg-white/20" />
      <div className="flex items-center justify-end space-x-2">
        {!card && <SelectDeckMenu option={deckId} changeOption={setDeckId} />}
        <button
          className="flex items-center text-sm text-white border border-white border-opacity-20 px-3 rounded-[3px] h-8 space-x-2"
          aria-label="Close"
          onClick={close}
        >
          Cancel
        </button>
        <button
          className="inline-flex items-center justify-center text-sm text-white bg-[rgb(35,131,226)] px-3 rounded-[3px] h-8 space-x-2"
          aria-label="Save"
          onClick={saveWord}
        >
          Save
        </button>
      </div>
    </div>
  )
}
