import { useState } from 'react'
import { useRxData } from 'rxdb-hooks'
import ReviewCards from '../components/reviewCards'

export default function Vocabulary() {
  const { result: cards } = useRxData('cards', (collection) =>
    collection.find().sort({ created_at: -1 })
  )

  const [reviewType, setReviewType] = useState(null)

  const removeCard = async (id: string) => {
    await cards.find((card) => card.id === id)?.remove()
  }

  if (reviewType) {
    return (
      <div className="flex flex-col gap-8">
        <h2>Review page</h2>
        <button onClick={() => setReviewType(null)}>Back</button>
        <ReviewCards cards={cards} type={reviewType} />
      </div>
    )
  }

  return (
    <div className="flex flex-col gap-8">
      <h2>Vocabulary list. Results: {cards.length}</h2>
      <div className="flex gap-4 border border-white/10 p-4">
        <button onClick={() => setReviewType('flashcards')}>Flashcards</button>
        <button onClick={() => setReviewType('learn')}>Learn</button>
        <button onClick={() => setReviewType('test')}>Test</button>
        <button onClick={() => setReviewType('match')}>Match</button>
      </div>
      <div>
        {cards.map((card) => {
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
