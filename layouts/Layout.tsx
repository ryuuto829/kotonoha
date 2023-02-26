import Link from 'next/link'
import { useRouter } from 'next/router'
import { ReactNode, useState, useEffect } from 'react'
import { useRxCollection } from 'rxdb-hooks'
import * as DropdownMenu from '@radix-ui/react-dropdown-menu'
import { BarChartIcon, ChevronDownIcon, GearIcon } from '@radix-ui/react-icons'

const NAV_LINKS = [
  {
    label: 'Dictionary',
    url: '/dictionary'
  },
  {
    label: 'Vocabulary',
    url: '/vocabulary/all'
  }
]

export function LogoIcon(props: any) {
  return (
    <svg
      width="432"
      height="424"
      viewBox="0 0 432 424"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      {...props}
    >
      <path d="M223.967 3.82504C219.776 -0.451426 212.253 -0.451426 208.062 3.82504C199.795 12.2493 127.324 87.3663 127.324 133.764C127.324 180.161 199.795 255.279 208.062 263.703C210.165 265.834 213.025 267.035 216.014 267.035C219.004 267.035 221.864 265.834 223.967 263.703C232.233 255.279 304.705 180.161 304.705 133.764C304.705 87.3663 232.233 12.2493 223.967 3.82504Z" />
      <path d="M160.563 263.274C127.753 230.449 23.3587 228.561 11.5734 228.447C8.89881 228.447 5.70934 229.605 3.59256 231.722C1.47578 233.81 0.302965 236.714 0.317268 239.717C0.431689 251.503 2.30532 355.883 35.1154 388.679C67.9255 421.489 172.291 423.362 184.091 423.477C184.12 423.477 184.148 423.477 184.191 423.477C184.263 423.477 184.348 423.477 184.406 423.477C190.627 423.591 195.776 418.557 195.776 412.364C195.776 411.191 195.605 410.118 195.29 409.074C194.889 387.863 191.342 294.024 160.563 263.274Z" />
      <path d="M428.407 231.737C426.305 229.634 423.287 228.433 420.427 228.461C408.627 228.576 304.233 230.464 271.451 263.288C238.641 296.055 236.753 400.45 236.653 412.235C236.624 415.253 237.797 418.113 239.914 420.244C242.002 422.333 244.848 423.505 247.809 423.505C247.837 423.505 247.866 423.505 247.895 423.505C259.709 423.391 364.074 421.517 396.87 388.707C429.695 355.911 431.583 251.531 431.683 239.746C431.697 236.699 430.524 233.825 428.407 231.737Z" />
    </svg>
  )
}

export function PointIcon(props: any) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      fill="#000000"
      version="1.1"
      id="Capa_1"
      width="800px"
      height="800px"
      viewBox="0 0 55.934 55.934"
      {...props}
    >
      <g>
        <g>
          <path d="M27.967,0C12.548,0,0.002,12.547,0.002,27.966c0,15.42,12.545,27.968,27.965,27.968s27.965-12.548,27.965-27.968 C55.932,12.547,43.387,0,27.967,0z M27.967,50.741c-12.561,0-22.778-10.216-22.778-22.775c0-12.562,10.217-22.777,22.778-22.777 c12.561,0,22.777,10.216,22.777,22.777C50.744,40.525,40.527,50.741,27.967,50.741z" />
          <g>
            <path d="M28.524,12.503c-0.293-0.299-0.819-0.299-1.112,0c-0.578,0.589-5.645,5.841-5.645,9.085s5.067,8.496,5.645,9.085 c0.147,0.149,0.347,0.233,0.556,0.233s0.409-0.084,0.556-0.233c0.578-0.589,5.645-5.841,5.645-9.085S29.102,13.092,28.524,12.503z" />
            <path d="M24.091,30.643c-2.294-2.295-9.593-2.427-10.417-2.435c-0.187,0-0.41,0.081-0.558,0.229 c-0.148,0.146-0.23,0.349-0.229,0.559c0.008,0.824,0.139,8.122,2.433,10.415c2.294,2.294,9.591,2.425,10.416,2.433 c0.002,0,0.004,0,0.007,0c0.005,0,0.011,0,0.015,0c0.435,0.008,0.795-0.344,0.795-0.777c0-0.082-0.012-0.157-0.034-0.23 C26.491,39.354,26.243,32.793,24.091,30.643z" />
            <path d="M42.818,28.438c-0.147-0.147-0.358-0.231-0.558-0.229c-0.825,0.008-8.124,0.14-10.416,2.435 c-2.294,2.291-2.426,9.59-2.433,10.414c-0.002,0.211,0.08,0.411,0.228,0.56c0.146,0.146,0.345,0.228,0.552,0.228 c0.002,0,0.004,0,0.006,0c0.826-0.008,8.123-0.139,10.416-2.433c2.295-2.293,2.427-9.591,2.434-10.415 C43.048,28.785,42.966,28.584,42.818,28.438z" />
          </g>
        </g>
      </g>
    </svg>
  )
}

function Menu() {
  return (
    <DropdownMenu.Root modal={false}>
      <DropdownMenu.Trigger asChild>
        <div className="h-12 w-36 flex items-center justify-between space-x-2 px-2 hover:bg-white/5 rounded cursor-pointer">
          <div className="flex items-center space-x-2">
            <div className="relative inline-flex items-center justify-center w-10 h-10 overflow-hidden bg-gray-100 rounded-full dark:bg-gray-600">
              <span className="font-medium text-gray-600 dark:text-gray-300">
                DM
              </span>
            </div>
            <div>
              <div className="font-medium">user</div>
              <div className="text-sm">offline</div>
            </div>
          </div>

          <ChevronDownIcon className="w-4 h-4" />
        </div>
      </DropdownMenu.Trigger>

      <DropdownMenu.Portal>
        <DropdownMenu.Content
          className={`py-2 rounded bg-[rgb(37,37,37)] text-sm text-white text-opacity-80 w-[210px]`}
          sideOffset={5}
        >
          <DropdownMenu.Item asChild>
            <Link
              href="/dashboard"
              className="flex items-center mx-1 rounded-[3px] h-7 hover:bg-white hover:bg-opacity-10 cursor-pointer"
            >
              <div className="ml-2.5 mr-1 flex items-center justify-center w-4 h-4">
                <BarChartIcon className="w-4 h-4" />
              </div>
              <div className="ml-1.5 mr-3 flex-1">Dashboard</div>
            </Link>
          </DropdownMenu.Item>
          <DropdownMenu.Item asChild>
            <Link
              href="/settings"
              className="flex items-center mx-1 rounded-[3px] h-7 hover:bg-white hover:bg-opacity-10 cursor-pointer"
            >
              <div className="ml-2.5 mr-1 flex items-center justify-center w-4 h-4">
                <GearIcon className="w-4 h-4" />
              </div>
              <div className="ml-1.5 mr-3 flex-1">Settings</div>
            </Link>
          </DropdownMenu.Item>
        </DropdownMenu.Content>
      </DropdownMenu.Portal>
    </DropdownMenu.Root>
  )
}

export function Navbar() {
  const router = useRouter()
  const collection = useRxCollection('profiles')

  const [points, setPoints] = useState()

  useEffect(() => {
    let querySub: any

    const query = collection?.findOne('user')

    querySub = (query?.$.subscribe as any)((results) => {
      setPoints(results?.points)
    })

    return () => querySub?.unsubscribe()
  }, [collection])

  return (
    <header>
      <nav className="fixed top-0 left-0 px-4 z-20 w-full h-16 flex items-center space-x-4 bg-[rgb(25,25,25)] border-b border-white/20">
        <Link href={'/dictionary'} className="p-2">
          <LogoIcon className="w-6 h-6 fill-white/40" />
        </Link>
        <div className="w-full flex items-center justify-between space-x-4">
          {/* Nav links */}
          <div className="flex space-x-4">
            {NAV_LINKS.map(({ url, label }) => (
              <Link
                key={url}
                href={url}
                className={`flex items-center h-16 flex-grow-0 flex-shrink-0 text-white transition hover:text-opacity-80 ${
                  router.pathname.startsWith('/' + url.split('/')[1])
                    ? 'pb-0 border-b-2 border-white border-opacity-80 text-opacity-80'
                    : 'pb-[1.6px] text-opacity-40'
                }`}
              >
                {label}
              </Link>
            ))}
          </div>
          <div className="flex items-center space-x-2">
            <div className="flex items-center space-x-2">
              <PointIcon className="w-5 h-5 fill-white/80" />
              <span>{points?.toFixed(2) || 0}</span>
            </div>

            <Menu />
          </div>
        </div>
      </nav>
    </header>
  )
}

export default function Layout({ children }: { children: ReactNode }) {
  return (
    <section className="grid grid-rows-[4rem_1fr] min-h-screen relative">
      <Navbar />

      <main className="w-full h-full max-w-2xl mx-auto px-4 py-8 text-white text-opacity-80 shadow-md">
        {children}
      </main>
    </section>
  )
}
