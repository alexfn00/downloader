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
              <div className='flex items-center justify-center border'>
                <div className='rounded-lg shadow-lg w-full'>
                  <div className='h-24 bg-blue-600 rounded-t-lg' />
                  <img
                    src='/placeholder.svg'
                    height='100'
                    width='100'
                    className='rounded-full mt-12 border-4 border-white mx-auto'
                    alt='User avatar'
                    style={{ aspectRatio: '100/100', objectFit: 'cover' }}
                  />
                  <div className='text-center mt-2'>
                    <h2 className='text-lg font-semibold'>{data.username}</h2>
                    <p className='text-gray-500'>{data.biography}</p>
                  </div>
                  <div className='flex justify-around my-4'>
                    <div className='text-center'>
                      <h3 className='font-semibold text-lg'>
                        {data.mediacount}
                      </h3>
                      <p className='text-gray-500'>Posts</p>
                    </div>
                    <div className='text-center'>
                      <h3 className='font-semibold text-lg'>
                        {data.followers}
                      </h3>
                      <p className='text-gray-500'>Followers</p>
                    </div>
                    <div className='text-center'>
                      <h3 className='font-semibold text-lg'>
                        {data.followees}
                      </h3>
                      <p className='text-gray-500'>Following</p>
                    </div>
                  </div>
                  <section className='grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 p-4 md:p-6'>
                    <>
                      {data.posts.map((item, index) => {
                        return (
                          <div
                            key={index}
                            className='relative group overflow-hidden rounded-lg'>
                            {item.is_video && (
                              <video
                                width='320'
                                height='240'
                                controls
                                preload='none'>
                                <source src={item.video_url} type='video/mp4' />
                                Your browser does not support the video tag.
                              </video>
                            )}

                            <div className='bg-white p-4 dark:bg-gray-950'>
                              <h3 className=' font-semibold text-sm md:text-md line-clamp-2'>
                                {item.caption}
                              </h3>
                              <div className='flex items-center justify-between text-sm text-gray-500 dark:text-gray-400'>
                                <span>viewed count</span>
                                <span>{item.video_view_count}</span>
                              </div>
                              <div className='flex items-center justify-between text-sm text-gray-500 dark:text-gray-400'>
                                <span>likes</span>
                                <span>{item.likes}</span>
                              </div>
                            </div>
                          </div>
                        )
                      })}
                    </>
                  </section>
                </div>
              </div>
            </>
          )}
        </div>
      </MaxWidthWrapper>
    </div>
  )
}

export default Page
