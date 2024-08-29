'use client'

import MaxWidthWrapper from '@/components/MaxWidthWrapper'
import { Button } from '@/components/ui/button'
import { useQuery } from '@tanstack/react-query'
import { getVideoInfo } from './actions'
import { Loader2, X } from 'lucide-react'
import { useEffect, useState } from 'react'
import Downloader from '@/components/Downloader'
import { v4 as uuidv4 } from 'uuid'
import { useKindeAuth } from '@kinde-oss/kinde-auth-nextjs'
import DownloadCounter from '@/components/DownloadCounter'

export default function Home() {
  const [url, setUrl] = useState<string>('')
  const [videoId, setVideoId] = useState('')
  const { isAuthenticated, user } = useKindeAuth()

  useEffect(() => {
    if (!isAuthenticated) {
      localStorage.setItem('anonymousSession', uuidv4())
    } else {
      localStorage.removeItem('anonymousSession')
    }
  }, [isAuthenticated])

  const {
    data: todos,
    refetch,
    isLoading,
  } = useQuery({
    queryFn: () => getVideoInfo(url),

    queryKey: ['parseURL', { url }],
    enabled: false, // disable this query from automatically running
    gcTime: 0,
  })

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
                }}
                placeholder='Paste video link here'
              />
              <Button
                size='sm'
                variant='ghost'
                className='rounded-md m-2'
                onClick={() => {
                  setUrl('')
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
                  var n = url?.split('v=')
                  if (n !== undefined) {
                    setVideoId(n[1])
                    refetch()
                  }
                }}>
                {isLoading && <Loader2 className='mr-4 h-8 w-8 animate-spin' />}
                Download
              </Button>
            </div>
          </div>
          {!isLoading && videoId.length > 0 && todos && (
            <Downloader
              params={{
                url: url,
                data: todos,
              }}
            />
          )}
          <DownloadCounter />
        </div>
      </MaxWidthWrapper>
    </div>
  )
}
