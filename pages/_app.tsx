import { useState, useEffect } from 'react'
import { Provider } from 'rxdb-hooks'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import type { AppProps } from 'next/app'
import type { RxDatabase } from 'rxdb'
import type { NextPageWithLayout } from '../lib/types'

import '../styles/globals.css'
import Layout from '../layouts/Layout'
import { get } from '../lib/database'

// import { Inter } from '@next/font/google'

// const inter = Inter({ subsets: ['latin'] })

type AppPropsWithLayout = AppProps & {
  Component: NextPageWithLayout
}

export default function App({ Component, pageProps }: AppPropsWithLayout) {
  const [queryClient] = useState(() => new QueryClient())
  const [db, setDb] = useState<RxDatabase<any>>()
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // RxDB instantiation can be asynchronous
    get().then(setDb)
  }, [])

  useEffect(() => {
    if (db) {
      db.users
        .findOne('user')
        .exec()
        .then(async (doc) => {
          if (!doc) {
            await db.users.upsert({
              id: 'user',
              experiencePoints: 0,
              stats: []
            })
          }
          setLoading(false)
        })
    }
  }, [db])

  /**
   * Persistent 'Per-Page' Layout in Next.js
   * @link https://nextjs.org/docs/basic-features/layouts
   */
  const getLayout = Component.getLayout ?? ((page) => page)

  if (!db && loading) {
    return <div>Loading db ...</div>
  }

  return (
    <Provider db={db}>
      <Layout>
        {getLayout(
          <QueryClientProvider client={queryClient}>
            <Component {...pageProps} />
          </QueryClientProvider>
        )}
      </Layout>
    </Provider>
  )
}
