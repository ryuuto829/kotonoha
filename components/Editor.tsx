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

function SelectDeckMenu({
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
        className="inline-flex items-center gap-2 rounded-lg h-10 py-2 px-4 bg-white/10"
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
          className="py-1.5 z-50 w-[210px] rounded-md bg-[#303136] border border-white/10 text-sm"
        >
          <DropdownMenu.RadioGroup value={option} onValueChange={changeOption}>
            {decks &&
              decks.map(({ id, name }) => (
                <DropdownMenu.RadioItem
                  key={id}
                  value={id}
                  className="flex items-center justify-between gap-2.5 mx-1.5 px-1.5 w-full h-8 max-w-[calc(100%-12px)] rounded hover:bg-white/5 outline-none"
                >
                  <span>{name}</span>
                  <CheckIcon
                    className={`w-4 h-4 ${id === option ? '' : 'hidden'}`}
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
  deck,
  content
}: {
  close: () => void
  card?: CardDocument
  deck?: DeckDocument
  content?: string
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
        deckId: deck?.id || deckId || newSetId
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

    if (!card && deck) {
      await deck.update({
        $inc: {
          terms: 1
        }
      })
    }

    if (!card && !deckId && !deck) {
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
        placeholder="term"
        className="relative font-mono w-full overflow-hidden resize-y rounded px-2.5 whitespace-pre-wrap bg-transparent empty:before:content-[attr(placeholder)] before:absolute before:whitespace-pre-wrap"
      >
        {initialText || ''}
      </div>
      <hr className="border-none h-[1px] bg-white/20" />
      <div className="flex items-center justify-between gap-4 px-3">
        {!card && !deck && (
          <SelectDeckMenu option={deckId} changeOption={setDeckId} />
        )}
        <div className="flex items-center gap-3">
          <button
            className="inline-flex items-center gap-2 rounded-lg h-10 py-2 px-4 bg-white/10"
            aria-label="Close"
            onClick={close}
          >
            Cancel
          </button>
          <button
            className="items-center gap-2 rounded-lg h-10 py-2 px-4 bg-white/10"
            aria-label="Save"
            onClick={saveWord}
          >
            Save
          </button>
        </div>
      </div>
    </div>
  )
}
