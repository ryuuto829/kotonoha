import { ReactNode, useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/router'
import * as Avatar from '@radix-ui/react-avatar'
import {
  ChevronDownIcon,
  CounterClockwiseClockIcon,
  PlusIcon
} from '@radix-ui/react-icons'
import CardEditor from '../components/CardEditor'
// import { useRxDB, useRxQuery } from '../lib/rxdb-hooks'
// import { AppDatabase } from '../lib/types'
import clsx from 'clsx'
import site from '../utils/site'
import * as NavigationMenu from '@radix-ui/react-navigation-menu'
import { useScrollPosition } from '../utils/useScrollPosition'
import * as Collapsible from '@radix-ui/react-collapsible'
import { useWindowSize } from '../utils/useWindowSize'

function ProfileMenu() {
  return (
    <NavigationMenu.Item className="w-full md:w-auto" value="sub1">
      <NavigationMenu.Trigger
        onPointerMove={(e) => e.preventDefault()}
        onPointerLeave={(e) => e.preventDefault()}
        className={clsx(
          menuLinkStyle,
          'group data-[state=open]:text-white/90',
          'hidden md:block'
        )}
      >
        <Avatar.Root className="inline-flex items-center justify-center w-10 h-10 rounded-full bg-gray-600 border-2 border-transparent hover:border-[#9da2ff] data-[state=open]:border-[#9da2ff] transition-colors cursor-pointer">
          <Avatar.Fallback className="font-medium text-gray-300">
            DM
          </Avatar.Fallback>
        </Avatar.Root>
      </NavigationMenu.Trigger>
      <NavigationMenu.Content
        className={clsx(
          'relative',
          'md:absolute md:top-full md:left-full md:-translate-x-full'
        )}
        // onPointerLeave={(e) => e.preventDefault()}
      >
        <p className="flex items-center h-20 text-white/40 border-b border-white/10">
          email@gmail.com
        </p>
        <NavigationMenu.List
          className={clsx(
            'flex flex-col',
            'md:w-[250px] md:shadow-white md:rounded-lg md:p-2 md:text-sm md:bg-[#303136]'
          )}
        >
          {[
            {
              href: '/dashboard',
              title: 'Dashboard'
            },
            {
              href: '/settings',
              title: 'Settings'
            },
            { href: '/login', title: 'Log in' }
          ].map(({ href, title }) => (
            <NavigationMenu.Item key={href}>
              <NavigationMenu.Link asChild>
                <Link
                  href={href}
                  className={clsx(
                    'flex items-center hover:bg-white/5 h-12 border-b border-white/10',
                    'md:font-bold md:p-3 md:rounded-lg'
                  )}
                >
                  {title}
                </Link>
              </NavigationMenu.Link>
            </NavigationMenu.Item>
          ))}
        </NavigationMenu.List>
      </NavigationMenu.Content>
    </NavigationMenu.Item>
  )
}

const menuLinkStyle =
  'w-full flex items-center gap-1 md:py-2 md:px-3 md:rounded-full leading-none md:text-white/40 hover:bg-white/5 h-12 border-b border-white/10 md:hover:text-white/90 bg-transparent transition-colors'

function MenuLink({ href, ...props }: { href: string; [x: string]: any }) {
  const router = useRouter()

  return (
    <NavigationMenu.Item className="w-full md:w-auto">
      <NavigationMenu.Link active={router.pathname.startsWith(href)} asChild>
        <Link
          href={href}
          className={clsx(
            menuLinkStyle,
            'data-[active]:bg-slate-400/5 data-[active]:text-white/90'
          )}
          {...props}
        />
      </NavigationMenu.Link>
    </NavigationMenu.Item>
  )
}

/**
 * Option to open navigation menu on click instead of pointer enter
 */
export const preventHover = (event: any) => {
  const e = event as Event
  if (window.innerWidth < 768) e.preventDefault()
}

function StudyMenu() {
  return (
    <NavigationMenu.Item className="relative w-full md:w-auto">
      {/* Trigger */}
      <NavigationMenu.Trigger
        onPointerMove={preventHover}
        onPointerLeave={preventHover}
        className={clsx(menuLinkStyle, 'group data-[state=open]:text-white/90')}
      >
        Study{''}
        <ChevronDownIcon
          aria-hidden
          className="group-data-[state=open]:-rotate-180 transition-transform"
        />
      </NavigationMenu.Trigger>

      {/* Links */}
      <NavigationMenu.Content
        className="md:absolute top-[40px] left-0 w-full"
        onPointerLeave={preventHover}
      >
        <ul className="w-full md:w-[250px] flex flex-col md:rounded-lg md:shadow-white md:bg-[#303136] md:p-2 md:text-sm">
          {[
            {
              href: '/study/today',
              title: 'Due for today',
              description: 'All words for SRS',
              Icon: CounterClockwiseClockIcon
            },
            {
              href: '/study/new',
              title: 'New words',
              description: 'Review words added today',
              Icon: CounterClockwiseClockIcon
            }
          ].map(({ href, title, description, Icon }) => (
            <NavigationMenu.Item key={href}>
              <NavigationMenu.Link asChild>
                <Link
                  href={href}
                  className="flex md:flex-col items-center md:p-3 h-12 md:rounded-lg hover:bg-white/5"
                >
                  <div className="flex items-center gap-2 md:font-bold">
                    <Icon />
                    {''}
                    {title}
                  </div>
                  <div className="text-white/50 hidden">{description}</div>
                </Link>
              </NavigationMenu.Link>
            </NavigationMenu.Item>
          ))}
        </ul>
      </NavigationMenu.Content>
    </NavigationMenu.Item>
  )
}

function Navbar() {
  // const db = useRxDB<AppDatabase>()

  // const countNew = useRxQuery(
  //   db.cards.find({
  //     selector: {
  //       createdAt: {
  //         $gte: new Date().toISOString().split('T')[0]
  //       }
  //     }
  //   })
  // )

  // const countToday = useRxQuery(
  //   db.cards.find({
  //     selector: {
  //       srsDueDate: {
  //         $lte: new Date().toISOString().split('T')[0]
  //       },
  //       status: {
  //         $ne: 5
  //       }
  //     }
  //   })
  // )

  const windowSize = useWindowSize()
  const scrollPosition = useScrollPosition()
  const [open, setOpen] = useState(false)
  const [initialScrollPosition, setInitialScrollPosition] = useState(0)

  const openDialog = (open: boolean) => {
    /**
     * 1. Hide scrollbar and disable interaction with outside elements
     * 2. Prevent jumping to the top caused by the `position: fixed`
     */
    if (open) {
      document.body.style.position = 'fixed'
      document.body.style.width = '100%'
      setInitialScrollPosition(scrollPosition)
    } else {
      document.body.style.position = ''
      document.body.style.width = ''
      window.scrollTo(0, initialScrollPosition)
    }

    setOpen(open)
  }

  /**
   * Close mobile menu on larger screen
   */
  if (windowSize.width > 768 && open) {
    openDialog(false)
  }

  return (
    <div
      className={clsx(
        'fixed top-0 z-50 flex justify-center w-full max-w-full min-h-[var(--header-height)] transition-shadow',
        !open && [
          scrollPosition > 0
            ? [
                'bg-[#202124]/50 shadow-[hsla(0,0%,100%,0.1)_0px_-1px_0px_inset]',
                'before:contents-[""] before:absolute before:-z-50 before:w-full before:h-full before:backdrop-blur-sm before:backdrop-saturate-150 before:top-[-1px] before:[backface-visibility:hidden]'
              ]
            : 'bg-transparent'
        ]
      )}
    >
      <header
        className={clsx(
          'w-full max-w-7xl px-6 mx-auto flex items-center',
          open ? 'flex-col' : 'flex-row'
        )}
      >
        <div
          className={clsx(
            'flex-1 flex items-center justify-between w-full',
            'md:justify-start'
          )}
        >
          {/* Logo */}
          <a href={site.url} rel="home" className="text-lg font-bold">
            こと
          </a>

          {/* HORIZONTAL NAVIGATION HERE */}
          <div className="hidden md:flex">Nav</div>

          {/* MOBILE NAVIGATION */}
          <Collapsible.Root
            open={open}
            onOpenChange={openDialog}
            disabled={windowSize.width > 768}
            className="md:hidden"
          >
            <Collapsible.Trigger className="flex flex-col items-center justify-center w-6 h-10 before:contents-[''] before:-translate-y-1 before:h-[1px] before:w-[22px] before:bg-white after:contents-[''] after:translate-y-1 after:h-[1px] after:w-[22px] after:bg-white data-[state=open]:before:translate-y-[1px] data-[state=open]:before:rotate-45 data-[state=open]:after:-rotate-45 data-[state=open]:after:translate-y-0 before:transition-transform after:transition-transform" />

            {/* Navigation */}
            <Collapsible.Content asChild>
              <NavigationMenu.Root className="bg-[#202124] md:bg-transparent overflow-y-auto max-w-screen z-50 fixed md:relative inset-0 top-[64px] flex flex-col px-6 pb-6">
                <div className="order-2 md:order-1">
                  <NavigationMenu.List
                    className={clsx(
                      'w-full flex flex-col md:flex-row items-center md:justify-center md:gap-2 list-none'
                    )}
                  >
                    <MenuLink href="/dictionary">Dictionary</MenuLink>
                    <MenuLink href="/sets">Your Library</MenuLink>
                    <StudyMenu />
                  </NavigationMenu.List>
                </div>

                {/* Profile Menu */}
                <div className="md:flex-1">
                  <NavigationMenu.Sub defaultValue="sub1">
                    <NavigationMenu.List className="flex flex-col flex-1 ml-auto items-center justify-end gap-3 list-none">
                      <CardEditor modal={true}>
                        <button className="h-8 w-8 inline-flex items-center justify-center rounded hover:bg-white/5 transition-colors">
                          <PlusIcon className="w-5 h-5" />
                        </button>
                      </CardEditor>
                      <ProfileMenu />
                    </NavigationMenu.List>
                  </NavigationMenu.Sub>
                </div>

                {/* Space */}
                <span
                  aria-hidden={true}
                  className="my-6 select-none md:hidden"
                ></span>
              </NavigationMenu.Root>
            </Collapsible.Content>
          </Collapsible.Root>
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
