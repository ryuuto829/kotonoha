import { useState } from 'react'
import type { ReactNode } from 'react'
import Sidebar from '../components/Sidebar'
import Navbar from '../components/Navbar'

export default function Layout({ children }: { children: ReactNode }) {
  const [sidebarOpen, setSideBarOpen] = useState(true)

  return (
    <section className="grid grid-rows-[4rem_1fr] min-h-screen relative text-white/80">
      <Navbar sidebarOpen={sidebarOpen} changeSidebarOpen={setSideBarOpen} />
      <Sidebar open={sidebarOpen} />
      <div className={`transition-all ${sidebarOpen ? 'pl-[240px]' : 'pl-0'}`}>
        <main className="w-full h-full max-w-2xl mx-auto px-4 py-8 text-white text-opacity-80 shadow-md">
          {children}
        </main>
      </div>
    </section>
  )
}
