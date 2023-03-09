import { ReactNode } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/router'
import * as DropdownMenu from '@radix-ui/react-dropdown-menu'
import * as Dialog from '@radix-ui/react-dialog'
import * as Avatar from '@radix-ui/react-avatar'
import {
  Cross1Icon,
  EnterIcon,
  GearIcon,
  HamburgerMenuIcon,
  PlusIcon,
  ReaderIcon
} from '@radix-ui/react-icons'
import CardEditor from '../components/CardEditor'

const APP_NAVIGATION_LINKS = [
  { name: 'Dictionary', url: '/dictionary' },
  { name: 'Your library', url: '/vocabulary/all' }
]

const PROFILE_NAVIGATION_LINKS = [
  { name: 'Dashboard', url: '/dashboard', Icon: ReaderIcon },
  { name: 'Settings', url: '/settings', Icon: GearIcon }
]

function ProfileMenu() {
  return (
    <DropdownMenu.Root modal={false}>
      <DropdownMenu.Trigger asChild>
        <Avatar.Root className="inline-flex items-center justify-center w-10 h-10 rounded-full bg-gray-600 border-2 border-transparent hover:border-[#9da2ff] data-[state=open]:border-[#9da2ff] transition-colors cursor-pointer">
          <Avatar.Fallback className="font-medium text-gray-300">
            DM
          </Avatar.Fallback>
        </Avatar.Root>
      </DropdownMenu.Trigger>
      <DropdownMenu.Portal>
        <DropdownMenu.Content
          align="end"
          sideOffset={5}
          className="py-1.5 z-50 w-[210px] rounded-md bg-[#303136] border border-white/10 text-sm"
        >
          {PROFILE_NAVIGATION_LINKS.map(({ name, url, Icon }) => (
            <DropdownMenu.Item key={name} asChild>
              <Link
                href={url}
                className="flex items-center gap-2.5 mx-1.5 px-1.5 h-8 max-w-[calc(100%-12px)] rounded hover:bg-white/5 outline-none"
              >
                <Icon className="w-4 h-4" />
                <span>{name}</span>
              </Link>
            </DropdownMenu.Item>
          ))}
          <hr className="h-[1px] bg-white/10 my-1 border-none" />
          <Link
            href="/login"
            className="flex items-center gap-2.5 mx-1.5 px-1.5 h-8 max-w-[calc(100%-12px)] rounded hover:bg-white/5 outline-none"
          >
            <EnterIcon className="w-4 h-4" />
            <span>Log in</span>
          </Link>
          <hr className="h-[1px] bg-white/10 my-1 border-none" />
          <a
            href="#"
            className="text-xs flex items-center gap-2.5 mx-1.5 px-1.5 h-8 max-w-[calc(100%-12px)] rounded hover:bg-white/5 outline-none"
          >
            <span className="ml-1">v0.1.0</span>
            <span>·</span>
            <span>What&apos;s new</span>
          </a>
        </DropdownMenu.Content>
      </DropdownMenu.Portal>
    </DropdownMenu.Root>
  )
}

function Sidebar() {
  return (
    <Dialog.Root modal={false}>
      {/* Open button */}
      <Dialog.Trigger className="h-8 w-8 md:hidden inline-flex items-center justify-center rounded hover:bg-white/5 data-[state=open]:hidden transition-colors">
        <HamburgerMenuIcon className="w-5 h-5" />
      </Dialog.Trigger>
      {/* Close button */}
      <Dialog.Trigger className="h-8 w-8 md:hidden inline-flex items-center justify-center rounded hover:bg-white/5 data-[state=closed]:hidden transition-colors">
        <Cross1Icon className="w-5 h-5" />
      </Dialog.Trigger>
      <Dialog.Content className="fixed inset-0 mt-[64px] bg-[#202124] z-50 flex flex-col">
        {APP_NAVIGATION_LINKS.map(({ name, url }) => (
          <Link
            key={name}
            href={url}
            aria-label={name}
            tabIndex={0}
            className="px-3 hover:bg-white/5 transition-colors"
          >
            <span>{name}</span>
          </Link>
        ))}
      </Dialog.Content>
    </Dialog.Root>
  )
}

function Navbar() {
  const router = useRouter()

  return (
    <div className="fixed top-0 z-40 w-full">
      <header className="px-4 h-16 flex items-center justify-between gap-3 bg-[#202124] shadow-[rgb(255,255,255,0.1)_0px_-1px_0px_inset]">
        {/* Content left */}
        <div className="inline-flex items-center gap-3">
          <Sidebar />
          <div className="hidden md:block">Logo</div>
          <nav className="inline-flex items-center">
            {APP_NAVIGATION_LINKS.map(({ name, url }) => {
              const active = router.asPath.startsWith(url)
                ? 'after:visible'
                : 'after:invisible'

              return (
                <Link
                  key={name}
                  href={url}
                  aria-label={name}
                  tabIndex={0}
                  className="hidden md:block px-3 hover:bg-white/5 transition-colors"
                >
                  <span
                    className={`relative block h-16 text-sm font-medium whitespace-nowrap leading-[64px] after:content-[''] after:h-1 after:bg-[#9da2ff] after:absolute after:bottom-0 after:w-full after:left-0 after:rounded-md ${active}`}
                  >
                    {name}
                  </span>
                </Link>
              )
            })}
          </nav>
        </div>
        {/* Content right */}
        <div className="inline-flex items-center gap-3">
          <CardEditor modal={true}>
            <button className="h-8 w-8 inline-flex items-center justify-center rounded hover:bg-white/5 transition-colors">
              <PlusIcon className="w-5 h-5" />
            </button>
          </CardEditor>
          <ProfileMenu />
        </div>
      </header>
    </div>
  )
}

export default function Layout({ children }: { children: ReactNode }) {
  return (
    <section className="min-h-screen">
      <Navbar />
      <main
        aria-label="Main content"
        tabIndex={-1}
        className="relative w-full min-h-screen flex flex-col flex-grow pt-[64px] px-4 max-w-3xl mx-auto"
      >
        <div className="flex flex-col flex-grow gap-8 pb-20">{children}</div>
      </main>
    </section>
  )
}
