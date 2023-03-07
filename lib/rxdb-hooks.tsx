/**
 * React hooks for integrating with RxDB
 * @link https://github.com/cvara/rxdb-hooks
 */
import {
  useMemo,
  useEffect,
  useState,
  createContext,
  ReactNode,
  useContext
} from 'react'
import { RxDatabase, RxQuery, RxDocument } from 'rxdb'

export const RxContext = createContext<{ db?: RxDatabase }>({})

/**
 * Creates `RxDatabase` instance available to nested components and
 * is required for all subsequent hooks to work
 */
export function RxDBProvider({
  db,
  children
}: {
  db: RxDatabase
  children: ReactNode
}) {
  const context = useMemo(() => ({ db }), [db])
  return <RxContext.Provider value={context}>{children}</RxContext.Provider>
}

/**
 * Returns the `RxDatabase` instance
 */
export function useRxDB<T>() {
  const { db } = useContext(RxContext)
  return db as T
}

/**
 * Subscribes to given `RxQuery` object providing query results
 */
export function useRxQuery<T>(query: RxQuery | undefined) {
  const [data, setData] = useState<RxDocument<T>[] | []>([])
  const [isFetching, setIsFetching] = useState(true)

  useEffect(() => {
    const sub = (query?.$.subscribe as any)((docs: RxDocument<T>[]) => {
      setData(docs)
      setIsFetching(false)
    })

    return () => sub?.unsubscribe()
  }, [query])

  return { data, isFetching }
}
