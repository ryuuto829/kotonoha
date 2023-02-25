import { useState, useEffect } from 'react'
import Link from 'next/link'
import * as Progress from '@radix-ui/react-progress'
import {
  ArrowRightIcon,
  ReloadIcon,
  Cross1Icon,
  CheckIcon,
  ArrowDownIcon
} from '@radix-ui/react-icons'

import shuffle from 'lodash/shuffle'

import type { WordDocType } from '../lib/types'
import { updateCardReview } from '../lib/words'
import Tooltip from '../components/Tooltip'

/**
 * Generate a collection of document indexes
 * and then shuffle its values
 */
function getInitialIndexes(length: number) {
  return shuffle([...Array.from(Array(length).keys())])
}

/**
 * Move the current element to the end of the collection
 */
function shiftIndexes(indexes: number[], current: number) {
  const shiftedIndexes = [...indexes]
  const [currentIndex] = shiftedIndexes.splice(current, 1)
  shiftedIndexes.push(currentIndex)

  return shiftedIndexes
}

export default function Review({
  cards,
  srs
}: {
  cards: WordDocType[]
  srs: string
}) {
  const [indexes, setIndexes] = useState(getInitialIndexes(cards.length))

  const [progress, setProgress] = useState(0)
  const [back, setBack] = useState(false)

  const [skipped, setSkipped] = useState(0)
  const [remembered, setRemembered] = useState(0)
  const [forget, setForget] = useState(0)

  const handleKeydown = async ({ key }: { key: string }) => {
    if (key === ' ' && back) {
      await rememberCard()
    }

    if (key === ' ' && !back) {
      flipCard()
    }

    if (key === 'ArrowRight') {
      skipCard()
    }

    if (key === 'r') {
      reviewCardAgain()
    }

    if (key === 'f') {
      forgetCard()
    }
  }

  useEffect(() => {
    if (progress !== indexes.length) {
      window.addEventListener('keydown', handleKeydown)
    }

    return () => {
      window.removeEventListener('keydown', handleKeydown)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [back, progress, indexes])

  const skipCard = () => {
    setBack(false)
    setProgress(progress + 1)
    setSkipped(skipped + 1)
  }

  const flipCard = () => {
    setBack(true)
  }

  const reviewCardAgain = () => {
    setIndexes(shiftIndexes(indexes, progress))
    setBack(false)
  }

  const forgetCard = async () => {
    await updateCardReview({
      document: cards[indexes[progress]],
      srs,
      success: false
    })

    setBack(false)
    setProgress(progress + 1)
    setForget(forget + 1)
  }

  const rememberCard = async () => {
    await updateCardReview({
      document: cards[indexes[progress]],
      srs,
      success: true
    })

    setBack(false)
    setProgress(progress + 1)
    setRemembered(remembered + 1)
  }

  return (
    <div className="relative h-full flex flex-col space-y-2">
      {/* Progress */}
      <div className="flex justify-end space-x-2 text-sm text-white/60 font-medium">
        <span className="text-white/80">{progress}</span>
        <span>/</span>
        <span>{indexes.length}</span>
      </div>

      <Progress.Root
        className="relative overflow-hidden bg-white/20 rounded-full w-full h-2"
        value={progress}
        max={indexes.length || 0}
      >
        <Progress.Indicator
          className="bg-white/80 w-full h-full transition"
          style={{
            transform: `translateX(-${
              100 - (100 / indexes.length) * progress
            }%)`
          }}
        />
      </Progress.Root>

      {/* Card content */}
      {progress < indexes.length && (
        <div className="h-full flex flex-col items-center gap-8 px-2">
          <div className="h-[calc((100vh-600px)*0.3)]"></div>
          <div className="text-3xl">{cards[indexes[progress]]?.word}</div>
          <div className={`${back ? '' : 'invisible'}`}>
            {cards[indexes[progress]]?.meaning}
          </div>
        </div>
      )}

      {/* Controls */}
      {progress !== indexes.length && (
        <div className="flex items-center absolute bottom-0 w-full h-9">
          <div className="flex items-center space-x-2 z-20">
            <Tooltip content="Skip to next card" keyBinding="→">
              <button
                className="inline-flex items-center space-x-2"
                onClick={skipCard}
              >
                <span>Skip</span>
                <ArrowRightIcon className="w-4 h-4" />
              </button>
            </Tooltip>
            <Tooltip content="Review this card again later" keyBinding="R">
              <button
                className="inline-flex items-center space-x-2"
                onClick={reviewCardAgain}
              >
                <span>Again</span>
                <ReloadIcon className="w-4 h-4" />
              </button>
            </Tooltip>
          </div>

          <div className="flex justify-center w-full -ml-[135px] space-x-4">
            {!back && (
              <Tooltip content="Show card meaning" keyBinding="space">
                <button
                  className="inline-flex items-center space-x-2 rounded-full h-9 px-4 bg-[#f1f1f1] text-[#0f0f0f]"
                  onClick={flipCard}
                >
                  <ArrowDownIcon className="w-4 h-4" />
                  <span>Show meaning</span>
                </button>
              </Tooltip>
            )}

            {back && (
              <Tooltip content="Mark card as remembered" keyBinding="space">
                <button
                  className="inline-flex items-center space-x-2 rounded-full h-9 px-4 bg-black/20 text-white/80"
                  onClick={rememberCard}
                >
                  <CheckIcon className="w-4 h-4" />
                  <span>Remembered</span>
                </button>
              </Tooltip>
            )}

            {srs === 'srs' && back && (
              <Tooltip content="Mark card as forgotten" keyBinding="F">
                <button
                  className="inline-flex items-center space-x-2 rounded-full h-9 px-4 bg-white/10 text-[#f1f1f1]"
                  onClick={forgetCard}
                >
                  <Cross1Icon className="w-4 h-4" />
                  <span>Forgot</span>
                </button>
              </Tooltip>
            )}
          </div>
        </div>
      )}

      {progress === indexes.length && (
        <div className="flex flex-col items-center justify-center">
          <div className="h-[calc((100vh-600px)*0.3)]"></div>
          <div className="w-[200px] flex flex-col space-y-6">
            <div className="text-lg font-bold">No more cards left.</div>
            <div>
              <div className="">
                Remembered:{' '}
                <span className="inline-flex font-bold items-center h-5 rounded-full px-2 text-sm bg-green-300 text-black/80">
                  {remembered}
                </span>
              </div>
              <div className="">
                Skipped:{' '}
                <span className="inline-flex font-bold items-center h-5 rounded-full px-2 text-sm bg-gray-300 text-black/80">
                  {skipped}
                </span>
              </div>
            </div>
            <Link
              href="/vocabulary/all"
              className="inline-flex max-w-max items-center bg-white/5 h-8 rounded-md border border-transparent whitespace-nowrap px-3"
            >
              Back to vocab
            </Link>
          </div>
        </div>
      )}
    </div>
  )
}
