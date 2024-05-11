'use client'

import Image from 'next/image'
import axios from 'axios'
import { Loader2 } from 'lucide-react'
import { useEffect, useState } from 'react'

export default function Home() {
  const [author, setAuthor] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [results, setResults] = useState('')
  const [taskId, setTaskId] = useState('')
  const videoSrc = 'https://i.ytimg.com/vi/Ha4Y8HoaTmg/hqdefault.jpg'

  const handleSearch = async () => {
    try {
      setIsLoading(true)
      await axios({
        url: '/api/task',
        method: 'post',
        headers: {
          'Content-Type': 'application/json',
        },
        data: {
          name: 'youtube',
          author: author,
        },
      }).then((res) => {
        const data = res.data['result']
        console.log('res.data:', data)
        setTaskId(data['id'])
      })
    } catch (error) {
      console.log(error)
    }
  }

  useEffect(() => {
    const startQuery = async () => {
      let counter = 0
      const timer = setInterval(async () => {
        counter++
        if (counter >= 120) {
          clearInterval(timer) // 清除定时器
          setIsLoading(false)
          setResults('TIMEOUT')
        }
        await axios
          .get(`/api/task?q=${taskId}`)
          .then((response) => {
            const res = JSON.parse(response.data.result)
            setResults(res.value)
            if (res.state == 'SUCCESS') {
              clearInterval(timer)
              setIsLoading(false)
            }
          })
          .catch((error) => {
            setResults('FAILED')
            setIsLoading(false)
            console.error(error)
          })
      }, 5000)
    }
    console.log('startQuery taskId:', taskId)
    if (taskId != '') {
      startQuery()
    }
  }, [taskId])

  return (
    <main className='mx-auto md:max-w-6xl px-4'>
      <div className='flex flex-col items-center min-h-[300px] justify-center border bg-indigo-400 rounded-md text-white'>
        <h3>Search Authors</h3>
        <div>
          <Image
            className='w-[480px] h-auto'
            src={videoSrc}
            alt='Youtube video cover'
            width={480}
            height={360}
          />
        </div>
        <div className='mt-4 space-x-2 w-full flex justify-center p-4'>
          <input
            type='text'
            value={author}
            onChange={(e) => setAuthor(e.target.value)}
            className='p-2 w-[60%] outline-none text-black'
            placeholder='Input the youtube author'
          />
          <button
            onClick={handleSearch}
            className='border rounded-md p-1 font-semibold'>
            Search
          </button>
        </div>
        {isLoading ? (
          <Loader2 className='mr-4 h-16 w-16 animate-spin' />
        ) : (
          results
        )}
      </div>
    </main>
  )
}
