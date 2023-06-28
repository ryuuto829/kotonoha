import { cloneDeep } from 'lodash'
import {
  useMemo,
  useEffect,
  useState,
  createContext,
  ReactNode,
  useContext
} from 'react'
import { RxDatabase, RxQuery, RxDocument } from 'rxdb'

/**
 * React hooks for integrating with RxDB
 * @link https://github.com/cvara/rxdb-hooks
 */
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
  const [data, setData] = useState<RxDocument<T>>()
  const [isFetching, setIsFetching] = useState(true)

  useEffect(() => {
    if (!query) return

    const sub = (query.$.subscribe as any)((docs?: RxDocument<T>) => {
      if (!docs) return

      /**
       * The `update$` event observation results in the `data === docs` condition
       * being `true`, which does not have any impact on the state or update the UI.
       * However, to ensure the state is updated correctly, it is essential
       * to provide a deep copy of the object.
       *
       * @todo Create a deep copy of `docs` only when the size of the array changes
       */
      setData(cloneDeep(docs))
      setIsFetching(false)
    })

    return () => sub?.unsubscribe()
  }, [query])

  return { data, isFetching }
}
