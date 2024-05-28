import React, { useEffect } from 'react'
import { useWatch } from './WatchProvider'
import { SkeletonCard } from './skeletons'
import { useInfiniteQuery } from '@tanstack/react-query'
import { fetchAuthors } from '@/app/actions'
import { useInView } from 'react-intersection-observer'

const SearchAuthor = () => {
  const { UpdateWatchId } = useWatch()

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

  if (status === 'pending')
    return (
      <div>
        <SkeletonCard />
        <SkeletonCard />
        <SkeletonCard />
        <SkeletonCard />
      </div>
    )

  if (status === 'error') return <div>{error.message}</div>

  return (
    <div className='mt-2 space-x-2 w-full p-4 overflow-auto '>
      <div className='mx-2 flex flex-row justify-center border sm:flex-col bg-gray-100 rounded-md '>
        {data.pages.map((page) => {
          return (
            <>
              {page.authors.map((item) => {
                return (
                  <div
                    key={item.id}
                    className='relative group overflow-hidden rounded-lg'>
                    <button
                      className='flex items-center justify-start hover:bg-slate-300 rounded-md w-full'
                      key={item.id}
                      onClick={() => {
                        UpdateWatchId(item.author)
                      }}>
                      <img
                        className='rounded-full mx-3 my-2'
                        alt='Author'
                        height={48}
                        width={48}
                        src={item.avatar}
                      />
                      <p className='text-md truncate hidden sm:block'>
                        {item.name}
                      </p>
                    </button>
                  </div>
                )
              })}
            </>
          )
        })}
      </div>
      <div ref={ref}>{isFetchingNextPage && 'Loading...'}ref</div>
    </div>
  )
}

export default SearchAuthor
