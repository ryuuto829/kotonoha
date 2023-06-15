import { ReactNode } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/router'
// import * as DropdownMenu from '@radix-ui/react-dropdown-menu'
import * as Dialog from '@radix-ui/react-dialog'
import * as Avatar from '@radix-ui/react-avatar'
import {
  ChevronDownIcon,
  CounterClockwiseClockIcon,
  Cross1Icon,
  // EnterIcon,
  // GearIcon,
  HamburgerMenuIcon,
  PlusIcon
  // ReaderIcon
  // StackIcon
} from '@radix-ui/react-icons'
import CardEditor from '../components/CardEditor'
// import { useRxDB, useRxQuery } from '../lib/rxdb-hooks'
// import { AppDatabase } from '../lib/types'
import clsx from 'clsx'
import site from '../utils/site'
import * as NavigationMenu from '@radix-ui/react-navigation-menu'
import { useScrollPosition } from '../utils/useScrollPosition'

// const PROFILE_NAVIGATION_LINKS = [
//   { name: 'Dashboard', url: '/dashboard', Icon: ReaderIcon },
//   { name: 'Settings', url: '/settings', Icon: GearIcon }
// ]

// function ProfileMenu() {
//   return (
//     <DropdownMenu.Root modal={false}>
//       <DropdownMenu.Trigger asChild>
//         <Avatar.Root className="inline-flex items-center justify-center w-10 h-10 rounded-full bg-gray-600 border-2 border-transparent hover:border-[#9da2ff] data-[state=open]:border-[#9da2ff] transition-colors cursor-pointer">
//           <Avatar.Fallback className="font-medium text-gray-300">
//             DM
//           </Avatar.Fallback>
//         </Avatar.Root>
//       </DropdownMenu.Trigger>
//       <DropdownMenu.Portal>
//         <DropdownMenu.Content
//           align="end"
//           sideOffset={5}
//           className="py-1.5 z-50 w-[210px] rounded-md bg-[#303136] border border-white/10 text-sm"
//         >
//           {PROFILE_NAVIGATION_LINKS.map(({ name, url, Icon }) => (
//             <DropdownMenu.Item key={name} asChild>
//               <Link
//                 href={url}
//                 className="flex items-center gap-2.5 mx-1.5 px-1.5 h-8 max-w-[calc(100%-12px)] rounded hover:bg-white/5 outline-none"
//               >
//                 <Icon className="w-4 h-4" />
//                 <span>{name}</span>
//               </Link>
//             </DropdownMenu.Item>
//           ))}
//           <hr className="h-[1px] bg-white/10 my-1 border-none" />
//           <Link
//             href="/login"
//             className="flex items-center gap-2.5 mx-1.5 px-1.5 h-8 max-w-[calc(100%-12px)] rounded hover:bg-white/5 outline-none"
//           >
//             <EnterIcon className="w-4 h-4" />
//             <span>Log in</span>
//           </Link>
//           <hr className="h-[1px] bg-white/10 my-1 border-none" />
//           <a
//             href="#"
//             className="text-xs flex items-center gap-2.5 mx-1.5 px-1.5 h-8 max-w-[calc(100%-12px)] rounded hover:bg-white/5 outline-none"
//           >
//             <span className="ml-1">v0.1.0</span>
//             <span>·</span>
//             <span>What&apos;s new</span>
//           </a>
//         </DropdownMenu.Content>
//       </DropdownMenu.Portal>
//     </DropdownMenu.Root>
//   )
// }

function ProfileMenu() {
  return (
    <NavigationMenu.Item className="relative w-full md:w-auto">
      <NavigationMenu.Trigger
        onPointerMove={(e) => e.preventDefault()}
        onPointerLeave={(e) => e.preventDefault()}
        className={clsx(menuLinkStyle, 'group data-[state=open]:text-white/90')}
      >
        <Avatar.Root className="inline-flex items-center justify-center w-10 h-10 rounded-full bg-gray-600 border-2 border-transparent hover:border-[#9da2ff] data-[state=open]:border-[#9da2ff] transition-colors cursor-pointer">
          <Avatar.Fallback className="font-medium text-gray-300">
            DM
          </Avatar.Fallback>
        </Avatar.Root>
      </NavigationMenu.Trigger>
      <NavigationMenu.Content
        className="md:absolute top-full left-full -translate-x-full"
        onPointerLeave={(e) => e.preventDefault()}
      >
        <ul className="w-full md:w-[250px] flex flex-col rounded-lg shadow-white bg-[#303136] p-2 text-sm">
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
                  className="flex flex-col p-3 rounded-lg hover:bg-white/5"
                >
                  <div className="flex items-center gap-2 font-bold">
                    {title}
                  </div>
                </Link>
              </NavigationMenu.Link>
            </NavigationMenu.Item>
          ))}
        </ul>
      </NavigationMenu.Content>
    </NavigationMenu.Item>
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
        <NavigationMenu.Root className="">
          <NavigationMenu.List className="flex flex-col items-center justify-center gap-2 list-none">
            <MenuLink href="/dictionary">Dictionary</MenuLink>
            <MenuLink href="/sets">Your Library</MenuLink>
            <StudyMenu />
          </NavigationMenu.List>

          <div className="flex flex-col flex-1 ml-auto items-center justify-end gap-3">
            <CardEditor modal={true}>
              <button className="h-8 w-8 inline-flex items-center justify-center rounded hover:bg-white/5 transition-colors">
                <PlusIcon className="w-5 h-5" />
              </button>
            </CardEditor>
            <ProfileMenu />
          </div>
        </NavigationMenu.Root>
      </Dialog.Content>
    </Dialog.Root>
  )
}

const menuLinkStyle =
  'flex items-center gap-1 py-2 px-3 rounded-full leading-none text-white/40 hover:text-white/90 bg-transparent transition-colors'

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
        <ul className="w-full md:w-[250px] flex flex-col rounded-lg shadow-white bg-[#303136] p-2 text-sm">
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
                  className="flex flex-col p-3 rounded-lg hover:bg-white/5"
                >
                  <div className="flex items-center gap-2 font-bold">
                    <Icon />
                    {''}
                    {title}
                  </div>
                  <div className="text-white/50">{description}</div>
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
  const scrollPosition = useScrollPosition()

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

  return (
    <div
      className={clsx(
        'fixed top-0 z-40 flex justify-center w-full max-w-full min-h-[64px] transition-shadow',
        scrollPosition > 0
          ? 'bg-[#202124]/50 shadow-[hsla(0,0%,100%,0.1)_0px_-1px_0px_inset] before:contents-[""] before:absolute before:-z-10 before:w-full before:h-full before:backdrop-blur-sm before:backdrop-saturate-150 before:top-[-1px] before:[backface-visibility:hidden]'
          : 'bg-transparent'
      )}
    >
      {/* <header className="max-w-7xl w-full px-6 mx-auto flex items-center"> */}
      {/* Menu */}
      <NavigationMenu.Root className="max-w-7xl w-full px-6 mx-auto flex items-center">
        {/* Logo */}
        <div className="flex-1 justify-start">
          <a href={site.url} rel="home" className="text-lg font-bold">
            こと
          </a>
        </div>

        {/* Navigation */}

        <NavigationMenu.List className="hidden md:flex items-center justify-center gap-2 list-none">
          <MenuLink href="/dictionary">Dictionary</MenuLink>
          <MenuLink href="/sets">Your Library</MenuLink>
          <StudyMenu />
        </NavigationMenu.List>

        {/* Profile */}
        <div className="flex-1">
          <NavigationMenu.List className="hidden md:flex flex-1 ml-auto items-center justify-end gap-3 list-none">
            <CardEditor modal={true}>
              <button className="h-8 w-8 inline-flex items-center justify-center rounded hover:bg-white/5 transition-colors">
                <PlusIcon className="w-5 h-5" />
              </button>
            </CardEditor>
            <ProfileMenu />
          </NavigationMenu.List>
        </div>

        {/* Sidebar */}
        <Sidebar />
      </NavigationMenu.Root>

      {/* </header> */}
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
