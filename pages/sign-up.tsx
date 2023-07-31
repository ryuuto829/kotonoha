import { GitHubLogoIcon } from '@radix-ui/react-icons'
import { useUser, useSupabaseClient } from '@supabase/auth-helpers-react'
import router from 'next/router'
import { useEffect } from 'react'
import { useRxDB } from '../lib/rxdb-hooks'

export default function SignUpPage() {
  const user = useUser()
  const supabaseClient = useSupabaseClient()
  const db = useRxDB()

  const handleSignUp = async () => {
    await supabaseClient.auth.signInWithPassword({
      email: 'example@email.com',
      password: '71fas8897dsf73'
    })
    // await supabaseClient.auth.signInWithPassword({
    //   email: 'example1@email.com',
    //   password: '71fas8897dsf731'
    // })
    router.reload()
  }

  const signOut = async () => {
    const { error } = await supabaseClient.auth.signOut()
    router.reload()
  }

  useEffect(() => {
    db?.new
      ?.find()
      .exec()
      .then((docs) => console.log(docs))
  }, [db])

  return (
    <main className="flex flex-col justify-center h-full">
      <section className=" px-4">
        <div className="uppercase">Kotoのha</div>
      </section>
      <section className="flex justify-center">
        <div className="max-w-sm w-full py-4">
          <h2 className="text-lg font-medium">Sign up</h2>
          <p>Already have an account? Sign in.</p>

          <div className="flex flex-col gap-3 my-4">
            <button className="h-12 flex items-center justify-center gap-2 w-full bg-[--color-base-light] rounded-full">
              Continue with Google
            </button>
            <button
              onClick={handleSignUp}
              className="h-12 flex items-center justify-center gap-2 w-full bg-[--color-base-light] rounded-full"
            >
              <GitHubLogoIcon />
              Continue with GitHub
            </button>
            <button onClick={signOut}>Sign out</button>
          </div>
          <div className="flex flex-col mb-3">
            <hr className="h-0 border-t mt-3" />
            <div className="-mt-3 text-sm text-center">
              <span className="px-2 bg-[--color-base-dark]">OR</span>
            </div>
          </div>

          <div className="my-4">
            <button className="h-12 flex items-center justify-center gap-2 w-full bg-[--color-base-light] rounded-full">
              Continue as a guest
            </button>
          </div>

          <div>
            By logging in to Kotonoha, you agree to our terms of service.
          </div>
        </div>
      </section>
    </main>
  )
}
