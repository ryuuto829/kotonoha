import { useRxCollection } from 'rxdb-hooks'
import { useState, useEffect } from 'react'

import AddWordDialog from '../components/AddWordDialog'

export default function Vocabulary() {
  const wordsCollection = useRxCollection('words')
  const [wordList, setWordList] = useState([])

  useEffect(() => {
    let querySub: any

    if (wordsCollection) {
      const query = wordsCollection.find()

      querySub = query.$.subscribe((results) => {
        setWordList(results)
      })
    }

    return () => {
      querySub?.unsubscribe()
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
      <div></div>

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
    </>
  )
}
