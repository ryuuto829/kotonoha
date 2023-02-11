import { useRxCollection } from 'rxdb-hooks'
import { useState, useEffect } from 'react'
import * as DropdownMenu from '@radix-ui/react-dropdown-menu'
import * as Switch from '@radix-ui/react-switch'

import CalendarDaysIcon from '@heroicons/react/24/outline/CalendarDaysIcon'
import HashtagIcon from '@heroicons/react/24/outline/HashtagIcon'

import AddWordDialog from '../components/AddWordDialog'

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

export default function Vocabulary() {
  const wordsCollection = useRxCollection('words')
  const [wordList, setWordList] = useState([])
  const [sortOption, setSortOption] = useState('createdAt')
  const [isAscending, setIsAscending] = useState(false)
  const [showWordsNumber, setShowWordsNumber] = useState('25')
  const [loadMore, setLoadMore] = useState(0)
  const [docsCount, setDocsCount] = useState(0)

  useEffect(() => {
    let querySub: any

    if (wordsCollection) {
      const query = wordsCollection
        .find()
        .sort({ [sortOption]: isAscending ? 1 : -1 })
        .skip(loadMore)
        .limit(Number(showWordsNumber))

      querySub = query.$.subscribe((results) => {
        console.log(results)
        setWordList(results)
      })
    }

    return () => {
      querySub?.unsubscribe()
    }
  }, [wordsCollection, sortOption, isAscending, showWordsNumber, loadMore])

  useEffect(() => {
    if (wordsCollection) {
      wordsCollection.count().exec().then(setDocsCount)
    }
  }, [wordsCollection])

  const deleteWord = async (id) => {
    const wordDocument = wordsCollection?.findOne(id)

    await wordDocument?.remove()
    console.log('DatabaseService: delete doc')
  }

  return (
    <>
      {/* Tabs, add & review */}
      <div>
        <AddWordDialog>
          <button>Add word</button>
        </AddWordDialog>{' '}
        <button>Review</button>
      </div>

      {/* Sort, filter & search */}
      <DropdownMenu.Root>
        <DropdownMenu.Trigger asChild>
          <button className="IconButton" aria-label="Customise options">
            Sort
          </button>
        </DropdownMenu.Trigger>

        <DropdownMenu.Portal>
          <DropdownMenu.Content
            className="w-[230px] bg-[rgb(37,37,37)] py-2 text-sm text-white text-opacity-80 rounded"
            align="start"
            sideOffset={5}
          >
            <form className="mx-1 rounded-[3px] h-7 flex items-center justify-between hover:bg-white hover:bg-opacity-10 cursor-pointer">
              <label
                className="ml-2.5 mr-1 flex-1 cursor-pointer"
                htmlFor="ascending-mode"
              >
                Ascending
              </label>
              <Switch.Root
                id="ascending-mode"
                checked={isAscending}
                onCheckedChange={setIsAscending}
                className="ml-1.5 mr-3 p-0.5 box-content w-[26px] h-[14px] bg-[rgba(202,204,206,0.3)] rounded-full relative shadow-sm data-[state=checked]:bg-[rgb(35,131,226)]"
              >
                <Switch.Thumb className="block w-3.5 h-3.5 bg-white rounded-full shadow-sm translate-x-0 data-[state=checked]:translate-x-[12px]" />
              </Switch.Root>
            </form>

            <DropdownMenu.Separator className="my-2 h-[1px] bg-white bg-opacity-20" />

            <DropdownMenu.RadioGroup
              value={sortOption}
              onValueChange={setSortOption}
            >
              {SORTING_OPTIONS.map((option) => {
                return (
                  <DropdownMenu.RadioItem
                    key={option.value}
                    className={`mx-1 rounded-[3px] h-7 flex items-center hover:bg-white hover:bg-opacity-10 cursor-pointer ${
                      sortOption === option.value ? 'text-blue-300  ' : ''
                    }`}
                    value={option.value}
                  >
                    <div className="ml-2.5 mr-1 flex items-center justify-center">
                      {option.icon}
                    </div>
                    <div className="ml-1.5 mr-3 flex-1">{option.label}</div>
                  </DropdownMenu.RadioItem>
                )
              })}
            </DropdownMenu.RadioGroup>

            <DropdownMenu.Arrow className="DropdownMenuArrow" />
          </DropdownMenu.Content>
        </DropdownMenu.Portal>
      </DropdownMenu.Root>

      <DropdownMenu.Root>
        <DropdownMenu.Trigger asChild>
          <button className="IconButton" aria-label="Customise options">
            {`Show: ${showWordsNumber}`}
          </button>
        </DropdownMenu.Trigger>

        <DropdownMenu.Portal>
          <DropdownMenu.Content
            className="w-[230px] bg-[rgb(37,37,37)] py-2 text-sm text-white text-opacity-80 rounded"
            align="start"
            sideOffset={5}
          >
            <DropdownMenu.RadioGroup
              value={showWordsNumber}
              onValueChange={(value) => {
                setLoadMore(0)
                setShowWordsNumber(value)
              }}
            >
              {WORDS_LIMIT_OPTIONS.map((option) => {
                return (
                  <DropdownMenu.RadioItem
                    key={option}
                    className={`mx-1 rounded-[3px] h-7 flex items-center hover:bg-white hover:bg-opacity-10 cursor-pointer ${
                      showWordsNumber === option ? 'text-blue-300  ' : ''
                    }`}
                    value={option}
                  >
                    <div className="ml-1.5 mr-3 flex-1">{option}</div>
                  </DropdownMenu.RadioItem>
                )
              })}
            </DropdownMenu.RadioGroup>

            <DropdownMenu.Arrow className="DropdownMenuArrow" />
          </DropdownMenu.Content>
        </DropdownMenu.Portal>
      </DropdownMenu.Root>

      {/* Words */}
      <div className="flex flex-col space-y-2">
        <div className="grid grid-cols-3 gap-2 border border-gray-300">
          <div>Word</div>
          <div>Meaning</div>
          <div>Status</div>
        </div>
        {wordList.length > 0 &&
          wordList.map((doc, index) => (
            <div
              key={index}
              className="grid grid-cols-3 gap-2 border border-gray-300 px-2 py-4"
            >
              <div className="text-lg">{doc.word}</div>
              <div className="text-sm">{doc.meaning}</div>
              <div>
                <button onClick={() => deleteWord(doc.id)}>Delete</button>{' '}
                <AddWordDialog id={doc.id}>
                  <button>Edit</button>
                </AddWordDialog>
              </div>
            </div>
          ))}
      </div>

      {/* Load More */}
      <button
        onClick={() => {
          const count = loadMore - Number(showWordsNumber)

          if (count >= 0) {
            setLoadMore(count)
          }
        }}
      >
        Prev page
      </button>
      <button
        onClick={() => {
          const count = loadMore + Number(showWordsNumber)

          if (count <= docsCount) {
            setLoadMore(count)
          }
        }}
      >
        Next page
      </button>

      <div>{`Showing ${loadMore + 1}-${
        loadMore + wordList.length
      } of ${docsCount} Entries`}</div>
    </>
  )
}
