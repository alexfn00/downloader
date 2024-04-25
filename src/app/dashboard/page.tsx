'use client'

import { VideoList } from '@/components/component/video-list'
import SearchAuthor from '@/components/search-author'
import axios from 'axios'
import { HttpsProxyAgent } from 'https-proxy-agent'
import React, { useEffect, useState } from 'react'

const Home = () => {
  const [query, setQuery] = useState()
  const search = (e: any) => {
    setTimeout(() => {
      setQuery(e.target.value)
    }, 500)
  }

  useEffect(() => {
    if (query) {
      fetch(`/api/search?q=${query}`)
        .then((response) => {
          return response.json()
        })
        .then((data) => {
          console.log(data)
        })
    }
  }, [query])
  return (
    <div className='flex flex-col'>
      <SearchAuthor />

      <VideoList />
    </div>
  )
}

export default Home
