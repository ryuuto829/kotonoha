import { useState } from 'react'
import { useRxData } from 'rxdb-hooks'

import { Flashcards } from 'components/reviewCards'
import type { Card } from 'lib/card.schema'

export default function VocabularyPage() {
  const { result: cards } = useRxData<Card>('cards', (collection) =>
    collection.find().sort({ created_at: 'asc' })
  )

  const [reviewType, setReviewType] = useState<string | null>(null)

  console.log(cards && cards.map((card) => card._data))

  const removeCard = async (id: string) => {
    await cards.find((card) => card.id === id)?.remove()
  }

  const closeReview = () => {
    setReviewType(null)
  }

  if (reviewType === 'flashcards') {
    return <Flashcards cards={cards} close={closeReview} />
  }

  // if (reviewType) {
  //   return (
  //     <div className="flex flex-col gap-8">
  //       <h2>Review page</h2>
  //       <button onClick={() => setReviewType(null)}>Back</button>
  //       <ReviewCards cards={cards} type={reviewType} />
  //     </div>
  //   )
  // }

  return (
    <div className="flex flex-col gap-8">
      <h2>Vocabulary list. Results: {cards.length}</h2>
      <div className="flex gap-4 border border-white/10 p-4">
        <button onClick={() => setReviewType('flashcards')}>Flashcards</button>
        <button onClick={() => setReviewType('learn')}>Learn</button>
        <button onClick={() => setReviewType('test')}>Test</button>
      </div>
      <div>
        {cards &&
          cards.map((card) => {
            return (
              <div key={card.id} className="grid grid-cols-3 gap-2">
                <div>{card.term}</div>
                <div>{card.meaning}</div>
                <div>
                  <button onClick={() => removeCard(card.id)}>Delete</button>
                </div>
              </div>
            )
          })}
      </div>
    </div>
  )
}
