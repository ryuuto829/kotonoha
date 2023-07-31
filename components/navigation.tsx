import { Fragment, useEffect, useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/router'
import clsx from 'clsx'
import * as Avatar from '@radix-ui/react-avatar'
import * as NavigationMenu from '@radix-ui/react-navigation-menu'
import * as Collapsible from '@radix-ui/react-collapsible'
import {
  ChevronDownIcon,
  CounterClockwiseClockIcon,
  DrawingPinIcon,
  UploadIcon
} from '@radix-ui/react-icons'

import { useScrollPosition } from '../utils/useScrollPosition'
import { useWindowSize } from '../utils/useWindowSize'
import site from '../utils/site'
import ImportVocabulary from '../components/importVocabulary'
import { useRxCollection } from 'rxdb-hooks'
import { useUser } from '@supabase/auth-helpers-react'

const MOBILE_BREACKPOINT = 768

const linkStyle =
  'flex items-center gap-1 rounded-full leading-none text-[--color-text-dark] hover:text-[--color-text] data-[active]:bg-slate-400/10 data-[active]:text-[--color-text] transition-colors'

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
    href: '/study/srs',
    title: 'Due for Review (SRS)',
    description: 'Review words from all collection',
    Icon: CounterClockwiseClockIcon
  },
  {
    href: '/study/new',
    title: 'New words',
    description: 'Review words added today',
    Icon: DrawingPinIcon
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
  { href: '/sign-up', title: 'Log in', hasSpace: true }
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

function MobileMenu({
  open,
  changeOpen,
  openImportDialog,
  windowWidth
}: {
  open: boolean
  changeOpen: (open: boolean) => void
  openImportDialog: () => void
  windowWidth: number
}) {
  const router = useRouter()

  useEffect(() => {
    changeOpen(false)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [router.asPath])

  return (
    <Collapsible.Root
      open={open}
      onOpenChange={changeOpen}
      disabled={windowWidth > MOBILE_BREACKPOINT}
    >
      <Collapsible.Trigger className={menuTriggerStyle} />
      <Collapsible.Content asChild>
        <NavigationMenu.Root
          orientation="vertical"
          className="bg-[--color-base] text-[--color-text-dark] overflow-y-auto max-w-screen z-50 fixed inset-0 top-[var(--header-height)] flex flex-col p-6"
        >
          {/* PROFILE MENU */}
          <NavigationMenu.List>
            <button
              onClick={openImportDialog}
              className="flex items-center justify-center w-full h-10 bg-[--color-primary] rounded-full text-[--color-text-contrast]"
            >
              Import vocabulary
            </button>
            <p className="flex items-center h-20 border-b border-white/10">
              email@gmail.com
            </p>
            {profileMenuLinks.map(({ href, title }) => (
              <MenuLink key={href} href={href} className={mobileLinkStyle}>
                {title}
              </MenuLink>
            ))}
          </NavigationMenu.List>

          <span aria-hidden={true} className="my-6 select-none"></span>

          {/* MAIN MENU */}
          <NavigationMenu.List>
            {siteLinks.map(({ href, title }) => (
              <MenuLink key={href} href={href} className={mobileLinkStyle}>
                {title}
              </MenuLink>
            ))}
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

function Menu() {
  return (
    <NavigationMenu.Root>
      <NavigationMenu.List className="flex items-center gap-2">
        {/* Main links */}
        {siteLinks.map(({ href, title }) => (
          <MenuLink
            key={href}
            href={href}
            className={clsx(linkStyle, 'py-2 px-3')}
          >
            {title}
          </MenuLink>
        ))}

        {/* Study links */}
        <NavigationMenu.Item className="relative">
          <NavigationMenu.Trigger
            className={clsx(linkStyle, 'group py-2 px-3')}
          >
            Study
            <ChevronDownIcon
              aria-hidden
              className="group-data-[state=open]:-rotate-180 transition-transform"
            />
          </NavigationMenu.Trigger>
          <NavigationMenu.Content className="absolute top-[40px]">
            <NavigationMenu.List className="w-[360px] flex flex-col rounded-lg shadow-black/20 bg-[--color-base-light] py-2">
              {studyMenuLinks.map(({ href, title, description, Icon }) => (
                <MenuLink
                  key={href}
                  href={href}
                  className="flex items-center space-x-4 py-2 px-4 hover:bg-white/5"
                >
                  <Icon className="w-6 h-6" />
                  <div className="flex flex-col gap-1">
                    <p>{title}</p>
                    <p className="text-[--color-text-dark] text-xs">
                      {description}
                    </p>
                  </div>
                </MenuLink>
              ))}
            </NavigationMenu.List>
          </NavigationMenu.Content>
        </NavigationMenu.Item>
      </NavigationMenu.List>
    </NavigationMenu.Root>
  )
}

function ProfileMenu({ openImportDialog }: { openImportDialog: () => void }) {
  const preventPointerEvents = (event: any) => {
    const e = event as Event
    e.preventDefault()
  }

  return (
    <NavigationMenu.Root className="ml-auto flex items-center gap-4">
      <button
        onClick={openImportDialog}
        className="w-10 h-10 flex items-center justify-center hover:bg-[--color-button-light] rounded-full"
      >
        <UploadIcon className="w-5 h-5" />
      </button>
      <NavigationMenu.List>
        <NavigationMenu.Item>
          <NavigationMenu.Trigger
            onPointerMove={preventPointerEvents}
            onPointerLeave={preventPointerEvents}
            className={clsx(linkStyle, 'group bg-slate-400/10 rounded-full')}
          >
            <Avatar.Root className="inline-flex items-center justify-center w-10 h-10 rounded-full bg-gray-600 cursor-pointer">
              <Avatar.Fallback className="font-medium text-gray-300">
                DM
              </Avatar.Fallback>
            </Avatar.Root>
            <ChevronDownIcon className="mr-2" />
          </NavigationMenu.Trigger>
          <NavigationMenu.Content
            className="absolute top-[45px] left-full -translate-x-full w-[250px] bg-[--color-base-light] shadow-black/20 rounded-lg py-2 flex flex-col"
            onPointerLeave={preventPointerEvents}
          >
            <p className="flex items-center leading-5 px-5 py-2 text-[--color-text-dark]">
              email@gmail.com
            </p>
            <NavigationMenu.List>
              {profileMenuLinks.map(({ href, title, hasSpace }) => (
                <Fragment key={href}>
                  {hasSpace && (
                    <div className="border-t border-white/10 mx-5 my-3"></div>
                  )}
                  <MenuLink
                    href={href}
                    className={clsx(
                      'flex items-center leading-6 hover:bg-white/5',
                      'py-2 px-5'
                    )}
                  >
                    {title}
                  </MenuLink>
                </Fragment>
              ))}
            </NavigationMenu.List>
          </NavigationMenu.Content>
        </NavigationMenu.Item>
      </NavigationMenu.List>
    </NavigationMenu.Root>
  )
}

export default function Navigation() {
  const windowSize = useWindowSize()
  const scrollPosition = useScrollPosition()
  const collection = useRxCollection('new')

  const [initialScrollPosition, setInitialScrollPosition] = useState(0)
  const [openMobileMenu, setOpenMobileMenu] = useState(false)
  const [openQuickAdd, setOpenQuickAdd] = useState(false)
  const [importContent, setImportContent] = useState('<p>Hello World! 🌎️</p>')
  const [deck, setDeck] = useState('1')

  const uid = useUser()?.id

  const addVocabulary = async () => {
    const user = await collection?.insert({
      id: '123' + Date.now(),
      meaning: 'hey',
      user_id: uid || null
    })

    await collection
      ?.find()
      .exec()
      .then((doc) => console.log(doc))
  }

  const openImportDialog = () => {
    openMobileMenu && setOpenMobileMenu(false)
    setOpenQuickAdd(true)
  }

  /**
   * 1. Hide scrollbar and disable interaction with outside elements
   * 2. Prevent jumping to the top caused by the `position: fixed`
   */
  const toggleMobileMenu = (open: boolean) => {
    if (open) {
      document.body.style.position = 'fixed'
      document.body.style.width = '100%'
      setInitialScrollPosition(scrollPosition)
    } else {
      document.body.style.position = ''
      document.body.style.width = ''
      window.scrollTo(0, initialScrollPosition)
    }

    setOpenMobileMenu(open)
  }

  /**
   * Close mobile menu on larger screen
   */
  if (windowSize.width > MOBILE_BREACKPOINT && openMobileMenu) {
    toggleMobileMenu(false)
  }

  return (
    <div className="fixed top-0 z-50 flex justify-center w-full min-h-[--header-height] bg-[--color-base]">
      <header className="w-full max-w-7xl px-6 mx-auto flex items-center justify-between text-sm font-semibold text-[--color-text]">
        <a href={site.url} rel="home" className="tracking-[0.3em] uppercase">
          Kotoのha
        </a>
        <hr className="hidden md:flex h-7 mx-4 border-l border-white/20" />
        <div className="flex-1 hidden md:flex">
          <Menu />
        </div>
        <div className="hidden md:flex">
          <ProfileMenu openImportDialog={openImportDialog} />
        </div>
        <div className="md:hidden">
          <MobileMenu
            open={openMobileMenu}
            changeOpen={toggleMobileMenu}
            openImportDialog={openImportDialog}
            windowWidth={windowSize.width}
          />
        </div>
        <ImportVocabulary
          open={openQuickAdd}
          changeOpen={() => {
            setOpenQuickAdd(!openQuickAdd)
            setImportContent('')
          }}
          content={importContent}
          deck={deck}
          changeDeck={setDeck}
          changeContent={setImportContent}
          saveContent={addVocabulary}
        />
      </header>
    </div>
  )
}
