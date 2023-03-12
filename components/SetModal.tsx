import { FormEvent, ReactNode, useState } from 'react'
import { nanoid } from 'nanoid'
import * as Dialog from '@radix-ui/react-dialog'
import { Cross1Icon } from '@radix-ui/react-icons'
import { useRxDB } from '../lib/rxdb-hooks'
import { AppDatabase, DeckDocument } from '../lib/types'
import * as Form from '@radix-ui/react-form'

export default function SetModal({
  setDocument,
  children
}: {
  setDocument: DeckDocument
  children: ReactNode
}) {
  const db = useRxDB<AppDatabase>()
  const [open, setOpen] = useState(false)

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()

    const { name = 'New Deck', description } = Object.fromEntries(
      new FormData(event.currentTarget)
    ) as { [x: string]: string | undefined }

    /**
     * Update set
     */
    if (setDocument) {
      setDocument.update({
        $set: {
          name,
          description
        }
      })
    }

    /**
     * Create a new set
     */
    if (!setDocument) {
      const today = new Date().toISOString()

      await db.decks?.insert({
        id: nanoid(8),
        name,
        description,
        terms: 0,
        createdAt: today,
        lastStudiedAt: today
      })
    }

    setOpen(false)
  }

  return (
    <Dialog.Root open={open} onOpenChange={setOpen}>
      <Dialog.Trigger asChild>{children}</Dialog.Trigger>
      <Dialog.Portal>
        <Dialog.Overlay className="fixed inset-0 overflow-y-auto z-50 flex items-start justify-center">
          <Dialog.Content className="flex flex-col gap-5 w-full max-w-[550px] my-14 bg-[#303136] p-6 rounded-xl shadow-md border border-white/20">
            {/* Header */}
            <header className="flex items-center justify-between">
              <Dialog.Title className="text-2xl font-bold">
                {setDocument ? 'Edit study set' : 'Create a new study set'}
              </Dialog.Title>
              <Dialog.Trigger>
                <Cross1Icon className="w-5 h-5" />
              </Dialog.Trigger>
            </header>
            {/* Form */}
            <Form.Root onSubmit={handleSubmit} className="flex flex-col gap-4">
              <Form.Field name="name">
                <Form.Label className="sr-only">Set title</Form.Label>
                <Form.Control asChild>
                  <input
                    className="w-full bg-[#202124] inline-flex h-[35px] appearance-none items-center justify-center rounded px-4 text-[15px] leading-none shadow-[0_0_0_1px_transparent] outline-none hover:shadow-[0_0_0_1px_#9da2ff] focus:shadow-[0_0_0_2px_#9da2ff] transition-colors placeholder:text-white/50"
                    type="text"
                    defaultValue={setDocument?.name || ''}
                    placeholder="Enter set name"
                    required
                  />
                </Form.Control>
              </Form.Field>
              <Form.Field name="description">
                <Form.Label className="sr-only">Set description</Form.Label>
                <Form.Control asChild>
                  <input
                    className="w-full bg-[#202124] inline-flex h-[35px] appearance-none items-center justify-center rounded px-4 text-[15px] leading-none shadow-[0_0_0_1px_transparent] outline-none hover:shadow-[0_0_0_1px_#9da2ff] focus:shadow-[0_0_0_2px_#9da2ff] transition-colors placeholder:text-white/50"
                    type="text"
                    defaultValue={setDocument?.description || ''}
                    placeholder="Enter a description (optional)"
                  />
                </Form.Control>
              </Form.Field>
              <Form.Submit className="self-end inline-flex items-center gap-2 rounded-lg h-10 py-2 px-4 bg-white/10">
                Submit
              </Form.Submit>
            </Form.Root>
          </Dialog.Content>
        </Dialog.Overlay>
      </Dialog.Portal>
    </Dialog.Root>
  )
}
