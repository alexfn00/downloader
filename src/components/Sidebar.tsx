'use client'
import { cn } from '@/lib/utils'
import { useSidebar } from './SidebarProvider'
export interface SidebarProps extends React.ComponentProps<'div'> {}

const Sidebar = ({ className, children }: SidebarProps) => {
  const { isSidebarOpen, isLoading } = useSidebar()
  return (
    <div
      data-state={isSidebarOpen && !isLoading ? 'open' : 'closed'}
      className={cn(className, 'h-full flex-col')}>
      {children}
    </div>
  )
}

export default Sidebar
