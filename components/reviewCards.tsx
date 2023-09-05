import shuffle from 'lodash/shuffle'
import { useState } from 'react'

export default function ReviewCards({ cards, type }) {
  const [indexes, setIndexes] = useState(
    shuffle([...Array.from(Array(cards.length).keys())])
  )
  const [showAnswer, setShowAnswer] = useState(false)
  const [current, setCurrent] = useState(0)
  const [completed, setCompleted] = useState(false)

  console.log(indexes)

  // const skipCard = () => {
  //   const array = [...indexes]
  //   array.push(array.shift())
  //   setIndexes(array)
  // }

  const nextCard = () => {
    if (current === cards.length - 1) {
      setCompleted(true)
    }
    setCurrent(current + 1)
    setShowAnswer(false)
  }

  const previousCard = () => {
    if (current === 0) return
    setCurrent(current - 1)
    setShowAnswer(false)
  }

  const stillLearning = () => {
    if (indexes.length === 1) return
    const [first, ...rest] = indexes
    setIndexes([...rest, first])
    setShowAnswer(false)
  }

  const learned = () => {
    if (indexes.length === 1) {
      setCompleted(true)
    }

    const array = [...indexes]
    array.shift()
    setIndexes(array)
    setCurrent(current + 1)
    setShowAnswer(false)
  }

  const checkCard = async (isCorrect: boolean) => {
    if (indexes.length === 1) {
      setCompleted(true)
    }

    const doc = cards[indexes[0]]

    await doc.incrementalModify((data) => {
      data.reviews.push({
        date: Date.now(),
        remembered: isCorrect
      })

      return data
    })

    const array = [...indexes]
    array.shift()
    setIndexes(array)
    setCurrent(current + 1)
    setShowAnswer(false)
  }

  if (type === 'flashcards') {
    return (
      <div className="border border-white/10 p-4 flex flex-col gap-8">
        <div>
          {current} / {cards.length}
        </div>

        {completed && <div>You’ve reviewed all the cards.</div>}

        {!completed && <div>{indexes && cards[indexes[current]].term}</div>}

        {showAnswer && !completed && (
          <div>{cards[indexes[current]].meaning}</div>
        )}

        {!completed && (
          <div className="flex gap-2">
            <button onClick={() => setShowAnswer(!showAnswer)}>Flip</button>
            <button onClick={nextCard}>Next</button>
            <button onClick={previousCard}>Previous</button>
            <div>|</div>
            <button>Shuffle</button>
            <button>Reverse</button>
          </div>
        )}
      </div>
    )
  }

  if (type === 'learn') {
    return (
      <div className="border border-white/10 p-4 flex flex-col gap-8">
        <div>
          {current} / {cards.length}
        </div>

        {completed && <div>You’ve reviewed all the cards.</div>}

        {!completed && <div>{indexes && cards[indexes[0]].term}</div>}

        {showAnswer && !completed && <div>{cards[indexes[0]].meaning}</div>}

        {!completed && (
          <div className="flex gap-2">
            <button onClick={() => setShowAnswer(!showAnswer)}>Flip</button>
            <button onClick={stillLearning}>Still_learning</button>
            <button onClick={learned}>Known</button>
            <div>|</div>
            <button>Shuffle</button>
            <button>Reverse</button>
          </div>
        )}
      </div>
    )
  }

  if (type === 'test') {
    return (
      <div className="border border-white/10 p-4 flex flex-col gap-8">
        <div>
          {current} / {cards.length}
        </div>

        {completed && <div>You’ve reviewed all the cards.</div>}

        {!completed && <div>{indexes && cards[indexes[0]].term}</div>}

        {showAnswer && !completed && <div>{cards[indexes[0]].meaning}</div>}

        {!completed && (
          <div className="flex gap-2">
            <button onClick={() => setShowAnswer(!showAnswer)}>Flip</button>
            <button onClick={() => checkCard(false)}>Forgot</button>
            <button onClick={() => checkCard(true)}>Remembered</button>
            <div>|</div>
            <button>Shuffle</button>
            <button>Reverse</button>
          </div>
        )}
      </div>
    )
  }

  if (type === 'match') {
    return (
      <div className="border border-white/10 p-4 flex flex-col gap-8">
        <div>
          {current} / {cards.length}
        </div>

        {completed && <div>You’ve reviewed all the cards.</div>}

        {!completed && (
          <div className="flex gap-2">
            <div className="flex flex-col">
              <button>{indexes && cards[indexes[0]].term}</button>
              <button>{indexes && cards[indexes[1]].term}</button>
            </div>
            <div className="flex flex-col">
              <button>{indexes && cards[indexes[0]].meaning}</button>
              <button>{indexes && cards[indexes[1]].meaning}</button>
            </div>
          </div>
        )}
      </div>
    )
  }
}
