'use client'

import Link from 'next/link'
import { Loader2, Plus } from 'lucide-react'
import clsx from 'clsx'
import { usePathname } from 'next/navigation'
import { useInfiniteQuery } from '@tanstack/react-query'
import { fetchChannels } from '../actions'
import { SkeletonCard } from '@/components/skeletons'
import { useEffect } from 'react'
import { useInView } from 'react-intersection-observer'

export default function SideNav() {
  const pathname = usePathname()
  const { data, error, status, fetchNextPage, isFetchingNextPage } =
    useInfiniteQuery({
      queryKey: ['authors'],
      queryFn: ({ pageParam }) => fetchChannels({ pageParam }),
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

  if (status === 'pending')
    return (
      <div>
        <SkeletonCard />
      </div>
    )

  if (status === 'error') return <div>{error.message}</div>

  return (
    <div className='flex max-full flex-col px-3 md:px-2 md:h-[calc(100vh-6rem)] '>
      <Link
        className='mb-2 flex h-20 items-end justify-start rounded-md p-4 md:h-30'
        href={`/dashboard/manage/`}>
        <Plus />
        <div className='w-32 md:w-40'>
          <div className={` flex flex-row items-center leading-none`}>
            <p className='text-[20px] ml-2'>Add Channel</p>
          </div>
        </div>
      </Link>
      <div className='flex flex-col space-y-2 border-l-4 border-zinc-300 py-2 pl-4 md:border-l-0 md:border-t-2 md:pb-0 md:pl-0 md:pt-4'>
        <span className='font-bold text-2xl text-gray-900 my-4'>
          Your favorite channels
        </span>
      </div>
      <div className='flex grow flex-row overflow-auto justify-start space-x-2 md:flex-col md:space-x-0 md:space-y-2'>
        {data.pages.map((page) => {
          return (
            <>
              {page.channels.map((item) => {
                return (
                  <Link
                    key={item.id}
                    href={`/dashboard/videos/${item.id}`}
                    className={clsx(
                      'flex h-[48px] grow items-center justify-center gap-2 rounded-md bg-gray-50 p-3 text-sm font-medium hover:bg-sky-100 hover:text-blue-600 md:flex-none md:justify-start md:p-2 md:px-3 my-2',
                      {
                        'bg-sky-100 text-blue-600': pathname === item.id,
                      },
                    )}>
                    <img
                      className='rounded-full mx-3 my-2'
                      alt='Author'
                      height={48}
                      width={48}
                      src={item.channelAvatar}
                    />
                    <p className='hidden md:block overflow-ellipsis overflow-hidden whitespace-nowrap'>
                      {item.channelName}
                    </p>
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
