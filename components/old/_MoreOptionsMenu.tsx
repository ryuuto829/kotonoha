import * as DropdownMenu from '@radix-ui/react-dropdown-menu'
import {
  DotsHorizontalIcon,
  TrashIcon,
  Pencil2Icon
} from '@radix-ui/react-icons'
import { useRxDB } from '../../lib/rxdb-hooks'
import { AppDatabase, CardDocument } from '../../lib/types'

export default function MoreOptionsMenu({ doc, edit }: { doc: CardDocument }) {
  const db = useRxDB<AppDatabase>()

  const deleteTerm = async () => {
    await doc?.remove()

    const setDocument = await db.decks.findOne(doc.deckId).exec()
    await setDocument?.update({
      $inc: {
        terms: -1
      }
    })
  }

  return (
    <DropdownMenu.Root modal={false}>
      <DropdownMenu.Trigger
        aria-label="More options"
        className="h-8 w-8 inline-flex items-center justify-center rounded hover:bg-white/5 transition-colors"
      >
        <DotsHorizontalIcon className="w-5 h-5" />
      </DropdownMenu.Trigger>
      <DropdownMenu.Portal>
        <DropdownMenu.Content
          align="end"
          sideOffset={5}
          className="py-1.5 z-50 w-[210px] rounded-md bg-[#303136] border border-white/10 text-sm"
        >
          {/* Edit */}
          <button
            className="flex items-center gap-2.5 mx-1.5 px-1.5 w-full h-8 max-w-[calc(100%-12px)] rounded hover:bg-white/5 outline-none"
            onClick={edit}
          >
            <Pencil2Icon className="w-4 h-4" />
            <span>Edit</span>
          </button>
          {/* Delete */}
          <button
            className="flex items-center gap-2.5 mx-1.5 px-1.5 w-full h-8 max-w-[calc(100%-12px)] rounded hover:bg-white/5 outline-none"
            onClick={deleteTerm}
          >
            <TrashIcon className="w-4 h-4" />
            <span>Delete</span>
          </button>
        </DropdownMenu.Content>
      </DropdownMenu.Portal>
    </DropdownMenu.Root>
  )
}
