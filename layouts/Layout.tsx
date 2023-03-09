import { useState, ReactNode } from 'react'
import Sidebar from '../components/Sidebar'
import Navbar from '../components/Navbar'

export default function Layout({ children }: { children: ReactNode }) {
  const [sidebarOpen, setSideBarOpen] = useState(false)

  return (
    <section className="flex flex-col h-screen overflow-hidden">
      <Navbar sidebarOpen={sidebarOpen} changeSidebarOpen={setSideBarOpen} />
      <div className="flex-1 overflow-hidden">
        <Sidebar open={sidebarOpen} />

        {/* Overlay */}
        <div
          onClick={() => setSideBarOpen(false)}
          className={`fixed right-0 bottom-0 w-screen h-[calc(100vh-64px)] bg-black/70 z-10 select-none ${
            sidebarOpen ? 'md:hidden' : 'hidden'
          }`}
        ></div>

        <div
          className={`transition-all min-h-full h-full pl-0 overflow-y-auto ${
            sidebarOpen ? 'md:pl-[var(--sidebar-width)]' : ''
          }`}
        >
          <main className="w-full max-w-3xl mx-auto px-4 py-8">{children}</main>
        </div>
      </div>
    </section>
  )
}
