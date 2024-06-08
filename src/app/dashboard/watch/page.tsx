'use client'

import Player from '@/components/Player'
import React, { Suspense } from 'react'

const Page = () => {
  return (
    // You could have a loading skeleton as the `fallback` too
    <Suspense>
      <Player />
    </Suspense>
  )
}

export default Page
