'use client'

import { Button } from './ui/button'
import { PanelLeft } from 'lucide-react'
import { useSidebar } from './SidebarProvider'

const SidebarToggle = () => {
  const { toggleSidebar } = useSidebar()
  return (
    <Button
      className='-ml-2 size-9 p-0 lg:flex'
      variant='ghost'
      onClick={() => {
        toggleSidebar()
      }}>
      <PanelLeft className='size-6' />
      <span className='sr-only'>Toggle Sidebar</span>
    </Button>
  )
}

export default SidebarToggle
