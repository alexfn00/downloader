'use client'

import { useInfiniteQuery } from '@tanstack/react-query'

import { SkeletonCard } from '@/components/skeletons'
import { fetchItems } from '../api'
import { useInView } from 'react-intersection-observer'
import { useEffect } from 'react'

const Page = () => {
  const { data, error, status, fetchNextPage, isFetchingNextPage } =
    useInfiniteQuery({
      queryKey: ['items'],
      queryFn: fetchItems,
      initialPageParam: 0,
      getNextPageParam: (lastPage) => {
        console.log(lastPage)
        return lastPage.nextPage
      },
    })

  const { ref, inView } = useInView({
    threshold: 1,
  })

  // useEffect(() => {
  //   console.log('inView:', inView)
  //   if (inView) {
  //     console.log('start fetchNextPage')
  //     fetchNextPage()
  //   }
  // }, [fetchNextPage, inView])

  if (status === 'pending')
    return (
      <div>
        <SkeletonCard />
      </div>
    )

  if (status === 'error') return <div>{error.message}</div>

  return (
    <div className='flex flex-col gap-2 bg-gray-700'>
      {data.pages.map((page) => {
        return (
          <div key={page.currentPage} className='flex flex-col gap2'>
            {page.data.map((item) => {
              return (
                <div key={item.id} className='rounded-md bg-gray-700 p-4'>
                  {item.name}
                </div>
              )
            })}
          </div>
        )
      })}

      <div ref={ref}>{isFetchingNextPage && 'Loading...'} ref element</div>

      <button
        onClick={() => {
          fetchNextPage()
        }}>
        Load More
      </button>
    </div>
  )
}

export default Page
