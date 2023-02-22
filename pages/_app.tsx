import { useState, useEffect } from 'react'
import { Provider } from 'rxdb-hooks'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import type { AppProps } from 'next/app'
import type { RxDatabase } from 'rxdb'
import type { NextPageWithLayout } from '../lib/types'

import '../styles/globals.css'
import Layout from '../layouts/Layout'
import { get } from '../lib/database'

export default function App({
  Component,
  pageProps
}: AppProps & {
  Component: NextPageWithLayout
}) {
  const [queryClient] = useState(() => new QueryClient())
  const [db, setDb] = useState<RxDatabase<any>>()

  useEffect(() => {
    // RxDB instantiation can be asynchronous
    get().then(setDb)
  }, [])

  /**
   * Persistent 'Per-Page' Layout in Next.js
   * @link https://nextjs.org/docs/basic-features/layouts
   */
  const getLayout = Component.getLayout ?? ((page) => page)

  if (!db) {
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
