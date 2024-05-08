'use client'

import axios from 'axios'
import { Loader2 } from 'lucide-react'
import { useEffect, useState } from 'react'

export default function Home() {
  const [author, setAuthor] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [results, setResults] = useState()
  const [taskId, setTaskId] = useState('')

  const handleSearch = async () => {
    try {
      setIsLoading(true)
      console.log('enter handleSearch')
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

      setIsLoading(false)
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
          console.log('定时器已结束')
        }
        await axios
          .get(`/api/task?q=${taskId}`)
          .then((response) => {
            const res = JSON.parse(response.data.result)
            console.log(res.state)
            if (res.state == 'SUCCESS') {
              clearInterval(timer)
            }
          })
          .catch((error) => {
            // 处理错误情况
            console.error(error)
          })
      }, 1000)
      console.log('timer:', timer)
    }
    console.log('startQuery taskId:', taskId)
    if (taskId != '') {
      console.log('startQuery')
      startQuery()
    }
    // startQuery()
  }, [taskId])

  return (
    <main className='mx-auto md:max-w-6xl px-4'>
      <div className='flex flex-col items-center min-h-[300px] justify-center border bg-indigo-400 rounded-md text-white'>
        <h3>Search Authors</h3>
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
