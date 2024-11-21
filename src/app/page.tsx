'use client'

import MaxWidthWrapper from '@/components/MaxWidthWrapper'
import { Button } from '@/components/ui/button'
import { useQuery } from '@tanstack/react-query'
import { getVideoInfo } from './actions'
import { Loader2, X } from 'lucide-react'
import { useState } from 'react'
import Downloader from '@/components/Downloader'
import Image from 'next/image'

export default function Home() {
  const [url, setUrl] = useState<string>('')
  const [isEnable, setIsEnable] = useState(false)
  const [isDisabled, setIsDisabled] = useState(true)

  return (
    <div>
      <MaxWidthWrapper className='sm:mb-12 mt-4 sm:mt-10 flex flex-col items-center justify-center text-center'>
        <div className='max-w-6xl w-full sm:px-6 lg:px8'>
          <h1 className='text-xl sm:text-3xl font-semibold sm:my-4'>
            Free Online Video Downloader
          </h1>
          <div className='flex w-full justify-between items-center space-x-2 py-2 sm:py-8 flex-col sm:flex-row border'>
            <div className='flex w-full items-end rounded border-4 border-green-700 mx-4'>
              <input
                type='text'
                value={url}
                className='w-full px-4 py-4 border-none bg-transparent outline-none focus:outline-none'
                onChange={(e) => {
                  setUrl(e.target.value)
                  if (e.target.value.length > 0) {
                    setIsDisabled(false)
                  } else {
                    setIsDisabled(true)
                  }
                }}
                placeholder='Paste video URL here'
              />
              <Button
                size='sm'
                variant='ghost'
                className='rounded-md m-2'
                onClick={() => {
                  setUrl('')
                  setIsDisabled(true)
                }}>
                <X className='h-4 w-4' />
              </Button>
            </div>
            <div className='sm:w-1/4 w-full flex flex-row items-end sm:justify-end justify-end mt-4 sm:mt-0'>
              <Button
                size='sm'
                variant='ghost'
                disabled={isDisabled}
                className='rounded-md py-6 mr-4 bg-green-700 text-white hover:bg-green-600 hover:text-white'
                onClick={() => {
                  setIsEnable(true)
                }}>
                Download
              </Button>
            </div>
          </div>
          {isEnable && (
            <Downloader
              params={{
                url: url,
              }}
            />
          )}
          <div className='mb-12 px-6 lg:px-8 flex flex-col items-center justify-center text-center'>
            <div className='max-auto max-w-2xl '>
              <h2 className='mt-2 font-bold text-4xl text-gray-900 sm:text-5xl'>
                2 steps to download youtube videos
              </h2>
              <p className='mt-4 text-lg text-gray-600'>
                Easily access and download a wide range of content, from
                blockbuster movies and popular TV series to exciting sports
                clips. Simply paste the video URL into the designated field and
                click the download button. You can also watch videos online
                without ads and listen to them while driving
              </p>
            </div>
          </div>
          {/* steps */}
          <ol className='my-8 space-y-10 pt-8 md:space-y-0'>
            <li className='md:flex-1'>
              <div className='flex flex-col space-y-2 border-l-4 border-zinc-300 py-2 pl-4 md:border-l-0 md:border-t-2 md:pb-0 md:pl-0 md:pt-4 mb-10'>
                <span className='text-xl font-semibold text-blue-600'>
                  Step 1
                </span>
                <span className=''>
                  Copy & paste the video URL into the designated field and click
                  the download button
                </span>
                <div className='mx-auto max-w-6xl px-6 lg:px8'>
                  <div className='mt-16 flow-root sm:mt-24'>
                    <div className='-m-2 rounded-xl bg-gray-900/5 p-2 ring-1 ring-inset ring-gray-900/10 lg:-m-4 lg:rounded-2xl lg:p-4'>
                      <Image
                        src='/dashboard-preview.png'
                        alt='searching preview'
                        width={1021}
                        height={904}
                        quality={100}
                        className='rounded-md bg-white p-2 sm:p-8 md:p-20 shadow-2xl ring-1 ring-gray-900/10'
                      />
                    </div>
                  </div>
                </div>
              </div>
            </li>
            <li className='md:flex-1'>
              <div className='flex flex-col space-y-2 border-l-4 border-zinc-300 py-2 pl-4 md:border-l-0 md:border-t-2 md:pb-0 md:pl-0 md:pt-4'>
                <span className='text-xl font-semibold text-blue-600'>
                  Step 2
                </span>
                <span className=''>
                  Select the video drop-down box and click the download button,
                  then wait for the task to complete
                </span>
                <div className='mx-auto max-w-6xl px-6 lg:px8'>
                  <div className='mt-16 flow-root sm:mt-24'>
                    <div className='-m-2 rounded-xl bg-gray-900/5 p-2 ring-1 ring-inset ring-gray-900/10 lg:-m-4 lg:rounded-2xl lg:p-4'>
                      <Image
                        src='/download-button.jpg'
                        alt='download preview'
                        width={1021}
                        height={904}
                        quality={100}
                        className='rounded-md bg-white p-2 sm:p-8 md:p-20 shadow-2xl ring-1 ring-gray-900/10'
                      />
                    </div>
                  </div>
                </div>
              </div>
            </li>
          </ol>
        </div>
      </MaxWidthWrapper>
    </div>
  )
}
