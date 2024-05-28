'use client'

import axios from 'axios'
import { Loader2 } from 'lucide-react'
import { useEffect, useState } from 'react'
import { SkeletonCard } from '@/components/skeletons'
import { useInfiniteQuery, useQueryClient } from '@tanstack/react-query'
import { fetchAuthors } from '../actions'
import { useInView } from 'react-intersection-observer'
import { Button } from '@/components/ui/button'

export default function Home() {
  // const queryClient = useQueryClient()
  const [author, setAuthor] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [results, setResults] = useState('')
  const [taskId, setTaskId] = useState('')

  const { data, error, status, fetchNextPage, isFetchingNextPage } =
    useInfiniteQuery({
      queryKey: ['authors'],
      queryFn: ({ pageParam }) => fetchAuthors({ pageParam }),
      initialPageParam: 0,
      getNextPageParam: (lastPage) => {
        return lastPage.nextPage
      },
    })

  const { ref, inView } = useInView()

  useEffect(() => {
    if (inView) {
      fetchNextPage()
    }
  }, [fetchNextPage, inView])

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
        fetchNextPage()
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

  if (status === 'pending')
    return (
      <div>
        <SkeletonCard />
      </div>
    )

  if (status === 'error') return <div>{error.message}</div>

  return (
    <main className='md:max-w-6xl px-4 mx-auto w-2/3'>
      <div className='flex flex-col items-center min-h-[200px] justify-center border bg-indigo-400 rounded-md text-white'>
        <h3 className=' w-11/12 text-center'>Search Authors</h3>
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

      <section className='grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 p-4 md:p-6'>
        {data.pages.map((page) => {
          return (
            <>
              {page.authors.map((item) => {
                return (
                  <div
                    key={item.name}
                    className='flex items-center justify-between bg-gray-100 dark:bg-gray-700 p-4 rounded-md'>
                    <div>
                      <img
                        className='rounded-full mx-3 my-2'
                        alt='Author'
                        height={48}
                        width={48}
                        src={item.avatar}
                      />
                      <p className='hidden md:block'>{item.name}</p>
                    </div>
                    <Button
                      size='sm'
                      variant='ghost'
                      onClick={() => {
                        setAuthor(item.author)
                        handleSearch()
                      }}>
                      Update
                    </Button>
                  </div>
                )
              })}
            </>
          )
        })}
        <div ref={ref} className='flex flex-col items-center'>
          {isFetchingNextPage && (
            <Loader2 className='mr-4 h-16 w-16 animate-spin' />
          )}
        </div>
      </section>
    </main>
  )
}
