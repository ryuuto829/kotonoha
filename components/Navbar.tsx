import { useState, useEffect } from 'react'
import Link from 'next/link'
import { useRxCollection } from 'rxdb-hooks'
import * as DropdownMenu from '@radix-ui/react-dropdown-menu'
import {
  BarChartIcon,
  ChevronDownIcon,
  GearIcon,
  HamburgerMenuIcon,
  HomeIcon
} from '@radix-ui/react-icons'
import PointIcon from './PointIcon'
import { ProgressDocument } from '../lib/types'

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

export default function Navbar({
  sidebarOpen,
  changeSidebarOpen
}: {
  sidebarOpen: boolean
  changeSidebarOpen: (x: boolean) => void
}) {
  const progressCollection = useRxCollection('progress')
  const [points, setPoints] = useState(0)

  useEffect(() => {
    const query = progressCollection?.find()
    const querySub = (query?.$.subscribe as any)((docs: ProgressDocument[]) => {
      setPoints(
        /**
         * Total number of points for all periods of time
         */
        docs.reduce((total, daily) => total + (daily.pointsEarned || 0), 0)
      )
    })

    return () => querySub?.unsubscribe()
  }, [progressCollection])

  return (
    <header>
      <nav className="fixed top-0 left-0 px-4 z-20 w-full h-16 flex items-center space-x-4 bg-[rgb(25,25,25)] border-b border-white/20">
        <button onClick={() => changeSidebarOpen(!sidebarOpen)}>
          <HamburgerMenuIcon className="w-5 h-5" />
        </button>
        <Link href={'/dictionary'} className="p-2">
          <HomeIcon className="w-5 h-5" />
        </Link>
        <div className="w-full flex items-center justify-end space-x-4">
          <div className="flex items-center space-x-2">
            <div className="flex items-center space-x-2">
              <PointIcon className="w-5 h-5 fill-white/80" />
              <span>{points.toFixed(2)}</span>
            </div>

            <Menu />
          </div>
        </div>
      </nav>
    </header>
  )
}
