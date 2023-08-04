import { useState, useEffect } from 'react'
import { createPagesBrowserClient } from '@supabase/auth-helpers-nextjs'

import { get } from 'lib/database'
import startReplication from 'lib/replication'

const createSupabaseClient = () =>
  createPagesBrowserClient({
    supabaseUrl: process.env.NEXT_PUBLIC_SUPABASE_URL,
    supabaseKey: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
  })

export default function useDatabase() {
  const [supabaseClient] = useState(createSupabaseClient())
  const [db, setDb] = useState<any>()

  useEffect(() => {
    const initDatabase = async () => {
      const {
        data: { session }
      } = await supabaseClient.auth.getSession()
      const userID = session?.user?.id || null

      /**
       * Initialize RxDB database by user id
       */
      const db = await get(userID)
      setDb(db)
      console.log('[Client] Initialize RxDB database')

      /**
       * Initialize Supabase replication if user is logged in
       */
      if (userID && db.name.includes(userID)) {
        startReplication(db.new, supabaseClient)
        console.log('[Client] Start replication to supabase')
      }
    }

    if (supabaseClient) {
      initDatabase()
    }
  }, [supabaseClient])

  return { db, supabaseClient }
}
