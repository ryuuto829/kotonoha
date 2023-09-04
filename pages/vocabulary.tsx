import { useState } from 'react'
import { useRxData } from 'rxdb-hooks'
import ReviewCards from '../components/reviewCards'
import { CardDocument } from 'lib/types'

export default function Vocabulary() {
  const { result: cards } = useRxData<CardDocument>('cards', (collection) =>
    collection.find().sort({ created_at: -1 })
  )

  const [review, setReview] = useState(false)

  const removeCard = async (id: string) => {
    await cards.find((card) => card.id === id)?.remove()
  }

  if (review) {
    return (
      <div>
        <div>Review page</div>
        <button onClick={() => setReview(false)}>Back</button>
        <ReviewCards cards={cards} />
      </div>
    )
  }

  return (
    <div>
      <h1 className="mb-8">Vocabulary list. Results: {cards.length}</h1>
      <div className="mb-8">
        <button onClick={() => setReview(true)}>REVIEW</button>
      </div>
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
  )
}
