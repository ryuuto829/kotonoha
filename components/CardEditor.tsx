import { ReactElement, useRef, useState } from 'react'
import StatusMenu from './StatusMenu'
import {
  _formatCardContent,
  _calculateDueDate,
  _updateDueDate
} from '../lib/words'
import { useRxCollection } from 'rxdb-hooks'
import { nanoid } from 'nanoid'
import * as Collapsible from '@radix-ui/react-collapsible'
import * as Dialog from '@radix-ui/react-dialog'
import { CardDocument } from '../lib/types'
import SelectDeckMenu from './SelectDeckMenu'

export function EditContent({
  close,
  doc,
  textContent
}: {
  close: () => void
  doc?: CardDocument
  textContent?: string
}) {
  const cardsCollection = useRxCollection('cards')

  const inputRef = useRef<HTMLDivElement>(null)
  const [status, setStatus] = useState(doc?.status || 1)
  const [deckId, setDeckId] = useState(null)

  const saveWord = async () => {
    const [word, meaning] = _formatCardContent(
      inputRef.current?.innerText || ''
    )
    const today = new Date().toISOString()

    /**
     * Update word
     */
    if (doc) {
      return await doc?.update({
        $set: {
          word: word || '',
          meaning: meaning || '',
          updatedAt: today,
          srsDueDate: _updateDueDate(
            status,
            doc?.lastReviewed || doc?.createdAt
          ),
          status,
          previousStatus: doc.status,
          statusChangedDate:
            doc.status === status ? doc.statusChangedDate : today
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
      deckId: deckId
    })
  }

  return (
    <>
      <div className="border-b border-white/20 p-2">
        <div
          ref={inputRef}
          contentEditable="true"
          suppressContentEditableWarning
          className="w-full overflow-hidden resize-y rounded px-2.5 py-1 whitespace-pre-wrap"
        >
          {textContent || ''}
        </div>
      </div>
      <div className="flex items-center justify-between gap-5 p-2">
        <StatusMenu statusOption={status} changeStatus={setStatus} />
        <SelectDeckMenu option={deckId} changeOption={setDeckId} />
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
    </>
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
    <EditContent
      close={() => setOpen(false)}
      textContent={textContent}
      doc={doc}
    />
  )

  // MODAL VIEW
  if (modal) {
    return (
      <Dialog.Root open={open} onOpenChange={setOpen}>
        <Dialog.Trigger asChild>{children}</Dialog.Trigger>
        <Dialog.Portal>
          <Dialog.Overlay className="fixed inset-0 flex overflow-y-auto z-20 items-start justify-center scroll-p-10">
            <Dialog.Content className="w-full max-w-[550px] my-14 bg-[rgb(32,32,32)] p-6 rounded-xl shadow-md">
              {content}
            </Dialog.Content>
          </Dialog.Overlay>
        </Dialog.Portal>
      </Dialog.Root>
    )
  }

  // INLINE VIEW
  return (
    <Collapsible.Root open={open} onOpenChange={setOpen}>
      <Collapsible.Trigger asChild>{children}</Collapsible.Trigger>
      <Collapsible.Content className="flex flex-col data-[state=open]:border border-white/20 rounded-lg">
        {content}
      </Collapsible.Content>
    </Collapsible.Root>
  )
}