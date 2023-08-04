import { useState } from 'react'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { SessionContextProvider } from '@supabase/auth-helpers-react'
import { Provider } from 'rxdb-hooks'
import type { AppProps } from 'next/app'

import 'styles/globals.css'
import Layout from 'layouts/Layout'
import useDatabase from 'components/hooks/useDatabase'
import type { NextPageWithLayout } from 'lib/types'

export default function App({
  Component,
  pageProps
}: AppProps & {
  Component: NextPageWithLayout
}) {
  const [queryClient] = useState(() => new QueryClient())
  const { db, supabaseClient } = useDatabase()

  /**
   * Persistent 'Per-Page' Layout in Next.js
   * @link https://nextjs.org/docs/basic-features/layouts
   */
  const getLayout = Component.getLayout ?? ((page) => page)

  if (!db || !supabaseClient) {
    return <div>Loading App ...</div>
  }

  return (
    <SessionContextProvider supabaseClient={supabaseClient}>
      <Provider db={db}>
        <Layout>
          {getLayout(
            <QueryClientProvider client={queryClient}>
              <Component {...pageProps} />
            </QueryClientProvider>
          )}
        </Layout>
      </Provider>
    </SessionContextProvider>
  )
}
