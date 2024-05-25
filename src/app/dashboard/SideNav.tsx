'use client'

import Link from 'next/link'
import { Globe, Loader2 } from 'lucide-react'
import clsx from 'clsx'
import { usePathname } from 'next/navigation'
import { useQuery, useQueryClient } from '@tanstack/react-query'
import { getUser } from '../actions'

const links = [
  { name: 'Home', href: '/dashboard', icon: Globe },
  {
    name: 'Invoices',
    href: '/dashboard/invoices',
    icon: Globe,
  },
  { name: 'Customers', href: '/dashboard/customers', icon: Globe },
]

export default function SideNav() {
  const queryClient = useQueryClient()

  const pathname = usePathname()
  const {
    data: links,
    isLoading,
    isError,
  } = useQuery({
    queryFn: async () => await getUser({ userId: '0001' }),
    queryKey: ['q'], //Array according to Documentation
    staleTime: Infinity,
    // gcTime: 0,
  })

  if (isError) return <div>Sorry There was an Error</div>

  return (
    <div className='flex h-full flex-col px-3 py-4 md:px-2'>
      <Link
        className='mb-2 flex h-20 items-end justify-start rounded-md bg-blue-600 p-4 md:h-40'
        href='/'>
        <div className='w-32 text-white md:w-40'>
          <div
            className={` flex flex-row items-center leading-none text-white`}>
            <Globe className='h-12 w-12 rotate-[15deg]' />
            <p className='text-[44px]'>Acme</p>
          </div>
        </div>
      </Link>
      <div className='flex grow flex-row justify-start space-x-2 md:flex-col md:space-x-0 md:space-y-2'>
        {isLoading && <Loader2 className='mr-4 h-16 w-16 animate-spin' />}
        {!isLoading &&
          links?.map((link) => {
            // const LinkIcon = link.icon
            return (
              <Link
                key={link.name}
                href={`/dashboard/videos/${link.author}`}
                className={clsx(
                  'flex h-[48px] grow items-center justify-center gap-2 rounded-md bg-gray-50 p-3 text-sm font-medium hover:bg-sky-100 hover:text-blue-600 md:flex-none md:justify-start md:p-2 md:px-3',
                  {
                    'bg-sky-100 text-blue-600': pathname === link.author,
                  },
                )}>
                <img
                  className='rounded-full mx-3 my-2'
                  alt='Author'
                  height={48}
                  width={48}
                  src={link.avatar}
                />
                <p className='hidden md:block'>{link.name}</p>
              </Link>
            )
          })}
      </div>
    </div>
  )
}
