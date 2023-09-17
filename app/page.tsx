'use client'

import { useEffect, useState } from 'react'
import {
  User,
  createClientComponentClient
} from '@supabase/auth-helpers-nextjs'
import { useRouter } from 'next/navigation'

export default function Page() {
  const supabase = createClientComponentClient()
  const router = useRouter()
  const [user, setUser] = useState<User | null>()

  const handleSignOut = async () => {
    await supabase.auth.signOut()
    router.refresh()
  }

  useEffect(() => {
    const getUser = async () => {
      const {
        data: { user }
      } = await supabase.auth.getUser()
      setUser(user)
    }

    getUser()
  }, [])

  return (
    <div>
      <h1>Main page</h1>

      <button onClick={handleSignOut}>Log out</button>
    </div>
  )
}
