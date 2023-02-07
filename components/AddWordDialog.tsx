import { useRef, useState } from 'react'
import * as Dialog from '@radix-ui/react-dialog'
import * as ToggleGroup from '@radix-ui/react-toggle-group'
import type { WordResult } from '../lib/types'
import PlusIcon from '@heroicons/react/24/outline/PlusIcon'
import * as ScrollArea from '@radix-ui/react-scroll-area'

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

export default function AddWordDialog({ word }: { word: WordResult }) {
  const [mainReading, ...otherReadings] = word.japanese

  const initialInputsValues = word
    ? {
        word: mainReading.word || mainReading.reading || '',
        reading: mainReading.reading || '',
        meaning: ''
      }
    : {
        word: '',
        meaning: ''
      }

  const [inputs, setInputs] = useState(initialInputsValues)

  const meaningRef = useRef(null)

  const handleInputChange = (word) => {
    console.log(word)
    setInputs({ ...inputs, ...word })
  }

  const addSuggestedMeaning = (meaning) => {
    meaningRef.current.textContent =
      inputs.reading + ' - ' + meaning.english_definitions.join(', ')
  }

  return (
    <Dialog.Root>
      <Dialog.Trigger asChild>
        <button className="Button violet" size="large">
          Add word
        </button>
      </Dialog.Trigger>
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
                contentEditable="true"
                suppressContentEditableWarning
                className="w-full overflow-hidden resize-y"
                id="word"
                onInput={(e) =>
                  handleInputChange({ reading: e.target.innerText })
                }
              >
                {mainReading.word || ''}
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
              className="w-full overflow-hidden resize-y"
              id="meaning"
              ref={meaningRef}
              onInput={(e) =>
                handleInputChange({ meaning: e.target.innerText })
              }
            ></div>
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

          <div>Deck names ...</div>
          <div
            style={{
              display: 'flex',
              marginTop: 25,
              justifyContent: 'flex-end'
            }}
          >
            <Dialog.Close asChild>
              <button className="Button green">Save changes</button>
            </Dialog.Close>
          </div>
          <Dialog.Close asChild>
            <button className="IconButton" aria-label="Close">
              close
            </button>
          </Dialog.Close>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  )
}
