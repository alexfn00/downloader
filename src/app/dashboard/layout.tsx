import SideNav from './SideNav'
interface ChatLayoutProps {
  children: React.ReactNode
}

const DashboardLayout = ({ children }: ChatLayoutProps) => {
  return (
    <div className='flex h-[calc(100vh-4rem)] flex-col md:flex-row md:overflow-hidden'>
      <div className='w-full flex-none md:w-64 py-6 md:py-12'>
        <SideNav />
      </div>
      <div className='flex-grow md:overflow-y-auto'>{children}</div>
    </div>
  )
}

export default DashboardLayout
