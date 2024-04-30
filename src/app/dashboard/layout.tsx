import Header from '@/components/Header'
import SidebarDesktop from '@/components/SidebarDesktop'
import SidebarProvider from '@/components/SidebarProvider'
import WatchProvider from '@/components/WatchProvider'
import React from 'react'

interface ChatLayoutProps {
  children: React.ReactNode
}

const DashboardLayout = ({ children }: ChatLayoutProps) => {
  return (
    <SidebarProvider>
      <Header />
      <WatchProvider>
        <div className='relative flex h-[calc(100vh-4rem)] overflow-hidden'>
          <SidebarDesktop />
          <div className='group w-full overflow-auto pl-0 animate-in duration-300 ease-in-out peer-[[data-state=open]]:lg:pl-[250px] peer-[[data-state=open]]:xl:pl-[300px] '>
            {children}
          </div>
        </div>
      </WatchProvider>
    </SidebarProvider>
  )
}

export default DashboardLayout
