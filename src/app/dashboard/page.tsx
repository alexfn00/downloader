'use client'

import { VideoList } from '@/components/component/video-list'
import axios from 'axios'
import { HttpsProxyAgent } from 'https-proxy-agent'
import React, { useEffect, useState } from 'react'

const Home = () => {
  return (
    <VideoList />
    // <div className='flex flex-col'>
    //   <button
    //     onClick={handleClick}
    //     className='border rounded-md p-1 font-semibold'>
    //     Download
    //   </button>
    // </div>
  )
}

export default Home
