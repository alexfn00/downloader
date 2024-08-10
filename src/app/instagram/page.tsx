'use client'

import MaxWidthWrapper from '@/components/MaxWidthWrapper'
import { Button } from '@/components/ui/button'
import { useQuery } from '@tanstack/react-query'
import { Loader2, X } from 'lucide-react'
import React, { useState } from 'react'
import { getInstagramInfo } from '../actions'

const Page = () => {
  const [userId, setUserId] = useState('')
  const { data, refetch, isLoading } = useQuery({
    queryFn: () => getInstagramInfo(userId),

    queryKey: ['InstagramInfo', { userId }],
    enabled: false, // disable this query from automatically running
    gcTime: 0,
  })

  return (
    <div>
      <MaxWidthWrapper className='sm:mb-12 mt-4 sm:mt-10 flex flex-col items-center justify-center text-center'>
        <div className='max-w-6xl w-full sm:px-6 lg:px8'>
          <h1 className='text-xl sm:text-3xl font-semibold sm:my-4'>
            Free Online Instagram Downloader
          </h1>
          <div className='flex w-full justify-between items-center space-x-2 py-2 sm:py-8 flex-col sm:flex-row border'>
            <div className='flex w-full items-end rounded border-4 border-green-700 mx-4'>
              <input
                type='text'
                value={userId}
                className='w-full px-4 py-4 border-none bg-transparent outline-none focus:outline-none'
                onChange={(e) => {
                  setUserId(e.target.value)
                }}
                placeholder='Paste instagram user id here'
              />
              <Button
                size='sm'
                variant='ghost'
                className='rounded-md m-2'
                onClick={() => {
                  setUserId('')
                }}>
                <X className='h-4 w-4' />
              </Button>
            </div>
            <div className='sm:w-1/4 w-full flex flex-row items-end sm:justify-end justify-end mt-4 sm:mt-0'>
              <Button
                size='sm'
                variant='ghost'
                className='rounded-md py-6 mr-4 bg-green-700 text-white hover:bg-green-600 hover:text-white'
                onClick={() => {
                  refetch()
                }}>
                {isLoading && <Loader2 className='mr-4 h-8 w-8 animate-spin' />}
                Download
              </Button>
            </div>
          </div>
          {!isLoading && userId.length > 0 && data && (
            <>
              <div>{data.username}</div>
              <div>{data.userid}</div>
            </>
          )}
        </div>
      </MaxWidthWrapper>
    </div>
  )
}

export default Page
