interface ChatLayoutProps {
  children: React.ReactNode
}

const DashboardLayout = ({ children }: ChatLayoutProps) => {
  return (
    <div className='flex h-screen flex-col md:flex-row md:overflow-hidden'>
      <div className='flex-grow p-6 md:overflow-y-auto md:p-12'>{children}</div>
    </div>
  )
}

export default DashboardLayout
