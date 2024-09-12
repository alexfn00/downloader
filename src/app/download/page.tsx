import DownloadCounter from '@/components/DownloadCounter'
import MaxWidthWrapper from '@/components/MaxWidthWrapper'
import React from 'react'

const page = () => {
  return (
    <MaxWidthWrapper className='sm:mb-12 mt-4 sm:mt-10 flex flex-col items-center justify-center text-center'>
      <div className='max-w-6xl w-full sm:px-6 lg:px8'>
        <DownloadCounter />
      </div>
    </MaxWidthWrapper>
  )
}

export default page
