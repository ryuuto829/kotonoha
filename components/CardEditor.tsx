import { ReactElement, useRef, useState } from 'react'
// import StatusMenu from './StatusMenu'
import {
  _formatCardContent,
  _calculateDueDate
  // _updateDueDate
} from '../lib/words'
import { useRxCollection } from 'rxdb-hooks'
import { nanoid } from 'nanoid'
import * as Collapsible from '@radix-ui/react-collapsible'
import * as Dialog from '@radix-ui/react-dialog'
import { CardDocument } from '../lib/types'
import SelectDeckMenu from './SelectDeckMenu'
import * as RadioGroup from '@radix-ui/react-radio-group'

export function EditorContent({
  close,
  card,
  textContent
}: {
  close: () => void
  card?: CardDocument
  textContent?: string
}) {
  const cardsCollection = useRxCollection('cards')
  const decksCollection = useRxCollection('decks')

  const inputRef = useRef<HTMLDivElement>(null)
  const termRef = useRef(null)
  const [status, setStatus] = useState(card?.status || 1)
  const [deckId, setDeckId] = useState('')

  const [termDivider, setTermDivider] = useState('\n---\n')
  const [lineDivider, setLineDivider] = useState('\n\n')

  const placeholder = [...Array.from(Array(3))]
    .map(
      (_, index) =>
        `Word ${index + 1}${termDivider.replace(/\\n/g, '\n')}Definition ${
          index + 1
        }`
    )
    .join(lineDivider)

  const saveWord = async () => {
    const [word, meaning] = _formatCardContent(
      inputRef.current?.innerText || ''
    )
    const today = new Date().toISOString()

    /**
     * Update word
     */
    if (card) {
      return await card?.update({
        $set: {
          word: word || '',
          meaning: meaning || '',
          updatedAt: today,
          srsDueDate: '',
          status,
          previousStatus: card.status,
          statusChangedDate:
            card.status === status ? card.statusChangedDate : today
        }
      })
    }

    /**
     * Add a new word
     */
    await cardsCollection?.upsert({
      id: nanoid(8),
      word: word || '',
      meaning: meaning || '',
      createdAt: today,
      updatedAt: today,
      lastReviewed: null,
      srsDueDate: _calculateDueDate(status),
      status: status,
      previousStatus: null,
      statusChangedDate: today,
      deckId: deckId || null
    })

    const doc = await decksCollection?.findOne(deckId).exec()

    await doc?.update({
      $inc: {
        terms: 1
      }
    })
  }

  return (
    <div className="flex">
      <div className="flex-1">
        <h1 className="text-2xl font-bold">Import new cards</h1>
        <div
          ref={inputRef}
          contentEditable="true"
          suppressContentEditableWarning
          placeholder={placeholder}
          className="relative font-mono w-full min-h-[140px] overflow-hidden resize-y rounded px-2.5 py-1 whitespace-pre-wrap bg-[#202124] empty:before:content-[attr(placeholder)] before:absolute before:whitespace-pre-wrap"
        >
          {textContent || ''}
        </div>
      </div>
      <div className="flex flex-col gap-3 p-2">
        {/* <StatusMenu statusOption={status} changeStatus={setStatus} /> */}
        <SelectDeckMenu option={deckId} changeOption={setDeckId} />

        <RadioGroup.Root
          name="termDivide"
          onValueChange={setTermDivider}
          className="flex flex-col items-start"
        >
          <div>Between term and definition</div>
          <RadioGroup.Item value={`\t`} className="flex">
            <RadioGroup.Indicator className="flex items-center justify-center w-full h-full relative after:content-[''] after:block after:w-[11px] after:h-[11px] after:rounded-[50%] after:bg-blue-400"></RadioGroup.Indicator>
            Tab
          </RadioGroup.Item>
          <RadioGroup.Item value="\n---\n">
            Divider
            <RadioGroup.Indicator>+</RadioGroup.Indicator>
          </RadioGroup.Item>
          <RadioGroup.Item value="">
            <input
              ref={termRef}
              type="text"
              name="termDivide"
              placeholder="\n---\n"
              className="whitespace-pre-wrap font-mono"
              onChange={(e) => {
                setTermDivider(e.currentTarget.value)
              }}
            />
            <RadioGroup.Indicator>+</RadioGroup.Indicator>
          </RadioGroup.Item>
        </RadioGroup.Root>

        <RadioGroup.Root
          name="termDivide"
          onValueChange={setLineDivider}
          className="flex flex-col items-start"
        >
          <div>Between cards</div>
          <RadioGroup.Item value={`\n\n`}>
            Empty line
            <RadioGroup.Indicator>+</RadioGroup.Indicator>
          </RadioGroup.Item>
          <RadioGroup.Item value=";">
            Semicolon
            <RadioGroup.Indicator>+</RadioGroup.Indicator>
          </RadioGroup.Item>
          <RadioGroup.Item value="">
            <input
              ref={termRef}
              type="text"
              name="termDivide"
              placeholder="\n---\n"
              className="whitespace-pre-wrap font-mono"
              onChange={(e) => {
                setLineDivider(e.currentTarget.value)
              }}
            />
            <RadioGroup.Indicator>+</RadioGroup.Indicator>
          </RadioGroup.Item>
        </RadioGroup.Root>
        <div className="flex items-center justify-end space-x-2">
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
            onClick={async () => {
              await saveWord()
              close()
            }}
          >
            Save
          </button>
        </div>
      </div>
    </div>
  )
}

export default function CardEditor({
  doc,
  textContent,
  modal,
  children
}: {
  doc?: CardDocument
  textContent?: string
  modal?: boolean
  children: ReactElement
}) {
  const [open, setOpen] = useState(false)

  const content = (
    <EditorContent
      close={() => setOpen(false)}
      textContent={textContent}
      card={doc}
    />
  )

  /**
   * Modal view
   */
  if (modal) {
    return (
      <Dialog.Root open={open} onOpenChange={setOpen}>
        <Dialog.Trigger asChild>{children}</Dialog.Trigger>
        <Dialog.Portal>
          <Dialog.Overlay className="fixed inset-0 overflow-y-auto z-50 flex items-start justify-center">
            <Dialog.Content className="flex flex-col gap-5 w-full max-w-[550px] my-14 bg-[#303136] p-6 rounded-xl shadow-md border border-white/20">
              {content}
            </Dialog.Content>
          </Dialog.Overlay>
        </Dialog.Portal>
      </Dialog.Root>
    )
  }

  /**
   * Inline view (used on the `dictionary` page)
   */
  return (
    <Collapsible.Root open={open} onOpenChange={setOpen}>
      <Collapsible.Trigger asChild>{children}</Collapsible.Trigger>
      <Collapsible.Content className="flex flex-col data-[state=open]:border border-white/20 rounded-lg">
        {content}
      </Collapsible.Content>
    </Collapsible.Root>
  )
}
