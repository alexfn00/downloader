'use client'

import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import axios from 'axios'
import { Loader2 } from 'lucide-react'
import { useEffect, useState } from 'react'
import { SkeletonCard } from '@/components/skeletons'
import {
  useInfiniteQuery,
  useMutation,
  useQueryClient,
} from '@tanstack/react-query'
import { deleteChannel, fetchAuthors } from '../actions'
import { useInView } from 'react-intersection-observer'
import { Button } from '@/components/ui/button'
import Link from 'next/link'

export default function Home() {
  const queryClient = useQueryClient()
  const [author, setAuthor] = useState<string>('')
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

  const { mutateAsync: handleDelete, isPending: isDeletePending } = useMutation(
    {
      mutationFn: deleteChannel,
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: ['authors'] })
      },
    },
  )

  // const handleDelete = async (channelId: string) => {

  // }
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
              // revalidatePath('/task')
              queryClient.invalidateQueries({
                queryKey: ['authors'],
                exact: true,
              })
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
    <main className='md:max-w-6xl md:px-4 mx-auto md:w-2/3 border'>
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

      {isDeletePending && (
        <div className='flex items-center justify-center'>
          <Loader2 className='mr-4 h-8 w-8 animate-spin' />
        </div>
      )}

      <Table>
        <TableCaption>Your favourite authors</TableCaption>
        <TableHeader>
          <TableRow>
            <TableHead className='w-[100px]'></TableHead>
            <TableHead>Name</TableHead>
            <TableHead>Last Update</TableHead>
            <TableHead className='text-right'>Action</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {data.pages.map((page) => {
            return (
              <>
                {page.channels.map((item) => {
                  return (
                    <TableRow key={item.id}>
                      <TableCell className='font-medium'>
                        <Link href={`/dashboard/videos/${item.id}`}>
                          <img
                            className='rounded-full mx-3 my-2'
                            alt='Author'
                            height={48}
                            width={48}
                            src={item.channelAvatar}
                          />
                        </Link>
                      </TableCell>
                      <TableCell>
                        <Link href={`/dashboard/videos/${item.id}`}>
                          {item.channelName}
                        </Link>
                      </TableCell>
                      <TableCell>
                        {new Date(item.updatedAt).toLocaleString()}
                      </TableCell>
                      <TableCell className='text-right'>
                        <Button
                          size='sm'
                          variant='ghost'
                          onClick={() => {
                            setAuthor(item.channelId)
                            handleSearch()
                          }}>
                          Update
                        </Button>
                        <Button
                          size='sm'
                          variant='destructive'
                          onClick={() => {
                            handleDelete({ channelId: item.channelId })
                          }}>
                          Delete
                        </Button>
                      </TableCell>
                    </TableRow>
                  )
                })}
              </>
            )
          })}
        </TableBody>
        <div ref={ref} className='flex flex-col items-center'>
          {isFetchingNextPage && (
            <Loader2 className='mr-4 h-16 w-16 animate-spin' />
          )}
        </div>
      </Table>
    </main>
  )
}
