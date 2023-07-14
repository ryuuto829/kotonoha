import * as Dialog from '@radix-ui/react-dialog'
import { useEditor, EditorContent } from '@tiptap/react'
import Document from '@tiptap/extension-document'
import Paragraph from '@tiptap/extension-paragraph'
import Text from '@tiptap/extension-text'

const Editor = ({
  content,
  changeContent
}: {
  content: string
  changeContent: (x: string) => void
}) => {
  const editor = useEditor({
    extensions: [Document, Paragraph, Text],
    content: content,
    editorProps: {
      attributes: {
        class: 'border border-white/10 p-3 outline-none bg-transparent'
      }
    },
    onUpdate: ({ editor }) => {
      const html = editor.getHTML()

      changeContent(html)
      // send the content to an API here
    }
  })

  return <EditorContent editor={editor} />
}

export default function ImportVocabulary({
  open,
  changeOpen,
  content,
  changeContent,
  saveContent
}: {
  open: boolean
  changeOpen: (open: boolean) => void
  content: string
  changeContent: (x: string) => void
  saveContent: () => Promise<void>
}) {
  return (
    <Dialog.Root open={open} onOpenChange={changeOpen}>
      <Dialog.Portal>
        <Dialog.Overlay className="bg-black/10 fixed inset-0" />
        <Dialog.Content className="fixed bottom-0 top-auto w-full z-50 bg-[#202124] max-h-[75vh] max-w-full overflow-y-auto">
          <h3 className="p-4 bg-black/20 border-y border-white/10">
            Vocabulary import
          </h3>
          <div className="p-4 flex flex-col">
            <label htmlFor="note">
              <div>Imprort vocabulary</div>
              <Editor content={content} changeContent={changeContent} />
            </label>
            <label htmlFor="deck">
              <div>Deck</div>
              <select
                name="deck"
                id=""
                className="w-full appearance-none h-10 leading-5 border border-white/10 bg-[#202124] rounded-md px-3 outline-none"
              >
                {[
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
                  }
                ].map(({ value, label }) => (
                  <option
                    key={value}
                    value={value}
                    className="w-full leading-5 bg-black"
                  >
                    {label}
                  </option>
                ))}
              </select>
            </label>
          </div>
          <footer className="sticky bottom-0 p-4 flex items-center justify-between bg-black border-t border-white/10">
            <Dialog.Close className="rounded-md px-3 leading-10 flex items-center justify-center border border-white/10">
              Cancel
            </Dialog.Close>
            <Dialog.Close
              onClick={saveContent}
              className="rounded-md px-3 leading-10 bg-[#ededed] flex items-center justify-center border border-[#ededed] text-black"
            >
              Save
            </Dialog.Close>
          </footer>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  )
}
