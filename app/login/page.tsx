import { createServerComponentClient } from '@supabase/auth-helpers-nextjs'
import { cookies } from 'next/headers'
import { redirect } from 'next/navigation'

import LoginForm from './login-form'

export default async function LoginPage() {
  const supabase = createServerComponentClient({ cookies })
  const {
    data: { session }
  } = await supabase.auth.getSession()

  console.log(session)

  if (session) {
    redirect('/')
  }

  return (
    <div>
      <h1>Login Page</h1>
      <LoginForm />
    </div>
  )
}
