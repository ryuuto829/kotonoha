import { useState } from 'react'
import { MagnifyingGlassIcon } from '@radix-ui/react-icons'

export default function TableSearch({
  input,
  changeInput
}: {
  input: string
  changeInput: (x: string) => void
}) {
  const [open, setOpen] = useState(false)

  return (
    <>
      {open && (
        <>
          <MagnifyingGlassIcon className="w-5 h-5" />
          <input
            type="sumbit"
            value={input}
            placeholder="Type to search .."
            onInput={(e) => changeInput(e.currentTarget.value)}
            onBlur={(e) => {
              if (e.currentTarget.value === '') {
                changeInput('')
                setOpen(false)
              }
            }}
          />
          <button
            onClick={() => {
              changeInput('')
              setOpen(false)
            }}
          >
            close
          </button>
        </>
      )}

      {!open && (
        <button
          onClick={() => setOpen(true)}
          className="h-[35px] inline-flex items-center justify-center space-x-2 outline-none hover:bg-white/5 rounded px-2"
          aria-label="Customise options"
        >
          <MagnifyingGlassIcon className="w-5 h-5" />
          <span>Search</span>
        </button>
      )}
    </>
  )
}
