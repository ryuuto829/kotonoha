import { useState, useEffect } from 'react'
import { Provider } from 'rxdb-hooks'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import type { AppProps } from 'next/app'
import type { RxDatabase } from 'rxdb'
import type { NextPageWithLayout } from '../lib/types'

import Layout from '../components/Layout'
import { get } from '../lib/database'
import '../styles/globals.css'

type AppPropsWithLayout = AppProps & {
  Component: NextPageWithLayout
}

export default function App({ Component, pageProps }: AppPropsWithLayout) {
  const [queryClient] = useState(() => new QueryClient())
  const [db, setDb] = useState()

  useEffect(() => {
    // RxDB instantiation can be asynchronous
    get().then(setDb as RxDatabase<any>)
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
    <Layout>
      {getLayout(
        <Provider db={db}>
          <QueryClientProvider client={queryClient}>
            <Component {...pageProps} />
          </QueryClientProvider>
        </Provider>
      )}
    </Layout>
  )
}
