import { useRouter } from 'next/router'
import { useMemo } from 'react'
import Review from '../../components/Review'
import { useRxDB, useRxQuery } from '../../lib/rxdb-hooks'
import { AppDatabase, CardDocument } from '../../lib/types'

export default function Study() {
  const db = useRxDB<AppDatabase>()
  const router = useRouter()
  const study = router.query?.params?.toString() as 'new' | 'today' | undefined

  // const today = formatISO(new Date(), { representation: 'date' })

  const cardsQuery = useMemo(() => {
    return db.cards.find({
      selector: {
        ...(study === 'new'
          ? {
              createdAt: {
                $gte: new Date().toISOString().split('T')[0]
              }
            }
          : {}),
        ...(study === 'today'
          ? {
              srsDueDate: {
                $lte: new Date().toISOString().split('T')[0]
              },
              status: {
                $ne: 5
              }
            }
          : {})
      }
    })
  }, [db.cards, study])

  const { data: cards } = useRxQuery<CardDocument[]>(cardsQuery)

  if (!cards) {
    return <div>Loading ...</div>
  }

  return <Review cards={cards} study={study === 'new' ? 'flashcards' : 'srs'} />
}
