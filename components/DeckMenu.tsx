import * as DropdownMenu from '@radix-ui/react-dropdown-menu'
import { DotsHorizontalIcon, TrashIcon } from '@radix-ui/react-icons'
import { useRouter } from 'next/router'
import { useState } from 'react'

export default function DeckMenu({ deck }) {
  const router = useRouter()
  const [open, setOpen] = useState(false)

  return (
    <DropdownMenu.Root modal={false} open={open} onOpenChange={setOpen}>
      <DropdownMenu.Trigger
        aria-label="More options"
        className="inline-flex items-center space-x-2 p-1.5 text-base h-7 rounded-[3px] whitespace-nowrap hover:bg-white hover:bg-opacity-5 data-[state=open]:bg-white data-[state=open]:bg-opacity-5"
      >
        <DotsHorizontalIcon className="w-5 h-5" />
      </DropdownMenu.Trigger>

      <DropdownMenu.Portal>
        <DropdownMenu.Content
          align="end"
          sideOffset={5}
          className={`py-2 rounded bg-[rgb(37,37,37)] text-sm text-white text-opacity-80 w-[230px]`}
        >
          <button>Import cards</button>
          {/* Delete deck */}
          {deck && (
            <>
              <form
                onSubmit={async (e) => {
                  e.preventDefault()

                  const formData = new FormData(e.target)
                  const nameInputData = formData.get('name')

                  await deck.update({
                    $set: {
                      name: nameInputData || ''
                    }
                  })
                  setOpen(false)
                }}
              >
                <input
                  type="text"
                  name="name"
                  defaultValue={deck?.name || 'all'}
                  className="w-full flex items-center mx-1 rounded-[3px] h-7 hover:bg-white hover:bg-opacity-10 cursor-pointer"
                />
              </form>

              <button
                className="w-full flex items-center mx-1 rounded-[3px] h-7 hover:bg-white hover:bg-opacity-10 cursor-pointer"
                onClick={async () => {
                  await deck?.remove()
                  setOpen(false)
                  router.push('/vocabulary/all')
                }}
              >
                <div className="ml-2.5 mr-1 flex items-center justify-center">
                  <TrashIcon className="w-4 h-4" />
                </div>
                <div className="ml-1.5 mr-3">Delete Deck</div>
              </button>
            </>
          )}
        </DropdownMenu.Content>
      </DropdownMenu.Portal>
    </DropdownMenu.Root>
  )
}
