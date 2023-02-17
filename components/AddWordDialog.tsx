import { useRef, useState } from 'react'
import * as Dialog from '@radix-ui/react-dialog'
import * as ToggleGroup from '@radix-ui/react-toggle-group'
import type { WordResult } from '../lib/types'
import PlusIcon from '@heroicons/react/24/outline/PlusIcon'
import * as ScrollArea from '@radix-ui/react-scroll-area'
import { useRxCollection } from 'rxdb-hooks'
import { nanoid } from 'nanoid'
import { CircleIcon, CheckCircledIcon, TargetIcon } from '@radix-ui/react-icons'

import { updateDueDate, calculateDueDate } from '../utils'

export const DEFAULT_REVIEW_INTERVALS = [1, 3, 7, 15]

export const REVIEW_STATUS = [
  { status: '1', label: 'NEW', icon: <CircleIcon className="w-4 h-4" /> },
  { status: '2', label: '3 DAYS', icon: <TargetIcon className="w-4 h-4" /> },
  { status: '3', label: '7 DAYS', icon: <TargetIcon className="w-4 h-4" /> },
  { status: '4', label: '15 DAYS', icon: <TargetIcon className="w-4 h-4" /> },
  {
    status: '5',
    label: 'KNOWN',
    icon: <CheckCircledIcon className="w-4 h-4" />
  }
]

function ReadingsToggleGroup({ readings, handleInputChange }) {
  return (
    <ScrollArea.Root className="pb-4">
      <ScrollArea.Viewport className="w-full h-full">
        <ToggleGroup.Root
          className="flex flex-nowrap items-center gap-2"
          type="single"
          defaultValue={`${readings[0].word} ${readings[0].reading}`}
          aria-label="Text alignment"
          onValueChange={(value) => {
            handleInputChange({
              word: value.split(' ')[0] || value.split(' ')[1] || '',
              reading: value.split(' ')[1] || ''
            })
          }}
        >
          {readings.map(({ word, reading }, index) => {
            return (
              <ToggleGroup.Item
                key={index}
                className="inline-flex whitespace-nowrap border border-white border-opacity-20 px-4 py-2 rounded hover:bg-white hover:bg-opacity-5 data-[state=on]:bg-blue-300"
                onClick={(e) => {
                  e.currentTarget.dataset.state === 'on' && e.preventDefault()
                }}
                value={`${word || reading} ${reading}`}
                aria-label={reading}
              >
                <span>{word || reading}</span>
                {word && <span>{` 【${reading}】`}</span>}
              </ToggleGroup.Item>
            )
          })}
        </ToggleGroup.Root>
      </ScrollArea.Viewport>
      <ScrollArea.Scrollbar
        className="flex flex-col h-1"
        orientation="horizontal"
      >
        <ScrollArea.Thumb className="flex-1 bg-black relative rounded before:content-[''] before:absolute before:top-1/2 before:left-1/2 before: min-w-[44px] before:min-h-[44px] before:w-full before:h-full before:-translate-x-1/2 before:-translate-y-1/2" />
      </ScrollArea.Scrollbar>
    </ScrollArea.Root>
  )
}

export default function AddWordDialog({
  word,
  id,
  children
}: {
  word?: WordResult
  id?: string
  children: React.ReactNode
}) {
  const wordsCollection = useRxCollection('words')
  const meaningRef = useRef(null)

  const [wordDocument, setWordDocument] = useState()
  const [inputs, setInputs] = useState({
    word: '',
    reading: '',
    meaning: '',
    status: 1
  })

  const handleInputChange = (word: typeof inputs) => {
    setInputs({ ...inputs, ...word })
  }

  const addSuggestedMeaning = (meaning) => {
    meaningRef.current.textContent =
      inputs.reading + ' - ' + meaning.english_definitions.join(', ')

    handleInputChange({ meaning: meaningRef.current.textContent })
  }

  const handleWordSave = async () => {
    const today = new Date().toISOString()

    // Create
    if (!id) {
      await wordsCollection?.upsert({
        id: nanoid(8),
        word: inputs.word,
        meaning: inputs.meaning,
        createdAt: today,
        updatedAt: today,
        lastReviewedAt: null,
        dueDate: calculateDueDate(inputs.status, DEFAULT_REVIEW_INTERVALS),
        reviewStatus: inputs.status
      })
      console.log('DatabaseService: create doc')
    }

    // Update
    if (id) {
      await wordDocument?.update({
        $set: {
          word: inputs.word,
          meaning: inputs.meaning,
          updatedAt: today,
          dueDate: updateDueDate(
            Number(inputs.status),
            wordDocument.lastReviewedAt || wordDocument.createdAt,
            DEFAULT_REVIEW_INTERVALS
          ),
          reviewStatus: inputs.status
        }
      })
      console.log('DatabaseService: update doc')
    }
  }

  const handleOpenChange = (open: boolean) => {
    if (!open) return

    if (id) {
      wordsCollection
        ?.findOne(id)
        .exec()
        .then((doc) => {
          console.log(doc)
          setWordDocument(doc)
          handleInputChange({
            word: doc.word,
            reading: '',
            meaning: doc.meaning,
            status: doc.reviewStatus
          })
        })
    }

    if (word) {
      const mainReading = word.japanese[0]

      handleInputChange({
        word: mainReading.word || mainReading.reading || '',
        reading: mainReading.reading || '',
        meaning: '',
        status: 1
      })
    }
  }

  return (
    <Dialog.Root onOpenChange={handleOpenChange}>
      <Dialog.Trigger asChild>{children}</Dialog.Trigger>
      <Dialog.Portal>
        <Dialog.Overlay className="fixed inset-0 bg-black bg-opacity-20" />
        <Dialog.Content className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-md grid gap-4 bg-[rgb(32,32,32)] p-6 mt-5 rounded-xl shadow-md">
          {/* Word */}
          <fieldset className="min-w-0">
            <label
              className="text-sm font-medium text-white text-opacity-50"
              htmlFor="word"
            >
              Word
            </label>

            {!word && (
              <div
                id="word"
                contentEditable="true"
                suppressContentEditableWarning
                className="w-full overflow-hidden resize-y rounded px-2.5 py-1 bg-white bg-opacity-10"
                onInput={(e) => handleInputChange({ word: e.target.innerText })}
              >
                {id && wordDocument?.word}
              </div>
            )}

            {word && (
              <ReadingsToggleGroup
                readings={word.japanese}
                handleInputChange={handleInputChange}
              />
            )}
          </fieldset>

          {/* Saved Meaning */}
          <fieldset className="">
            <label
              className="text-sm font-medium text-white text-opacity-50 whitespace-pre-wrap"
              htmlFor="meaning"
            >
              Saved Meaning
            </label>
            <div
              contentEditable="true"
              suppressContentEditableWarning
              className="w-full overflow-hidden resize-y rounded px-2.5 py-1 bg-white bg-opacity-10"
              id="meaning"
              ref={meaningRef}
              onInput={(e) =>
                handleInputChange({ meaning: e.target.innerText })
              }
            >
              {id && wordDocument?.meaning}
            </div>
          </fieldset>

          {/* Suggested Meanings */}
          {word && (
            <fieldset className="Fieldset">
              <label
                className="text-sm font-medium text-white text-opacity-50"
                htmlFor="meanings"
              >
                Suggested Meanings
              </label>

              {word.senses && (
                <>
                  {word.senses.map((meaning, index) => (
                    <button
                      key={index}
                      className="flex w-full items-center justify-between bg-slate-500 p-2 rounded"
                      onClick={() => addSuggestedMeaning(meaning)}
                    >
                      <span className="flex-1 text-left">
                        {inputs.reading +
                          ' - ' +
                          meaning.english_definitions.join(', ')}
                      </span>
                      <PlusIcon className="h-5 w-5" />
                    </button>
                  ))}
                </>
              )}
            </fieldset>
          )}

          {/* Status */}
          <fieldset className="Fieldset">
            <label
              className="text-sm font-medium text-white text-opacity-50"
              htmlFor="meanings"
            >
              Status
            </label>
            <ToggleGroup.Root
              className="flex flex-nowrap items-center gap-2"
              type="single"
              defaultValue={inputs.status.toString()}
              value={inputs.status.toString()}
              aria-label="Text alignment"
              onValueChange={(value) => {
                handleInputChange({ status: value })
              }}
            >
              {REVIEW_STATUS.map(({ status, label }) => {
                return (
                  <ToggleGroup.Item
                    key={status}
                    className="flex items-center space-x-2 whitespace-nowrap border border-white border-opacity-20 px-4 py-2 rounded hover:bg-white hover:bg-opacity-5 data-[state=on]:bg-blue-300"
                    onClick={(e) => {
                      e.currentTarget.dataset.state === 'on' &&
                        e.preventDefault()
                    }}
                    value={status}
                    aria-label={label}
                  >
                    <span className="text-xs">{label}</span>
                  </ToggleGroup.Item>
                )
              })}
            </ToggleGroup.Root>
          </fieldset>

          {/* Buttons */}
          <div className="flex justify-between py-4 shadow-[rgb(255,255,255,0.1)_0px_-1px_0px]">
            <Dialog.Close asChild>
              <button
                className="flex items-center text-sm text-white border border-white border-opacity-20 px-3 rounded-[3px] h-8 space-x-2"
                aria-label="Close"
              >
                Cancel
              </button>
            </Dialog.Close>
            <Dialog.Close asChild onClick={handleWordSave}>
              <button className="inline-flex items-center justify-center text-sm text-white bg-[rgb(35,131,226)] px-3 rounded-[3px] h-8 space-x-2">
                Save changes
              </button>
            </Dialog.Close>
          </div>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  )
}
