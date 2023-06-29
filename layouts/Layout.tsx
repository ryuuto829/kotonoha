import { ReactNode } from 'react'
import Navigation from '../components/navigation'

export default function Layout({ children }: { children: ReactNode }) {
  return (
    <section className="min-h-screen relative">
      <Navigation />

      <main
        aria-label="Main content"
        tabIndex={-1}
        className="relative min-h-screen flex flex-col flex-grow justify-center items-center pt-[64px] "
      >
        <div className="flex flex-col flex-grow gap-8 pb-20 pt-10 px-4 max-w-3xl w-full">
          {children}
        </div>
      </main>
    </section>
  )
}
