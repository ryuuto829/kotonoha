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
import { WordDocType } from '../lib/types'

export function EditContent({
  close,
  textContent,
  initialStatus = 1,
  handleWordSave
}: {
  close: () => void
  textContent?: string
  initialStatus?: number
  handleWordSave: (content: string, status: number) => Promise<void>
}) {
  const inputRef = useRef<HTMLDivElement>(null)
  const [status, setStatus] = useState(initialStatus)

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
              await handleWordSave(inputRef.current?.innerText || '', status)
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

export default function EditDialog({
  doc,
  textContent,
  modal,
  children
}: {
  doc?: WordDocType
  textContent?: string
  modal?: boolean
  children: ReactElement
}) {
  const wordCollection = useRxCollection('words')
  const userCollection = useRxCollection('users')
  const userDoc = userCollection?.findOne('user')

  const [open, setOpen] = useState(false)

  const saveWord = async (content: string, status: number) => {
    const [word, meaning] = _formatCardContent(content)
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
          dueDate: _updateDueDate(
            status,
            doc?.lastReviewedAt || doc?.createdAt
          ),
          reviewStatus: status
        }
      })
    }

    /**
     * Add a new word
     */
    await wordCollection?.upsert({
      id: nanoid(8),
      word: word || '',
      meaning: meaning || '',
      createdAt: today,
      updatedAt: today,
      lastReviewedAt: '',
      dueDate: _calculateDueDate(status),
      reviewStatus: status
    })

    await userDoc?.update({
      $inc: {
        experiencePoints: 0.5,
        totalWords: 1
      }
    })
  }

  const handleClose = () => {
    setOpen(false)
  }

  if (modal) {
    return (
      <Dialog.Root open={open} onOpenChange={setOpen}>
        {/* Trigger */}
        <Dialog.Trigger asChild>{children}</Dialog.Trigger>

        {/* Content */}
        <Dialog.Portal>
          <Dialog.Content className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-md grid gap-4 bg-[rgb(32,32,32)] p-6 mt-5 rounded-xl shadow-md">
            <EditContent
              close={handleClose}
              textContent={textContent}
              handleWordSave={saveWord}
              initialStatus={doc?.reviewStatus}
            />
          </Dialog.Content>
        </Dialog.Portal>
      </Dialog.Root>
    )
  }

  return (
    <Collapsible.Root open={open} onOpenChange={setOpen}>
      {/* Trigger */}
      <Collapsible.Trigger asChild>{children}</Collapsible.Trigger>

      {/* Content */}
      <Collapsible.Content className="flex flex-col data-[state=open]:border border-white/20 rounded-lg">
        <EditContent
          close={handleClose}
          textContent={textContent}
          handleWordSave={saveWord}
          initialStatus={doc?.reviewStatus}
        />
      </Collapsible.Content>
    </Collapsible.Root>
  )
}
