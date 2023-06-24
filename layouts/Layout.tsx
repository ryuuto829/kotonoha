import { ReactNode, useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/router'
import clsx from 'clsx'
import * as Avatar from '@radix-ui/react-avatar'
import * as NavigationMenu from '@radix-ui/react-navigation-menu'
import * as Collapsible from '@radix-ui/react-collapsible'
import {
  ChevronDownIcon,
  CounterClockwiseClockIcon,
  PlusIcon
} from '@radix-ui/react-icons'

import CardEditor from '../components/CardEditor'
import { useScrollPosition } from '../utils/useScrollPosition'
import { useWindowSize } from '../utils/useWindowSize'
import site from '../utils/site'

const MOBILE_BREACKPOINT = 768

const linkStyle =
  'flex items-center gap-1 py-2 px-3 rounded-full leading-none text-white/40 hover:text-white/90 data-[active]:bg-slate-400/5 data-[active]:text-white/90 bg-transparent transition-colors'
const mobileLinkStyle =
  'w-full flex items-center gap-1 leading-none text-white/50 hover:bg-white/5 h-12 border-b border-white/10 bg-transparent transition-colors'
const menuTriggerStyle = clsx(
  'flex flex-col items-center justify-center w-6 h-10',
  "before:contents-[''] before:-translate-y-1 before:h-[1px] before:w-[22px] before:bg-white data-[state=open]:before:translate-y-[1px] data-[state=open]:before:rotate-45 before:transition-transform",
  "after:contents-[''] after:translate-y-1 after:h-[1px] after:w-[22px] after:bg-white data-[state=open]:after:-rotate-45 data-[state=open]:after:translate-y-0 after:transition-transform"
)

const siteLinks = [
  {
    href: '/dictionary',
    title: 'Dictionary'
  },
  {
    href: '/sets',
    title: 'Your Library'
  }
]

const studyMenuLinks = [
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
]

const profileMenuLinks = [
  {
    href: '/dashboard',
    title: 'Dashboard'
  },
  {
    href: '/settings',
    title: 'Settings'
  },
  { href: '/login', title: 'Log in', hasSpace: true }
]

function MenuLink({ href, ...props }: { href: string; [x: string]: any }) {
  const router = useRouter()

  return (
    <NavigationMenu.Item>
      <NavigationMenu.Link active={router.pathname.startsWith(href)} asChild>
        <Link href={href} {...props} />
      </NavigationMenu.Link>
    </NavigationMenu.Item>
  )
}

/**
 * Option to open navigation menu on click instead of pointer enter
 */
export const preventHover = (event: any) => {
  const e = event as Event
  if (window.innerWidth < MOBILE_BREACKPOINT) e.preventDefault()
}

function MobileNavigation({
  open,
  openDialog,
  windowWidth
}: {
  open: boolean
  openDialog: (open: boolean) => void
  windowWidth: number
}) {
  return (
    <Collapsible.Root
      open={open}
      onOpenChange={openDialog}
      disabled={windowWidth > MOBILE_BREACKPOINT}
      className="md:hidden"
    >
      <Collapsible.Trigger className={menuTriggerStyle} />
      <Collapsible.Content asChild>
        <NavigationMenu.Root
          orientation="vertical"
          className="bg-[#202124] text-white/40 overflow-y-auto max-w-screen z-50 fixed inset-0 top-[var(--header-height)] flex flex-col px-6 pb-6"
        >
          <CardEditor modal={true}>
            <button className="h-8 w-full flex items-center justify-center rounded hover:bg-white/5 transition-colors">
              <PlusIcon className="w-5 h-5" />
            </button>
          </CardEditor>
          <p className="flex items-center h-20 border-b border-white/10">
            email@gmail.com
          </p>

          {/* PROFILE MENU */}
          <NavigationMenu.List>
            {profileMenuLinks.map(({ href, title }) => (
              <MenuLink key={href} href={href} className={mobileLinkStyle}>
                {title}
              </MenuLink>
            ))}
          </NavigationMenu.List>

          {/* SPACE */}
          <span aria-hidden={true} className="my-6 select-none"></span>

          <NavigationMenu.List>
            {/* MAIN MENU */}
            {siteLinks.map(({ href, title }) => (
              <MenuLink key={href} href={href} className={mobileLinkStyle}>
                {title}
              </MenuLink>
            ))}

            {/* STUDY MENU */}
            <NavigationMenu.Item>
              <NavigationMenu.Trigger
                onPointerMove={preventHover}
                onPointerLeave={preventHover}
                className={clsx(
                  mobileLinkStyle,
                  'group data-[state=open]:text-white/90'
                )}
              >
                Study
                <ChevronDownIcon
                  aria-hidden
                  className="group-data-[state=open]:-rotate-180 transition-transform"
                />
              </NavigationMenu.Trigger>
              <NavigationMenu.Content onPointerLeave={preventHover}>
                <NavigationMenu.List className="flex flex-col">
                  {studyMenuLinks.map(({ href, title, Icon }) => (
                    <MenuLink
                      key={href}
                      href={href}
                      className={mobileLinkStyle}
                    >
                      <Icon />
                      {title}
                    </MenuLink>
                  ))}
                </NavigationMenu.List>
              </NavigationMenu.Content>
            </NavigationMenu.Item>
          </NavigationMenu.List>
        </NavigationMenu.Root>
      </Collapsible.Content>
    </Collapsible.Root>
  )
}

function Navigation() {
  return (
    <>
      {/* Site Menu */}
      <NavigationMenu.Root className="hidden md:flex bg-transparent">
        <NavigationMenu.List className="flex items-center gap-2">
          {siteLinks.map(({ href, title }) => (
            <MenuLink key={href} href={href} className={linkStyle}>
              {title}
            </MenuLink>
          ))}

          {/* Study Menu */}
          <NavigationMenu.Item className="relative">
            <NavigationMenu.Trigger
              className={clsx(
                linkStyle,
                'group data-[state=open]:text-white/90'
              )}
            >
              Study
              <ChevronDownIcon
                aria-hidden
                className="group-data-[state=open]:-rotate-180 transition-transform"
              />
            </NavigationMenu.Trigger>
            <NavigationMenu.Content className="absolute top-[40px] left-0">
              <ul className="w-[250px] flex flex-col rounded-lg shadow-white bg-[#303136] p-2 text-sm">
                {studyMenuLinks.map(({ href, title, description, Icon }) => (
                  <MenuLink
                    key={href}
                    href={href}
                    className="flex flex-col p-3 rounded-lg hover:bg-white/5"
                  >
                    <div className="flex items-center gap-2 font-bold">
                      <Icon />
                      {title}
                    </div>
                    <div className="text-white/50">{description}</div>
                  </MenuLink>
                ))}
              </ul>
            </NavigationMenu.Content>
          </NavigationMenu.Item>
        </NavigationMenu.List>
      </NavigationMenu.Root>

      {/* Profile Menu */}
      <div className="flex-1 hidden md:flex">
        <NavigationMenu.Root className="ml-auto flex items-center gap-2">
          <CardEditor modal={true}>
            <button className="h-8 w-8 inline-flex items-center justify-center rounded hover:bg-white/5 transition-colors">
              <PlusIcon className="w-5 h-5" />
            </button>
          </CardEditor>
          <NavigationMenu.List>
            <NavigationMenu.Item>
              <NavigationMenu.Trigger
                onPointerMove={(e) => e.preventDefault()}
                onPointerLeave={(e) => e.preventDefault()}
                className={clsx(
                  linkStyle,
                  'group data-[state=open]:text-white/90'
                )}
              >
                <Avatar.Root className="inline-flex items-center justify-center w-10 h-10 rounded-full bg-gray-600 border-2 border-transparent hover:border-[#9da2ff] data-[state=open]:border-[#9da2ff] transition-colors cursor-pointer">
                  <Avatar.Fallback className="font-medium text-gray-300">
                    DM
                  </Avatar.Fallback>
                </Avatar.Root>
              </NavigationMenu.Trigger>
              <NavigationMenu.Content
                className="absolute top-full left-full -translate-x-full w-[250px] bg-[#303136] shadow-white rounded-lg py-2 text-sm flex flex-col"
                onPointerLeave={(e) => e.preventDefault()}
              >
                <p className="flex items-center leading-5 px-5 py-2 text-white/40">
                  email@gmail.com
                </p>
                <NavigationMenu.List>
                  {profileMenuLinks.map(({ href, title, hasSpace }) => (
                    <>
                      {hasSpace && (
                        <div className="border-t border-white/10 mx-5 my-3"></div>
                      )}
                      <MenuLink
                        key={href}
                        href={href}
                        className={clsx(
                          'flex items-center leading-5 hover:bg-white/5',
                          'py-2 px-5'
                        )}
                      >
                        {title}
                      </MenuLink>
                    </>
                  ))}
                </NavigationMenu.List>
              </NavigationMenu.Content>
            </NavigationMenu.Item>
          </NavigationMenu.List>
        </NavigationMenu.Root>
      </div>
    </>
  )
}

export default function Layout({ children }: { children: ReactNode }) {
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
    <section className="min-h-screen relative">
      {/* NAVIGATION */}
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
            open && 'justify-between'
          )}
        >
          {/* Logo */}
          <a href={site.url} rel="home" className="flex-1 text-lg font-bold">
            こと
          </a>

          {/* HORIZONTAL NAVIGATION */}
          <Navigation />

          {/* MOBILE NAVIGATION */}
          <MobileNavigation
            open={open}
            openDialog={openDialog}
            windowWidth={windowSize.width}
          />
        </header>
      </div>

      {/* CONTENT */}
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
