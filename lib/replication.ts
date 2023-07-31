import { SupabaseClient } from '@supabase/auth-helpers-react'
import { SupabaseReplication } from 'rxdb-supabase'
import { RxCollection } from 'rxdb'

export default async function startReplication(
  collection: RxCollection<any>,
  supabaseClient: SupabaseClient
) {
  // if (user && db?.name.includes(user)) {
  const replication = new SupabaseReplication({
    supabaseClient: supabaseClient,
    collection: collection,
    /**
     * An ID for the replication, so that RxDB is able to resume the replication
     * on app reload. It is recommended to add the supabase URL to make sure you're
     * not mixing up replications against different databases.
     *
     * If you're using row-level security, you might also want to append the user ID
     * in case the logged in user changes, although depending on your application you
     * might want to re-create the entire RxDB from scratch in that case or have one
     * RxDB per user ID (you could add the user ID to the RxDB name).
     */
    replicationIdentifier: process.env.NEXT_PUBLIC_SUPABASE_URL as string,
    pull: {}, // If absent, no data is pulled from Supabase
    push: {}, // If absent, no changes are pushed to Supabase
    retryTime: 50000,
    table: 'table_name'
  })

  replication.error$.subscribe((err) => {
    console.error(err)
  })

  console.log('[Client] Start replication...')
  // }
}
