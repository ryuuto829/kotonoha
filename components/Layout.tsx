import Link from 'next/link'
import { useRouter } from 'next/router'
import type { ReactNode } from 'react'

const NAV_LINKS = [
  {
    label: 'Dictionary',
    url: '/dictionary'
  },
  {
    label: 'Vocabulary',
    url: '/vocabulary'
  }
]

export function Navbar() {
  const router = useRouter()

  return (
    <header>
      <nav className="fixed top-0 left-0 px-4 z-20 w-full h-16 flex items-center space-x-4 bg-[rgb(25,25,25)] border-b border-white border-opacity-20">
        <div>Logo</div>
        <div className="w-full flex items-center justify-between space-x-4">
          {/* Nav links */}
          <div className="flex space-x-4">
            {NAV_LINKS.map(({ url, label }) => (
              <Link
                key={url}
                href={url}
                className={`flex items-center h-16 flex-grow-0 flex-shrink-0 text-white transition hover:text-opacity-80 ${
                  router.pathname == url
                    ? 'border-b-2 border-white border-opacity-80 font-medium text-opacity-80'
                    : 'pb-0.5 text-opacity-40'
                }`}
              >
                {label}
              </Link>
            ))}
          </div>
          <div className="h-16 flex items-center space-x-2 px-4 border-x border-white border-opacity-20">
            <div className="relative inline-flex items-center justify-center w-10 h-10 overflow-hidden bg-gray-100 rounded-full dark:bg-gray-600">
              <span className="font-medium text-gray-600 dark:text-gray-300">
                DM
              </span>
            </div>
            <div className="font-medium">Profile</div>
          </div>
        </div>
      </nav>
    </header>
  )
}

export default function Layout({ children }: { children: ReactNode }) {
  return (
    <section className="grid grid-rows-[4rem_1fr] min-h-screen">
      <Navbar />
      <main className="w-full max-w-2xl mx-auto px-4 py-8 text-white text-opacity-80 shadow-md">
        {children}
      </main>
    </section>
  )
}
