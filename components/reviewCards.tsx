import { useEffect, useState } from 'react'
import shuffle from 'lodash/shuffle'
import { Card } from 'lib/card.schema'

function Progress({ current, total }: { current: number; total: number }) {
  return (
    <div>
      {current} / {total}
    </div>
  )
}

function Complete() {
  return <div>You’ve reviewed all the cards.</div>
}

function Card({ term, meaning, showAnswer }) {
  return (
    <div>
      <div>{term}</div>
      <div className={`${showAnswer ? 'block' : 'hidden'}`}>{meaning}</div>
    </div>
  )
}

export function Flashcards({
  cards,
  close
}: {
  cards: Card[]
  close: () => void
}) {
  const [collection, setCollection] = useState(cards)
  const [shuffled, setShuffled] = useState(false)
  const [progress, setProgress] = useState(0)
  const [showAnswer, setShowAnswer] = useState(false)
  const [completed, setCompleted] = useState(false)

  const toggleShuffle = () => {
    setCollection(shuffled ? cards : shuffle(cards))
    setShuffled(!shuffled)
  }

  const toggleShowAnswer = () => {
    setShowAnswer(!showAnswer)
  }

  const nextCard = () => {
    if (progress === collection.length - 1) {
      setCompleted(true)
    }

    setProgress(progress + 1)
    setShowAnswer(false)
  }

  const previousCard = () => {
    if (progress === 0) return

    setProgress(progress - 1)
    setShowAnswer(false)
  }

  return (
    <div className="flex flex-col gap-8">
      <h2>Review page</h2>
      <button onClick={close}>Back</button>
      <div className="border border-white/10 p-4 flex flex-col gap-8">
        <Progress current={progress} total={collection.length} />
        {completed ? (
          <Complete />
        ) : (
          <div>
            <Card
              showAnswer={showAnswer}
              term={collection[progress]?.term}
              meaning={collection[progress]?.meaning}
            />
            <div className="flex gap-2">
              <button onClick={toggleShowAnswer}>Flip</button>
              <button onClick={nextCard}>Next</button>
              <button onClick={previousCard}>Previous</button>
              <div>|</div>
              <button onClick={toggleShuffle}>
                Shuffle = {shuffled ? 'ON' : 'OFF'}
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

export default function ReviewCards({
  cards,
  type
}: {
  cards: Card[]
  type: 'flashcards' | 'learn' | 'test' | 'match'
}) {
  const [indexes, setIndexes] = useState(
    shuffle([...Array.from(Array(cards.length).keys())])
  )
  const [showAnswer, setShowAnswer] = useState(false)
  const [current, setCurrent] = useState(0)
  const [completed, setCompleted] = useState(false)

  const toggleShowAnswer = () => {
    setShowAnswer(!showAnswer)
  }

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

  // if (type === 'flashcards') {
  //   return (
  //     <div className="border border-white/10 p-4 flex flex-col gap-8">
  //       <Progress current={current} total={cards.length} />
  //       {completed ? (
  //         <Complete />
  //       ) : (
  //         <div>
  //           <Card
  //             showAnswer={showAnswer}
  //             term={indexes && cards[indexes[current]].term}
  //             meaning={cards[indexes[current]].meaning}
  //           />
  //           <Controls
  //             nextCard={nextCard}
  //             previousCard={previousCard}
  //             toggleShowAnswer={toggleShowAnswer}
  //           />
  //         </div>
  //       )}
  //     </div>
  //   )
  // }

  if (type === 'learn') {
    return (
      <div className="border border-white/10 p-4 flex flex-col gap-8">
        <Progress current={current} total={cards.length} />
        {completed && <Complete />}

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
        <Progress current={current} total={cards.length} />
        {completed && <Complete />}

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
}
