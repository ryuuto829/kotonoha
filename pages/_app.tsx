import { useState } from 'react'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import '../styles/globals.css'

import type { AppProps } from 'next/app'
import type { NextPageWithLayout } from '../lib/types'

type AppPropsWithLayout = AppProps & {
  Component: NextPageWithLayout
}

export default function App({ Component, pageProps }: AppPropsWithLayout) {
  const [queryClient] = useState(() => new QueryClient())

  // Persistent 'Per-Page' Layout in Next.js
  // Read: https://nextjs.org/docs/basic-features/layouts
  const getLayout = Component.getLayout ?? ((page) => page)

  return getLayout(
    <QueryClientProvider client={queryClient}>
      <Component {...pageProps} />
    </QueryClientProvider>
  )
}
