import { useState, useEffect } from 'react'
import { Provider } from 'rxdb-hooks'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import type { AppProps } from 'next/app'
import type { RxDatabase } from 'rxdb'
import type { NextPageWithLayout } from '../lib/types'

import { createPagesBrowserClient } from '@supabase/auth-helpers-nextjs'
import { SessionContextProvider } from '@supabase/auth-helpers-react'
import { SupabaseReplication } from 'rxdb-supabase'

import '../styles/globals.css'
import Layout from '../layouts/Layout'
import { get } from '../lib/database'
import { RxDBProvider } from '../lib/rxdb-hooks'
import startReplication from '../lib/replication'

export default function App({
  Component,
  pageProps
}: AppProps & {
  Component: NextPageWithLayout
}) {
  const [queryClient] = useState(() => new QueryClient())
  const [db, setDb] = useState<RxDatabase<any>>()
  const [supabaseClient] = useState(() =>
    createPagesBrowserClient({
      supabaseUrl: process.env.NEXT_PUBLIC_SUPABASE_URL,
      supabaseKey: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
    })
  )

  const [user, setUser] = useState<any>(null)

  useEffect(() => {
    const initDatabase = async () => {
      const { data } = await supabaseClient.auth.getSession()
      const uid = data?.session?.user?.id || null

      const db = await get(uid)

      setDb(db)
      setUser(uid)

      console.log('[Client] Initializing database...')
    }

    initDatabase()
  }, [])

  useEffect(() => {
    if (user && db?.name.includes(user)) {
      startReplication(db.new, supabaseClient)
    }
  }, [db, user, supabaseClient])

  /**
   * Persistent 'Per-Page' Layout in Next.js
   * @link https://nextjs.org/docs/basic-features/layouts
   */
  const getLayout = Component.getLayout ?? ((page) => page)

  if (!db) {
    return <div>Loading db ...</div>
  }

  return (
    <SessionContextProvider
      supabaseClient={supabaseClient}
      initialSession={pageProps.initialSession}
    >
      <RxDBProvider db={db}>
        <Provider db={db}>
          <Layout>
            {getLayout(
              <QueryClientProvider client={queryClient}>
                <Component {...pageProps} />
              </QueryClientProvider>
            )}
          </Layout>
        </Provider>
      </RxDBProvider>
    </SessionContextProvider>
  )
}
