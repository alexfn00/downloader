'use client'
import { fetchVideos } from '@/app/actions'
import { SkeletonCard } from '@/components/skeletons'
import { useInfiniteQuery, useQueryClient } from '@tanstack/react-query'
import { Loader2 } from 'lucide-react'
import Link from 'next/link'
import { useEffect } from 'react'
import { useInView } from 'react-intersection-observer'

const Page = ({ params }: { params: { id: string } }) => {
  const queryClient = useQueryClient()
  const { data, error, status, fetchNextPage, isFetchingNextPage } =
    useInfiniteQuery({
      queryKey: ['items'],
      queryFn: ({ pageParam }) => fetchVideos({ author: params.id, pageParam }),
      initialPageParam: 0,
      getNextPageParam: (lastPage) => {
        return lastPage.nextPage
      },
    })

  const { ref, inView } = useInView()

  useEffect(() => {
    queryClient.resetQueries({ queryKey: ['items'], exact: true })
  }, [params.id, queryClient])

  useEffect(() => {
    if (inView) {
      fetchNextPage()
    }
  }, [fetchNextPage, inView])

  if (status === 'pending')
    return (
      <section className='grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 p-4 md:p-6'>
        <div className='relative group overflow-hidden rounded-lg'>
          <SkeletonCard />
        </div>
        <div className='relative group overflow-hidden rounded-lg'>
          <SkeletonCard />
        </div>
        <div className='relative group overflow-hidden rounded-lg'>
          <SkeletonCard />
        </div>
        <div className='relative group overflow-hidden rounded-lg'>
          <SkeletonCard />
        </div>
      </section>
    )

  if (status === 'error') return <div>{error.message}</div>
  return (
    <>
      <section className='grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 p-4 md:p-6'>
        {data.pages.map((page) => {
          return (
            <>
              {page.videos.map((item) => {
                return (
                  <div
                    key={item.id}
                    className='relative group overflow-hidden rounded-lg'>
                    <Link
                      className='absolute inset-0 z-10'
                      href={`/dashboard/watch?url=${item.href}`}>
                      {/* <span className='sr-only text-white'>Play</span> */}
                      <div className='absolute inset-0 flex items-center justify-center'>
                        {/* <Play className='w-12 h-12 text-blue-700 drop-shadow-lg' /> */}
                      </div>
                    </Link>
                    <div>
                      <img
                        className='w-[480px] h-auto'
                        src={item.thumbnail}
                        alt='Youtube video cover'
                      />
                    </div>

                    <div className='bg-white p-4 dark:bg-gray-950'>
                      <h3 className=' font-semibold text-sm md:text-md line-clamp-2'>
                        {item.title}
                      </h3>
                      <div className='flex items-center justify-between text-sm text-gray-500 dark:text-gray-400'>
                        <span>{item.name}</span>
                        <span>{item.period}</span>
                      </div>
                      <div className='flex items-center justify-between text-sm text-gray-500 dark:text-gray-400'>
                        <span>{item.published}</span>
                        <span>{item.viewCount}</span>
                      </div>
                    </div>
                  </div>
                )
              })}
            </>
          )
        })}
      </section>
      <div ref={ref} className='flex flex-col items-center'>
        {isFetchingNextPage && (
          <Loader2 className='mr-4 h-16 w-16 animate-spin' />
        )}
      </div>
    </>
  )
}

export default Page
