'use client'
import React from 'react'
import { useSidebar } from './SidebarProvider'
import Sidebar from './Sidebar'
import SearchAuthor from './search-author'

const SidebarDesktop = () => {
  const { isSidebarOpen, isLoading } = useSidebar()
  return (
    <Sidebar
      data-state={isSidebarOpen && !isLoading ? 'open' : 'closed'}
      className='peer absolute inset-y-0 z-30 hidden -translate-x-full border-r bg-muted duration-300 ease-in-out data-[state=open]:translate-x-0 lg:flex lg:w-[250px] xl:w-[300px]'>
      <SearchAuthor />
    </Sidebar>
  )
}

export default SidebarDesktop
