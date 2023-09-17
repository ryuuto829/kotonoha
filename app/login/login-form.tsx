'use client'

import { createClientComponentClient } from '@supabase/auth-helpers-nextjs'
import { useRouter } from 'next/navigation'

export default function LoginForm() {
  const supabase = createClientComponentClient()
  const router = useRouter()

  const handleSignIn = async () => {
    await supabase.auth.signInWithPassword({
      email: 'example@email.com',
      password: '71fas8897dsf73'
    })
    router.refresh()
  }

  return <button onClick={handleSignIn}>Sign in</button>
}
