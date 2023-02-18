import React, { useEffect, useRef, useState } from 'react'
import type { Ref } from 'react'
import StatusMenu from './StatusMenu'
import { saveCard, updateCard } from '../lib/words'
import { useRxCollection } from 'rxdb-hooks'

export default function AddCard({ textContent, close, docId }) {
  const collection = useRxCollection('words')
  const inputRef: Ref<HTMLDivElement> = useRef(null)

  const [status, setStatus] = useState(1)
  const [wordDocument, setWordDocument] = useState()

  useEffect(() => {
    if (docId && collection) {
      collection
        .findOne(docId)
        .exec()
        .then((doc) => {
          console.log(doc)

          setWordDocument(doc)
          setStatus(doc.reviewStatus)
          inputRef.current.innerText = `${doc.word}\n---\n${doc.meaning} `
        })
    }
  }, [collection, docId])

  const handleWordSave = async () => {
    if (docId) {
      console.log(inputRef.current?.innerText.split('\n---\n'))
      await updateCard({
        doc: wordDocument,
        content: inputRef.current?.innerText,
        status
      })
    }

    await saveCard({
      collection,
      content: inputRef.current?.innerText,
      status
    })

    close()
  }

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
            onClick={handleWordSave}
          >
            Save
          </button>
        </div>
      </div>
    </>
  )
}
