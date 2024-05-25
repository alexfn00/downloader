import React, { useState } from 'react'
import { useWatch } from './WatchProvider'
import axios from 'axios'
import { SkeletonCard } from './skeletons'
import { useQuery } from '@tanstack/react-query'
import { getUser } from '@/app/actions'

const SearchAuthor = () => {
  const { UpdateWatchId } = useWatch()
  const { data, isLoading, isError } = useQuery({
    queryFn: async () => await getUser({ userId: '0001' }),
    queryKey: ['q'], //Array according to Documentation
  })

  if (isError) return <div>Sorry There was an Error</div>

  return (
    <div className='mt-2 space-x-2 w-full p-4 overflow-auto '>
      <div className='mx-2 flex flex-row justify-center border sm:flex-col bg-gray-100 rounded-md '>
        {isLoading && <SkeletonCard />}
        {!isLoading &&
          data?.map((item, index) => (
            <>
              <div className='m-2'>
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
            </>
          ))}
      </div>
    </div>
  )
}

export default SearchAuthor
