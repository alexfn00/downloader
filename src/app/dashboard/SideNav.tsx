'use client'

import Link from 'next/link'
import { Globe, Loader2 } from 'lucide-react'
import clsx from 'clsx'
import { usePathname } from 'next/navigation'
import { useInfiniteQuery } from '@tanstack/react-query'
import { fetchAuthors } from '../actions'
import { SkeletonCard } from '@/components/skeletons'
import { useEffect } from 'react'
import { useInView } from 'react-intersection-observer'

export default function SideNav() {
  const pathname = usePathname()
  const { data, error, status, fetchNextPage, isFetchingNextPage } =
    useInfiniteQuery({
      queryKey: ['authors'],
      queryFn: ({ pageParam }) => fetchAuthors({ pageParam }),
      initialPageParam: 0,
      getNextPageParam: (lastPage) => {
        return lastPage.nextPage
      },
    })

  const { ref, inView } = useInView()

  useEffect(() => {
    if (inView) {
      fetchNextPage()
    }
  }, [fetchNextPage, inView])
  console.log('inView:', inView)

  if (status === 'pending')
    return (
      <div>
        <SkeletonCard />
      </div>
    )

  if (status === 'error') return <div>{error.message}</div>

  return (
    <div className='flex max-full flex-col px-3 py-4 md:px-2 border bg-orange-300'>
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
      <div className='flex  grow flex-row justify-start space-x-2 md:flex-col md:space-x-0 md:space-y-2'>
        {data.pages.map((page) => {
          return (
            <>
              {page.authors.map((item) => {
                return (
                  <Link
                    key={item.name}
                    href={`/dashboard/videos/${item.author}`}
                    className={clsx(
                      'flex h-[48px] grow items-center justify-center gap-2 rounded-md bg-gray-50 p-3 text-sm font-medium hover:bg-sky-100 hover:text-blue-600 md:flex-none md:justify-start md:p-2 md:px-3',
                      {
                        'bg-sky-100 text-blue-600': pathname === item.author,
                      },
                    )}>
                    <img
                      className='rounded-full mx-3 my-2'
                      alt='Author'
                      height={48}
                      width={48}
                      src={item.avatar}
                    />
                    <p className='hidden md:block'>{item.name}</p>
                  </Link>
                )
              })}
            </>
          )
        })}
      </div>
      <div ref={ref} className='flex flex-col items-center'>
        {isFetchingNextPage && (
          <Loader2 className='mr-4 h-16 w-16 animate-spin' />
        )}
      </div>
    </div>
  )
}
