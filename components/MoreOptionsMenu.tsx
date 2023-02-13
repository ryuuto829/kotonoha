import * as DropdownMenu from '@radix-ui/react-dropdown-menu'
import {
  DotsHorizontalIcon,
  TrashIcon,
  Pencil2Icon
} from '@radix-ui/react-icons'

import AddWordDialog from '../components/AddWordDialog'
import theme from '../lib/theme'

export default function MoreOptionsMenu({ deleteWord, doc }) {
  return (
    <DropdownMenu.Root modal={false}>
      <DropdownMenu.Trigger
        aria-label="More options"
        className={theme.menu.triggerButton}
      >
        <DotsHorizontalIcon className="w-5 h-5" />
      </DropdownMenu.Trigger>

      <DropdownMenu.Portal>
        <DropdownMenu.Content
          align="end"
          sideOffset={5}
          className={`${theme.menu.content} w-[230px]`}
        >
          <AddWordDialog id={doc.id}>
            <div className={theme.menu.menuItem()}>
              <div className="ml-2.5 mr-1 flex items-center justify-center">
                <Pencil2Icon className="w-4 h-4" />
              </div>
              <div className="ml-1.5 mr-3">Edit</div>
            </div>
          </AddWordDialog>
          <div
            className={theme.menu.menuItem()}
            onClick={() => deleteWord(doc.id)}
          >
            <div className="ml-2.5 mr-1 flex items-center justify-center">
              <TrashIcon className="w-4 h-4" />
            </div>
            <div className="ml-1.5 mr-3">Delete</div>
          </div>
        </DropdownMenu.Content>
      </DropdownMenu.Portal>
    </DropdownMenu.Root>
  )
}
