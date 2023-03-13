import { useState } from 'react'
import * as DropdownMenu from '@radix-ui/react-dropdown-menu'
import * as Collapsible from '@radix-ui/react-collapsible'
import {
  Pencil2Icon,
  DotsHorizontalIcon,
  TrashIcon
} from '@radix-ui/react-icons'
import Editor from '../components/Editor'
import { CardDocument, DeckDocument } from '../lib/types'

function Menu({
  editTerm,
  deleteTerm
}: {
  editTerm: () => void
  deleteTerm: () => void
}) {
  const menuItems = [
    {
      name: 'Edit',
      Icon: Pencil2Icon,
      selected: editTerm
    },
    {
      name: 'Delete',
      Icon: TrashIcon,
      selected: deleteTerm
    }
  ]

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
          {menuItems.map(({ name, Icon, selected }) => (
            <DropdownMenu.Item
              key={name}
              onSelect={selected}
              className="flex items-center gap-2.5 mx-1.5 px-1.5 w-full h-8 max-w-[calc(100%-12px)] rounded hover:bg-white/5 outline-none cursor-pointer"
            >
              <Icon className="w-4 h-4" />
              <span>{name}</span>
            </DropdownMenu.Item>
          ))}
        </DropdownMenu.Content>
      </DropdownMenu.Portal>
    </DropdownMenu.Root>
  )
}

export default function TermCard({
  card,
  deck
}: {
  card: CardDocument
  deck: DeckDocument
}) {
  const [openEditor, setOpenEditor] = useState(false)

  const deleteTerm = async () => {
    await card?.remove()

    await deck?.update({
      $inc: {
        terms: -1
      }
    })
  }

  return (
    <Collapsible.Root open={openEditor} onOpenChange={setOpenEditor}>
      {/* Card */}
      {!openEditor && (
        <div className="flex items-center rounded-md min-h-14 bg-[#303136] p-4 whitespace-pre-wrap">
          <div className="flex-1 grid grid-cols-[1fr_2fr] divide-x divide-white/40">
            <div className="pr-8">{card?.word || ' '}</div>
            <div className="px-8">{card?.meaning || ' '}</div>
          </div>
          <div>
            <Collapsible.Trigger className="h-8 w-8 inline-flex items-center justify-center rounded hover:bg-white/5 transition-colors">
              <Pencil2Icon className="w-4 h-4" />
            </Collapsible.Trigger>
            <Menu
              editTerm={() => setOpenEditor(true)}
              deleteTerm={deleteTerm}
            />
          </div>
        </div>
      )}
      {/* Editor */}
      <Collapsible.Content>
        <Editor close={() => setOpenEditor(false)} card={card} />
      </Collapsible.Content>
    </Collapsible.Root>
  )
}
