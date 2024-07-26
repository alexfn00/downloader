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
import { Loader2, Search } from 'lucide-react'
import { useEffect, useState } from 'react'
import { SkeletonCard } from '@/components/skeletons'
import {
  useInfiniteQuery,
  useMutation,
  useQuery,
  useQueryClient,
} from '@tanstack/react-query'
import {
  addChannel,
  deleteChannel,
  fetchAuthors,
  getTaskInfo,
  updateChannels,
} from '../actions'
import { useInView } from 'react-intersection-observer'
import { Button } from '@/components/ui/button'
import Link from 'next/link'
import { Input } from '@/components/ui/input'
import { useToast } from '@/components/ui/use-toast'

export default function Home() {
  let intervalId = 0
  const [isTaskRunning, setIsTaskRunning] = useState(false)
  const [taskId, setTaskId] = useState<string>('')
  const queryClient = useQueryClient()
  const [author, setAuthor] = useState<string>('')
  const [currentChannel, setCurrentChannel] = useState('')
  const { toast } = useToast()

  const { refetch: fetchtask } = useQuery({
    queryFn: () => getTaskInfo(taskId),

    queryKey: ['taskInfo', { taskId }],
    enabled: false, // disable this query from automatically running
    gcTime: 0,
  })

  function task_complete(data: any) {
    if (data.state == 'SUCCESS') {
      clearInterval(intervalId)
      setIsTaskRunning(false)
      toast({
        title: 'Update',
        description: 'Channel updated successfully',
      })
      setCurrentChannel('')
      queryClient.invalidateQueries({ queryKey: ['authors'] })
    }
  }

  function intervalFunction(callback: (result: string) => void) {
    fetchtask().then((data) => {
      callback(data.data)
    })
  }

  const { mutateAsync: handleAdd } = useMutation({
    mutationFn: addChannel,
    onSuccess: (data) => {
      setTaskId(data.id)
      intervalId = window.setInterval(intervalFunction, 5000, task_complete)
    },
  })

  const { mutateAsync: handleUpdateAll, isPending: isUpdatePending } =
    useMutation({
      mutationFn: updateChannels,
      onSuccess: (data) => {
        toast({
          title: 'Update',
          description: 'All channels updated',
        })
        queryClient.invalidateQueries({ queryKey: ['authors'] })
      },
    })

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

  const { mutateAsync: handleDelete, isPending: isDeletePending } = useMutation(
    {
      mutationFn: deleteChannel,
      onSuccess: () => {
        toast({
          title: 'Remove',
          description: 'Channel has been removed',
        })
        queryClient.invalidateQueries({ queryKey: ['authors'] })
      },
    },
  )

  if (status === 'pending')
    return (
      <div>
        <SkeletonCard />
      </div>
    )

  if (status === 'error') return <div>{error.message}</div>

  return (
    <main className='md:max-w-6xl md:px-4 mx-auto md:w-2/3'>
      <div className='flex w-full max-w-2xl justify-start items-start space-x-2 py-8'>
        <Input
          type='text'
          placeholder='Input youtube channel name'
          value={author}
          onChange={(e) => setAuthor(e.target.value)}
        />
        {isTaskRunning && <Loader2 className='mr-4 h-8 w-8 animate-spin' />}
        <Button
          size='sm'
          variant='ghost'
          className='rounded-md '
          onClick={() => {
            handleAdd({ channelId: author })
          }}>
          Add
        </Button>
        <Button
          size='sm'
          variant='ghost'
          onClick={() => {
            handleUpdateAll()
          }}>
          Update All
        </Button>
      </div>

      {(isDeletePending || isUpdatePending) && (
        <div className='flex items-center justify-center'>
          <Loader2 className='mr-4 h-8 w-8 animate-spin' />
        </div>
      )}

      <Table className='mt-4'>
        <TableCaption>Your favourite channels</TableCaption>
        <TableHeader>
          <TableRow>
            <TableHead className='w-[100px]'></TableHead>
            <TableHead>Name</TableHead>
            <TableHead>Last Update</TableHead>
            <TableHead className='text-right'>Action</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {data.pages.map((page, index) => {
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
                            setCurrentChannel(item.channelId)
                            handleAdd({ channelId: item.channelId })
                          }}>
                          {currentChannel == item.channelId && (
                            <Loader2 className='mr-4 h-8 w-8 animate-spin' />
                          )}
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
