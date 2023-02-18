import { useState } from 'react'
import Link from 'next/link'
import {
  ArrowRightIcon,
  ReloadIcon,
  Cross1Icon,
  CheckIcon,
  ArrowDownIcon
} from '@radix-ui/react-icons'
import * as Progress from '@radix-ui/react-progress'

import type { WordDocType } from '../lib/types'
import { updateCardReview } from '../lib/words'

function getInitialIndexes(length: number) {
  return [...Array.from(Array(length).keys())]
}

function moveCardToEnd({
  documentIndexes,
  progress
}: {
  documentIndexes: number[]
  progress: number
}) {
  const indexes = [...documentIndexes]

  // push to the end of the stack
  const [currentIndex] = indexes.splice(progress, 1)
  indexes.push(currentIndex)

  return indexes
}

export default function Review({
  wordDocuments,
  srs
}: {
  wordDocuments: WordDocType[]
  srs: string
}) {
  const [progress, setProgress] = useState(0)
  const [documentIndexes, setDocumentIndexes] = useState(
    getInitialIndexes(wordDocuments.length)
  )
  const [showCardBack, setShowCardBack] = useState(false)

  const skipCard = () => {
    setShowCardBack(false)
    setProgress(progress + 1)
  }

  const flipCard = () => {
    setShowCardBack(true)
  }

  const reviewCardAgain = () => {
    setDocumentIndexes(moveCardToEnd({ documentIndexes, progress }))
    setShowCardBack(false)
  }

  const forgetCard = async () => {
    await updateCardReview({
      document: wordDocuments[documentIndexes[progress]],
      srs,
      success: false
    })

    setShowCardBack(false)
    setProgress(progress + 1)
  }

  const rememberCard = async () => {
    await updateCardReview({
      document: wordDocuments[documentIndexes[progress]],
      srs,
      success: true
    })

    setShowCardBack(false)
    setProgress(progress + 1)
  }

  return (
    <div className="relative h-full">
      {/* Progress bar */}
      <div className="flex items-center justify-end">{`${progress} / ${documentIndexes.length}`}</div>
      <Progress.Root
        className="relative overflow-hidden bg-black rounded-full w-full h-2"
        value={progress}
        max={documentIndexes.length || 0}
      >
        <Progress.Indicator
          className="bg-white w-full h-full transition"
          style={{
            transform: `translateX(-${
              100 - (100 / documentIndexes.length) * progress
            }%)`
          }}
        />
      </Progress.Root>

      {/* Card content */}
      {progress < documentIndexes.length && documentIndexes && (
        <div className="h-full flex flex-col items-center gap-5">
          <div className="h-[calc((100vh-600px)*.3)]"></div>
          <div className="text-lg p-7">
            {wordDocuments[documentIndexes[progress]].word}
          </div>
          <div className={`p-7 ${showCardBack ? '' : 'invisible'}`}>
            {wordDocuments[documentIndexes[progress]].meaning}
          </div>
        </div>
      )}

      {progress === documentIndexes.length && (
        <>
          <div>No more cards left.</div>
          <Link href="/vocabulary/all">Back to vocab</Link>
        </>
      )}

      {/* Controls */}
      {progress !== documentIndexes.length && (
        <div className="flex items-center absolute bottom-0 w-full h-9">
          <div className="flex items-center space-x-2 z-20">
            <button
              className="inline-flex items-center space-x-2"
              onClick={skipCard}
            >
              <span>Skip</span>
              <ArrowRightIcon className="w-5 h-5" />
            </button>
            <button
              className="inline-flex items-center space-x-2"
              onClick={reviewCardAgain}
            >
              <span>Again</span>
              <ReloadIcon className="w-5 h-5" />
            </button>
          </div>

          <div className="flex justify-center w-full -ml-[135px] space-x-4">
            {!showCardBack && (
              <button
                className="inline-flex items-center space-x-2 rounded-full h-9 px-4 bg-[#f1f1f1] text-[#0f0f0f]"
                onClick={flipCard}
              >
                <ArrowDownIcon className="w-5 h-5" />
                <span>Show meaning</span>
              </button>
            )}

            {srs === 'srs' && showCardBack && (
              <button
                className="inline-flex items-center space-x-2 rounded-full h-9 px-4 bg-white/10 text-[#f1f1f1]"
                onClick={forgetCard}
              >
                <Cross1Icon className="w-5 h-5" />
                <span>Forgot</span>
              </button>
            )}

            {showCardBack && (
              <button
                className="inline-flex items-center space-x-2 rounded-full h-9 px-4 bg-[#f1f1f1] text-[#0f0f0f]"
                onClick={rememberCard}
              >
                <CheckIcon className="w-5 h-5" />
                <span>Remembered</span>
              </button>
            )}
          </div>
        </div>
      )}
    </div>
  )
}
