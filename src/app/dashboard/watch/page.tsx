'use client'
import { useRouter, useSearchParams } from 'next/navigation'
import React, { Suspense } from 'react'
import Downloader from '@/components/Downloader'
import { Button } from '@/components/ui/button'
import { ArrowLeft } from 'lucide-react'

const Page = () => {
  const router = useRouter()
  const searchParams = useSearchParams()
  const url = searchParams.get('url')

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
          {url && (
            <Downloader
              params={{
                url: url,
              }}
            />
          )}
        </div>
      </main>
    </Suspense>
  )
}

export default Page
