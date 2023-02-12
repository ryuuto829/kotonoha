import { useState, useEffect, ReactNode } from 'react'
import { useRxCollection } from 'rxdb-hooks'
import * as DropdownMenu from '@radix-ui/react-dropdown-menu'
import * as Switch from '@radix-ui/react-switch'
import {
  DotsHorizontalIcon,
  TrashIcon,
  Pencil2Icon,
  PlusIcon,
  ArchiveIcon
} from '@radix-ui/react-icons'
import CalendarDaysIcon from '@heroicons/react/24/outline/CalendarDaysIcon'
import HashtagIcon from '@heroicons/react/24/outline/HashtagIcon'
import ArrowsUpDownIcon from '@heroicons/react/24/outline/ArrowsUpDownIcon'

import AddWordDialog from '../components/AddWordDialog'
import { REVIEW_STATUS } from '../components/AddWordDialog'

const SORTING_OPTIONS = [
  {
    value: 'createdAt',
    label: 'Date created',
    icon: <CalendarDaysIcon className="h-4 w-4" />
  },
  {
    value: 'word',
    label: 'Alphabetical',
    icon: <HashtagIcon className="h-4 w-4" />
  }
]
const WORDS_LIMIT_OPTIONS = ['25', '50', '75', '100', '150', '200']

function MenuTriggerButton({
  label,
  ariaLabel,
  icon
}: {
  label?: string
  ariaLabel?: string
  icon?: ReactNode
}) {
  return (
    <DropdownMenu.Trigger
      aria-label={ariaLabel}
      className={`
      inline-flex items-center space-x-2
      p-1.5 text-base h-7 rounded-[3px]
      hover:bg-white hover:bg-opacity-5
      data-[state=open]:bg-white data-[state=open]:bg-opacity-5
      `}
    >
      {icon}
      {label && <span>{label}</span>}
    </DropdownMenu.Trigger>
  )
}

function MenuRadioItem({
  value,
  icon,
  label,
  checkedValue
}: {
  value: string
  icon?: ReactNode
  label: string
  checkedValue: string
}) {
  return (
    <DropdownMenu.RadioItem
      value={value}
      className={`
      flex items-center
      mx-1 rounded-[3px] h-7
      hover:bg-white hover:bg-opacity-10 cursor-pointer
      ${checkedValue === value ? 'text-blue-300  ' : ''}
      `}
    >
      <div className="ml-2.5 mr-1 flex items-center justify-center">{icon}</div>
      <div className="ml-1.5 mr-3 flex-1">{label}</div>
    </DropdownMenu.RadioItem>
  )
}

function SortingMenu({
  isAscending,
  sortOption,
  changeAscending,
  changeSortOption
}: {
  isAscending: boolean
  sortOption: string
  changeAscending: (value: boolean) => void
  changeSortOption: (value: string) => void
}) {
  return (
    <DropdownMenu.Root modal={false}>
      <MenuTriggerButton
        label="Sort"
        ariaLabel="Sorting options"
        icon={<ArrowsUpDownIcon className="w-4 h-4" />}
      />
      <DropdownMenu.Portal>
        <DropdownMenu.Content
          align="start"
          sideOffset={5}
          className={`
          w-[230px] py-2 rounded bg-[rgb(37,37,37)]
          text-sm text-white text-opacity-80
          `}
        >
          <form
            className={`
            flex items-center justify-between mx-1
            rounded-[3px] h-7 hover:bg-white hover:bg-opacity-10 cursor-pointer
            `}
          >
            <label
              htmlFor="ascending-mode"
              className="ml-2.5 mr-1 flex-1 cursor-pointer"
            >
              Ascending
            </label>
            <Switch.Root
              id="ascending-mode"
              checked={isAscending}
              onCheckedChange={changeAscending}
              className={`
              box-content relative
              ml-1.5 mr-3 p-0.5  w-[26px] h-[14px] rounded-full shadow-sm
              bg-[rgba(202,204,206,0.3)] data-[state=checked]:bg-[rgb(35,131,226)]
              `}
            >
              <Switch.Thumb
                className={`
                block w-3.5 h-3.5 bg-white rounded-full shadow-sm
                translate-x-0 data-[state=checked]:translate-x-[12px]
                `}
              />
            </Switch.Root>
          </form>

          <DropdownMenu.Separator className="my-2 h-[1px] bg-white bg-opacity-20" />

          <DropdownMenu.RadioGroup
            value={sortOption}
            onValueChange={changeSortOption}
          >
            {SORTING_OPTIONS.map((option) => (
              <MenuRadioItem
                key={option.value}
                value={option.value}
                icon={option.icon}
                label={option.label}
                checkedValue={sortOption}
              />
            ))}
          </DropdownMenu.RadioGroup>
        </DropdownMenu.Content>
      </DropdownMenu.Portal>
    </DropdownMenu.Root>
  )
}

function ShowWordsMenu({
  wordsNumber,
  changeOffset,
  changeWordsNumber
}: {
  wordsNumber: string
  changeOffset: (value: number) => void
  changeWordsNumber: (value: string) => void
}) {
  return (
    <DropdownMenu.Root modal={false}>
      <MenuTriggerButton
        label={`Show: ${wordsNumber}`}
        ariaLabel="Show words"
      />

      <DropdownMenu.Portal>
        <DropdownMenu.Content
          align="start"
          sideOffset={5}
          className={`
          w-[230px] py-2 rounded bg-[rgb(37,37,37)]
          text-sm text-white text-opacity-80
          `}
        >
          <DropdownMenu.RadioGroup
            value={wordsNumber}
            onValueChange={(value) => {
              changeOffset(0)
              changeWordsNumber(value)
            }}
          >
            {WORDS_LIMIT_OPTIONS.map((option) => (
              <MenuRadioItem
                key={option}
                value={option}
                label={option}
                checkedValue={wordsNumber}
              />
            ))}
          </DropdownMenu.RadioGroup>
        </DropdownMenu.Content>
      </DropdownMenu.Portal>
    </DropdownMenu.Root>
  )
}

function MoreOptionsMenu({ deleteWord, doc }) {
  return (
    <DropdownMenu.Root modal={false}>
      <MenuTriggerButton
        ariaLabel="More options"
        icon={<DotsHorizontalIcon className="w-5 h-5" />}
      />
      <DropdownMenu.Portal>
        <DropdownMenu.Content
          align="end"
          sideOffset={5}
          className={`
          w-[230px] py-2 rounded bg-[rgb(37,37,37)]
          text-sm text-white text-opacity-80
          `}
        >
          <AddWordDialog id={doc.id}>
            <div className="mx-1 rounded-[3px] h-7 flex items-center hover:bg-white hover:bg-opacity-10 cursor-pointer">
              <div className="ml-2.5 mr-1 flex items-center justify-center">
                <Pencil2Icon className="w-4 h-4" />
              </div>
              <div className="ml-1.5 mr-3">Edit</div>
            </div>
          </AddWordDialog>
          <div
            className={`
            flex items-center
            mx-1 rounded-[3px] h-7
           hover:bg-white hover:bg-opacity-10 cursor-pointer
            `}
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

function VocabularyList({ wordDocuments, deleteWord }) {
  return (
    <div className="flex flex-col space-y-2 border-y border-white border-opacity-20 divide-y divide-white divide-opacity-20">
      <div className="grid grid-cols-[1fr_1fr_100px_50px] gap-2 px-2">
        <div>Word</div>
        <div>Meaning</div>
        <div>Status</div>
      </div>
      {wordDocuments &&
        wordDocuments.map((doc) => (
          <div
            key={doc.id}
            className="grid grid-cols-[1fr_1fr_100px_50px] gap-2 px-2 py-4"
          >
            <div className="text-lg">{doc.word}</div>
            <div className="text-sm">{doc.meaning}</div>
            <div>
              {REVIEW_STATUS.filter(
                (el) => el.status === doc.reviewStatus?.toString()
              ).map((el) => (
                <div
                  key={el.label}
                  className="inline-flex items-center space-x-2"
                >
                  {el.icon}
                  <span className="text-xs">{el.label}</span>
                </div>
              ))}
            </div>
            <div>
              <MoreOptionsMenu deleteWord={deleteWord} doc={doc} />
            </div>
          </div>
        ))}
    </div>
  )
}

export default function Vocabulary() {
  const wordsCollection = useRxCollection('words')

  const [wordDocuments, setWordDocuments] = useState()
  const [showWords, setShowWords] = useState('25')
  const [sortOption, setSortOption] = useState('createdAt')
  const [isAscending, setIsAscending] = useState(false)
  const [wordDocumentsOffset, setWordDocumentsOffset] = useState(0)
  const [wordDocumentsCount, setWordDocumentsCount] = useState(0)

  useEffect(() => {
    let querySub: any

    if (wordsCollection) {
      const query = wordsCollection
        .find()
        .sort({ [sortOption]: isAscending ? 1 : -1 })
        .skip(wordDocumentsOffset)
        .limit(Number(showWords))

      querySub = query.$.subscribe((results) => {
        console.log(results)

        wordsCollection.count().exec().then(setWordDocumentsCount)
        setWordDocuments(results)
      })
    }

    return () => querySub?.unsubscribe()
  }, [wordsCollection, sortOption, isAscending, showWords, wordDocumentsOffset])

  const deleteWord = async (id) => {
    const wordDocument = wordsCollection?.findOne(id)

    await wordDocument?.remove()
    console.log('DatabaseService: delete doc')
  }

  return (
    <>
      {/* Tabs, add & review */}
      <div className="border-b border-white border-opacity-20 flex items-center justify-between">
        <div className="flex items-center">
          <div className="py-3 relative">
            <div className="inline-flex items-center h-7 rounded px-2">All</div>
            <div className="absolute border-b-2 border-white border-opacity-80 px-2 left-2 right-2 bottom-0"></div>
          </div>
          <div className="py-3 relative">
            <div className="inline-flex items-center h-7 rounded px-2">
              Due for SRS
            </div>
            <div className="absolute border-b-2 border-white border-opacity-80 px-2 left-2 right-2 bottom-0"></div>
          </div>
        </div>

        <div className="flex items-center space-x-2">
          <AddWordDialog>
            <button className="flex items-center text-white border border-white border-opacity-20 px-3 rounded-[3px] h-8 space-x-2">
              <PlusIcon className="w-4 h-4" />
              <span>Add word</span>
            </button>
          </AddWordDialog>
          <button className="flex items-center text-white bg-[rgb(35,131,226)] px-3 rounded-[3px] h-8 space-x-2">
            <ArchiveIcon className="w-4 h-4" />
            <span>Review</span>
          </button>
        </div>
      </div>

      {/* Sort, filter & search */}
      <div className="flex items-center space-x-2 py-2">
        <SortingMenu
          isAscending={isAscending}
          changeAscending={setIsAscending}
          sortOption={sortOption}
          changeSortOption={setSortOption}
        />
        <ShowWordsMenu
          wordsNumber={showWords}
          changeOffset={setWordDocumentsOffset}
          changeWordsNumber={setShowWords}
        />
      </div>

      <VocabularyList wordDocuments={wordDocuments} deleteWord={deleteWord} />

      <div>
        <button
          onClick={() => {
            const count = wordDocumentsOffset - Number(showWords)

            if (count >= 0) {
              setWordDocumentsOffset(count)
            }
          }}
        >
          Prev page
        </button>
        <button
          onClick={() => {
            const count = wordDocumentsOffset + Number(showWords)

            if (count <= wordDocumentsCount) {
              setWordDocumentsOffset(count)
            }
          }}
        >
          Next page
        </button>
        <div>{`Showing ${wordDocumentsOffset + 1}-${
          wordDocumentsOffset + (wordDocuments?.length || 0)
        } of ${wordDocumentsCount} Entries`}</div>
      </div>
    </>
  )
}
