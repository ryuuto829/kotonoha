import { ReactNode } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/router'
import * as DropdownMenu from '@radix-ui/react-dropdown-menu'
import * as Dialog from '@radix-ui/react-dialog'
import * as Avatar from '@radix-ui/react-avatar'
import {
  CaretDownIcon,
  ChevronDownIcon,
  CounterClockwiseClockIcon,
  Cross1Icon,
  EnterIcon,
  GearIcon,
  HamburgerMenuIcon,
  PlusIcon,
  ReaderIcon,
  StackIcon
} from '@radix-ui/react-icons'
import CardEditor from '../components/CardEditor'
import { useRxDB, useRxQuery } from '../lib/rxdb-hooks'
import { AppDatabase } from '../lib/types'
import clsx from 'clsx'
import site from '../utils/site'
import * as NavigationMenu from '@radix-ui/react-navigation-menu'
import { useScrollPosition } from '../utils/useScrollPosition'

const APP_NAVIGATION_LINKS = [
  { name: 'Dictionary', url: '/dictionary' },
  { name: 'Your library', url: '/sets' }
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

function MenuLink({ href, ...props }: { href: string; [x: string]: any }) {
  const router = useRouter()

  return (
    <Link href={href} passHref>
      <NavigationMenu.Link
        active={router.pathname === href}
        className="flex items-center gap-1 py-2 px-3 rounded-full leading-none text-white/40 hover:text-white/90 bg-transparent data-[active]:bg-slate-400/5 data-[active]:text-white/90 transition-all"
        {...props}
      />
    </Link>
  )
}

function Menu() {
  return (
    <NavigationMenu.Root>
      <NavigationMenu.List className="flex items-center justify-center gap-2 list-none">
        <NavigationMenu.Item>
          <MenuLink href="/dictionary">Dictionary</MenuLink>
        </NavigationMenu.Item>
        <NavigationMenu.Item>
          <MenuLink href="/sets">Your Library</MenuLink>
        </NavigationMenu.Item>
        <NavigationMenu.Item>
          <NavigationMenu.Trigger className="group flex items-center gap-1 py-2 px-3 rounded-full leading-none text-white/40 hover:text-white/90 bg-transparent data-[active]:bg-slate-400/5 data-[active]:text-white/90 transition-all">
            Study{''}
            <CaretDownIcon
              aria-hidden
              className="group-data-[state=open]:-rotate-180 transition-transform"
            />
          </NavigationMenu.Trigger>
          <NavigationMenu.Content className="absolute top-[50px] left-0 w-full">
            <ul className="w-[600px] grid grid-rows-2 bg-black/20 p-[22px]">
              <NavigationMenu.Item>
                <NavigationMenu.Link asChild>
                  <Link href="/sets">Due for today</Link>
                </NavigationMenu.Link>
              </NavigationMenu.Item>
              <NavigationMenu.Item>
                <NavigationMenu.Link asChild>
                  <Link href="/sets">New</Link>
                </NavigationMenu.Link>
              </NavigationMenu.Item>
            </ul>
          </NavigationMenu.Content>
        </NavigationMenu.Item>
      </NavigationMenu.List>
    </NavigationMenu.Root>
  )
}

function Navbar() {
  const router = useRouter()
  const db = useRxDB<AppDatabase>()
  const scrollPosition = useScrollPosition()

  const countNew = useRxQuery(
    db.cards.find({
      selector: {
        createdAt: {
          $gte: new Date().toISOString().split('T')[0]
        }
      }
    })
  )

  const countToday = useRxQuery(
    db.cards.find({
      selector: {
        srsDueDate: {
          $lte: new Date().toISOString().split('T')[0]
        },
        status: {
          $ne: 5
        }
      }
    })
  )

  const studyLinks = [
    {
      name: 'Due today',
      url: '/study/today',
      Icon: CounterClockwiseClockIcon,
      count: countToday.data?.length
    },
    {
      name: 'New cards',
      url: '/study/new',
      Icon: StackIcon,
      count: countNew.data?.length
    }
  ]

  return (
    <div
      className={clsx(
        'fixed top-0 z-40 flex justify-center w-full max-w-full min-h-[64px] transition-shadow',
        scrollPosition > 0
          ? 'bg-[#202124]/50 shadow-[hsla(0,0%,100%,0.1)_0px_-1px_0px_inset] before:contents-[""] before:absolute before:-z-10 before:w-full before:h-full before:backdrop-blur-sm before:backdrop-saturate-150 before:top-[-1px] before:[backface-visibility:hidden]'
          : 'bg-transparent'
      )}
    >
      <header className="max-w-7xl w-full px-6 mx-auto flex items-center">
        {/* Logo */}
        <div className="flex-1 justify-start">
          <a href={site.url} rel="home" className="text-lg font-bold">
            こと
          </a>
        </div>
        {/* Navigation */}
        <Menu />
        {/* <nav className="flex-1 flex items-center justify-center"> */}
        {/* {APP_NAVIGATION_LINKS.map(({ name, url }) => {
            const active = router.asPath.startsWith(url)
              ? 'after:visible'
              : 'after:invisible'

            return (
              <Link
                key={name}
                href={url}
                aria-label={name}
                tabIndex={0}
                className="hidden md:block py-2 px-3 hover:bg-white/5 transition-colors"
              >
                <span
                  className={`relative block h-16 text-sm font-medium whitespace-nowrap leading-[64px] after:content-[''] after:h-1 after:bg-[#9da2ff] after:absolute after:bottom-0 after:w-full after:left-0 after:rounded-md ${active}`}
                >
                  {name}
                </span>
              </Link>
            )
          })} */}
        {/* <DropdownMenu.Root modal={false}>
            <DropdownMenu.Trigger className="hidden md:block px-3 hover:bg-white/5 transition-colors data-[state=open]:bg-white/5">
              <span
                className={`relative inline-flex items-center gap-2 h-16 text-sm font-medium whitespace-nowrap leading-[64px] after:content-[''] after:h-1 after:bg-[#9da2ff] after:absolute after:bottom-0 after:w-full after:left-0 after:rounded-md ${
                  router.asPath.startsWith('/study/')
                    ? 'after:visible'
                    : 'after:invisible'
                }`}
              >
                Study
                <ChevronDownIcon />
              </span>
            </DropdownMenu.Trigger>
            <DropdownMenu.Portal>
              <DropdownMenu.Content
                align="start"
                sideOffset={5}
                className="py-1.5 z-50 w-[210px] rounded-md bg-[#303136] border border-white/10 text-sm"
              >
                {studyLinks.map(({ name, url, Icon, count }) => {
                  return (
                    <DropdownMenu.Item key={url} asChild>
                      <Link
                        href={url}
                        className="flex items-center gap-2.5 mx-1.5 px-1.5 h-8 max-w-[calc(100%-12px)] rounded hover:bg-white/5 outline-none"
                      >
                        <Icon className="w-4 h-4" />
                        <span className="flex-1">{name}</span>
                        <span>{count || 0}</span>
                      </Link>
                    </DropdownMenu.Item>
                  )
                })}
              </DropdownMenu.Content>
            </DropdownMenu.Portal>
          </DropdownMenu.Root> */}
        {/* </nav> */}

        <Sidebar />

        {/* Profile */}
        <div className="flex-1 ml-auto flex items-center justify-end gap-3">
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
    <section className="min-h-screen relative">
      <Navbar />
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
