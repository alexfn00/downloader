'use client'
import { useRouter, useSearchParams } from 'next/navigation'
import React, { Suspense } from 'react'
import { useQuery } from '@tanstack/react-query'
import { getVideoInfo } from '@/app/actions'
import Downloader from '@/components/Downloader'
import { Button } from '@/components/ui/button'
import { ArrowLeft, Loader2 } from 'lucide-react'

const Page = () => {
  const router = useRouter()
  const searchParams = useSearchParams()
  const url = searchParams.get('url')

  const { data: todos, isLoading } = useQuery({
    queryFn: () => getVideoInfo(url),
    queryKey: ['parseURL', { url }],
    gcTime: 0,
  })
  return (
    // You could have a loading skeleton as the `fallback` too
    <Suspense>
      <main className='mx-auto max-w-full sm:max-w-6xl sm:mt-12'>
        <Button className='ml-4' onClick={() => router.back()}>
          <ArrowLeft />
          <span className='pl-2'></span>
          Back
        </Button>
        <h1 className='flex items-center justify-center text-xl sm:text-3xl font-semibold my-4'>
          Free Online Video Downloader
        </h1>
        <div className='flex flex-col items-center min-h-[300px] justify-center rounded-md'>
          {/* {boxSize.width}, {boxSize.height} */}
          {isLoading && (
            <div className='flex items-center justify-center'>
              <Loader2 className='mr-4 h-8 w-8 animate-spin' />
            </div>
          )}
          {!isLoading && url && todos && (
            <Downloader
              params={{
                url: url,
                data: todos,
              }}
            />
          )}
          {!isLoading && url && todos == undefined && (
            <p>Video is not ready or invalid video url</p>
          )}
        </div>
      </main>
    </Suspense>
  )
}

export default Page
