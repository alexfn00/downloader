import SideNav from './SideNav'
import { getKindeServerSession } from '@kinde-oss/kinde-auth-nextjs/server'
import { redirect } from 'next/navigation'
import { db } from '@/db'

interface ChatLayoutProps {
  children: React.ReactNode
}

const DashboardLayout = async ({ children }: ChatLayoutProps) => {
  const { getUser } = getKindeServerSession()
  const user = await getUser()

  if (!user || !user.id) redirect('/auth-callback?origin=dashboard')

  const dbUser = await db.user.findFirst({
    where: {
      id: user.id,
    },
  })
  if (!dbUser) redirect('/auth-callback?origin=dashboard')
  // const subscriptionPlan = await getUserSubscriptionPlan()

  return (
    <div className='flex h-[calc(100vh-4rem)] flex-col md:flex-row md:overflow-hidden'>
      <div className='w-full flex-none md:w-96 py-6 md:py-12 border-r-2'>
        <SideNav />
      </div>
      <div className='flex-grow md:overflow-y-auto'>{children}</div>
    </div>
  )
}

export default DashboardLayout
