import * as DropdownMenu from '@radix-ui/react-dropdown-menu'
import {
  DotsHorizontalIcon,
  TrashIcon,
  Pencil2Icon
} from '@radix-ui/react-icons'

import EditDialog from './CardEditor'

export default function MoreOptionsMenu({ deleteWord, doc }) {
  return (
    <DropdownMenu.Root modal={false}>
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
          {/* Add word */}
          <EditDialog
            modal={true}
            doc={doc}
            textContent={doc.word + '\n---\n' + doc.meaning}
          >
            <button className="w-full flex items-center mx-1 rounded-[3px] h-7 hover:bg-white hover:bg-opacity-10 cursor-pointer">
              <div className="ml-2.5 mr-1 flex items-center justify-center">
                <Pencil2Icon className="w-4 h-4" />
              </div>
              <div className="ml-1.5 mr-3">Edit</div>
            </button>
          </EditDialog>

          {/* Delete word */}
          <button
            className="w-full flex items-center mx-1 rounded-[3px] h-7 hover:bg-white hover:bg-opacity-10 cursor-pointer"
            onClick={() => deleteWord(doc.id)}
          >
            <div className="ml-2.5 mr-1 flex items-center justify-center">
              <TrashIcon className="w-4 h-4" />
            </div>
            <div className="ml-1.5 mr-3">Delete</div>
          </button>
        </DropdownMenu.Content>
      </DropdownMenu.Portal>
    </DropdownMenu.Root>
  )
}
