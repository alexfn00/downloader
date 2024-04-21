'use client'

import axios from 'axios'
import { HttpsProxyAgent } from 'https-proxy-agent'
import React from 'react'

const Home = () => {
  const handleClick = async () => {
    const res = await axios.get(`/api/title`)
    console.log(res.data)
  }

  return (
    <div className='flex flex-col'>
      <button
        onClick={handleClick}
        className='border rounded-md p-1 font-semibold'>
        Download
      </button>
    </div>
  )
}

export default Home
