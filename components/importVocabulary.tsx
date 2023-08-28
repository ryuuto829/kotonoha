import * as Dialog from '@radix-ui/react-dialog'
import { useEditor, EditorContent } from '@tiptap/react'
import Document from '@tiptap/extension-document'
import Paragraph from '@tiptap/extension-paragraph'
import Text from '@tiptap/extension-text'
import * as DropdownMenu from '@radix-ui/react-dropdown-menu'
import { CheckIcon, ChevronDownIcon } from '@radix-ui/react-icons'

const Editor = ({
  content,
  changeContent
}: {
  content: string
  changeContent: (x: object) => void
}) => {
  const editor = useEditor({
    extensions: [Document, Paragraph, Text],
    content: content,
    editorProps: {
      attributes: {
        class:
          'border border-white/10 p-3 outline-none bg-transparent overflow-y-auto'
      }
    },
    onUpdate: ({ editor }) => {
      // const html = editor.getHTML()
      const json = editor.getJSON()

      changeContent(json)
      // send the content to an API here
    }
  })

  return <EditorContent editor={editor} />
}

const deckList = [
  {
    value: '1',
    label: 'Deck 1'
  },
  {
    value: '2',
    label: 'Deck 2'
  },
  {
    value: '3',
    label: 'Deck 3'
  },
  {
    value: '4',
    label: 'Deck 4'
  },
  {
    value: '5',
    label: 'Deck 5'
  },
  {
    value: '6',
    label: 'Deck 6'
  }
]

export default function ImportVocabulary({
  open,
  changeOpen,
  content,
  changeContent,
  deck,
  changeDeck,
  saveContent
}: {
  open: boolean
  changeOpen: (open: boolean) => void
  content: string
  changeContent: (x: string) => void
  deck: string
  changeDeck: (x: string) => void
  saveContent: () => Promise<void>
}) {
  return (
    <Dialog.Root open={open} onOpenChange={changeOpen}>
      <Dialog.Portal>
        <Dialog.Overlay className="bg-black/40 fixed inset-0 z-50" />
        <Dialog.Content className="fixed bottom-0 top-auto w-full md:bottom-auto md:top-[50%] md:left-[50%] md:w-[540px] md:translate-x-[-50%] md:translate-y-[-50%] z-50 bg-[--color-base] max-h-[75vh] md:max-h-[90vh] max-w-full rounded-md outline-none flex flex-col overflow-hidden">
          <h3 className="p-4 text-xl">Import Vocabulary</h3>
          <section className="p-4 flex flex-col gap-3 overflow-y-auto">
            <label htmlFor="note">
              <div className="mb-2">Vocabulary</div>
              <Editor content={content} changeContent={changeContent} />
            </label>
            <label htmlFor="deck">
              <div className="mb-2">Deck</div>

              <DropdownMenu.Root>
                <DropdownMenu.Trigger
                  className="w-full appearance-none leading-5 border border-white/10 bg-transparent p-3 outline-none flex items-center justify-between"
                  aria-label="Decks"
                >
                  {deckList.find(({ value }) => value === deck)?.label}
                  <ChevronDownIcon />
                </DropdownMenu.Trigger>

                <DropdownMenu.Portal>
                  <DropdownMenu.Content
                    className="z-50 min-w-[calc(100vw-32px)] md:min-w-[calc(540px-32px)] bg-[--color-base-light] rounded-md py-[5px] shadow will-change-[opacity,transform]"
                    sideOffset={5}
                  >
                    <DropdownMenu.RadioGroup
                      value={deck}
                      onValueChange={changeDeck}
                      className="max-h-[30vh] overflow-y-auto"
                    >
                      {deckList.map(({ value, label }) => (
                        <DropdownMenu.RadioItem
                          key={value}
                          className="leading-10 flex items-center h-10 px-3 relative select-none outline-none data-[disabled]:text-mauve8 data-[disabled]:pointer-events-none data-[highlighted]:bg-white/10"
                          value={value}
                        >
                          {label}
                          <DropdownMenu.ItemIndicator className="absolute right-0 w-[25px] inline-flex items-center justify-center">
                            <CheckIcon />
                          </DropdownMenu.ItemIndicator>
                        </DropdownMenu.RadioItem>
                      ))}
                    </DropdownMenu.RadioGroup>
                  </DropdownMenu.Content>
                </DropdownMenu.Portal>
              </DropdownMenu.Root>
            </label>
          </section>

          <footer className="sticky bottom-0 p-4 flex items-center justify-between bg-[--color-base]">
            <Dialog.Close className="px-4 leading-10 flex items-center justify-center hover:bg-white/10">
              Cancel
            </Dialog.Close>
            <Dialog.Close
              onClick={saveContent}
              className="px-4 leading-10 bg-[--color-primary] flex items-center justify-center text-[--color-text-contrast]"
            >
              Save
            </Dialog.Close>
          </footer>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  )
}
