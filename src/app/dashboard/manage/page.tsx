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
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip'

import { ArrowLeft, CircleHelp, Info, Loader2, X } from 'lucide-react'
import { useEffect, useState } from 'react'
import { SkeletonCard } from '@/components/skeletons'
import { useRouter } from 'next/navigation'
import {
  useInfiniteQuery,
  useMutation,
  useQuery,
  useQueryClient,
} from '@tanstack/react-query'
import {
  addChannel,
  deleteChannel,
  fetchChannels,
  getTaskInfo,
  updateChannel,
  updateChannels,
} from '../../actions'
import { useInView } from 'react-intersection-observer'
import { Button } from '@/components/ui/button'
import Link from 'next/link'
import { Input } from '@/components/ui/input'
import { useToast } from '@/components/ui/use-toast'

export default function Home() {
  let intervalId = 0
  const router = useRouter()
  const [isTaskRunning, setIsTaskRunning] = useState(false)
  const [isAllTaskRunning, setIsAllTaskRunning] = useState(false)
  const [taskId, setTaskId] = useState<string>('')
  const queryClient = useQueryClient()
  const [author, setAuthor] = useState<string>('')
  const [currentUpdateChannel, setCurrentUpdateChannel] = useState('')
  const [currentDeleteChannel, setCurrentDeleteChannel] = useState('')
  const [isAddDisabled, setIsAddDisabled] = useState(true)

  const { toast } = useToast()

  const { refetch: fetchtask } = useQuery({
    queryFn: () => getTaskInfo(taskId),

    queryKey: ['taskInfo', { taskId }],
    enabled: false, // disable this query from automatically running
    gcTime: 0,
  })

  const { mutateAsync: handleAdd } = useMutation({
    mutationFn: addChannel,
    onSuccess: (data) => {
      if (data && data.state == 'Error') {
        toast({
          variant: 'destructive',
          title: 'Error',
          description: 'Your plan has exceeded the maximum number of channels',
        })
        setIsTaskRunning(false)
        return
      }
      setTaskId(data.id)
      intervalId = window.setInterval(
        (callback: (result: string) => void) => {
          fetchtask().then((data) => {
            callback(data.data)
          })
        },
        5000,
        (data: any) => {
          if (data.state == 'SUCCESS') {
            clearInterval(intervalId)
            setIsTaskRunning(false)
            toast({
              title: 'Add',
              description: 'Channel added successfully',
            })
            queryClient.invalidateQueries({ queryKey: ['authors'] })
          }
        },
      )
    },
  })

  const { mutateAsync: handleUpdate } = useMutation({
    mutationFn: updateChannel,
    onSuccess: (data) => {
      if (data && data.state == 'Error') {
        toast({
          variant: 'destructive',
          title: 'Error',
          description: data.value,
        })
        setIsTaskRunning(false)
        setCurrentUpdateChannel('')
        return
      }
      setTaskId(data.id)
      intervalId = window.setInterval(
        (callback: (result: string) => void) => {
          fetchtask().then((data) => {
            callback(data.data)
          })
        },
        5000,
        (data: any) => {
          if (data.state == 'SUCCESS') {
            clearInterval(intervalId)
            setIsTaskRunning(false)
            toast({
              title: 'Update',
              description: 'Channel added successfully',
            })
            queryClient.invalidateQueries({ queryKey: ['authors'] })
            setCurrentUpdateChannel('')
          }
        },
      )
    },
  })

  const { mutateAsync: handleUpdateAll } = useMutation({
    mutationFn: updateChannels,
    onSuccess: (data) => {
      if (data && data.state == 'Error') {
        toast({
          variant: 'destructive',
          title: 'Error',
          description: data.value,
        })
        setIsAllTaskRunning(false)
        return
      }
      setTaskId(data.id)
      intervalId = window.setInterval(
        (callback: (result: string) => void) => {
          fetchtask().then((data) => {
            callback(data.data)
          })
        },
        5000,
        (data: any) => {
          if (data.state == 'SUCCESS') {
            clearInterval(intervalId)
            setIsAllTaskRunning(false)
            toast({
              title: 'Update',
              description: 'All channels updated',
            })
            queryClient.invalidateQueries({ queryKey: ['authors'] })
          }
        },
      )
    },
  })

  const { data, error, status, fetchNextPage, isFetchingNextPage } =
    useInfiniteQuery({
      queryKey: ['authors'],
      queryFn: ({ pageParam }) => fetchChannels({ pageParam }),
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
        setCurrentDeleteChannel('')
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
    <main className='md:max-w-6xl md:px-4 px-2'>
      <h1 className='text-xl sm:text-3xl font-semibold sm:my-4 px-4 my-2'>
        Channel Managment
      </h1>
      {/* <Button className='ml-4' onClick={() => router.back()}>
        <ArrowLeft />
        <span className='pl-2'></span>
        Back
      </Button> */}
      <div className='flex flex-col sm:flex-row sm:items-center items-start'>
        <div className='flex w-full  items-center rounded-lg px-2 border'>
          <Input
            className='w-full py-2 mr-4 border-none bg-transparent outline-none focus:outline-none focus-visible:ring-transparent '
            type='text'
            value={author}
            onChange={(e) => {
              setAuthor(e.target.value)
              if (e.target.value.length > 0) {
                setIsAddDisabled(false)
              } else {
                setIsAddDisabled(true)
              }
            }}
            placeholder='Input youtube channel ID'
          />

          <Button
            size='icon'
            variant='ghost'
            className='rounded-md m-1'
            onClick={() => {
              setAuthor('')
              setIsAddDisabled(true)
            }}>
            <X className='h-6 w-6' />
          </Button>
        </div>

        <div className='flex w-full items-center sm:justify-end rounded-lg py-2'>
          <Button
            size='lg'
            variant='outline'
            className='rounded-md'
            disabled={isAddDisabled}
            onClick={() => {
              setIsTaskRunning(true)
              handleAdd({ channelId: author })
            }}>
            {isTaskRunning && <Loader2 className='mr-4 h-4 w-4 animate-spin' />}
            Add Channel
          </Button>
          <Link className='' href={`/dashboard/help`}>
            <CircleHelp className='text-blue-700 h8 w-8' />
          </Link>
          <Button
            size='lg'
            variant='outline'
            onClick={() => {
              setIsAllTaskRunning(true)
              handleUpdateAll()
            }}>
            {isAllTaskRunning && (
              <Loader2 className='mr-4 h-4 w-4 animate-spin' />
            )}
            Update All Channels
          </Button>
        </div>
      </div>

      {isDeletePending && (
        <div className='flex items-center justify-center'>
          <Loader2 className='mr-4 h-8 w-8 animate-spin' />
        </div>
      )}

      {data && data.pages.length > 0 && (
        <>
          <div className='pl-4 py-4'>
            <div className='flex w-full sm:w-1/2 items-center rounded-lg'>
              <p>
                Total: {data.pages[0].totalCount}/
                {data.pages[0].subscriptionPlan.channelCount}
              </p>

              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger>
                    <Info className='text-blue-700 ml-6 h-6 w-6' />
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>
                      You are now on the{' '}
                      <span className='font-semibold'>
                        {data.pages[0].subscriptionPlan.name}
                      </span>{' '}
                      Plan. Limited to{' '}
                      <span className='font-semibold'>
                        {data.pages[0].subscriptionPlan.channelCount}
                      </span>{' '}
                      channels
                    </p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            </div>
          </div>
        </>
      )}
      <Table className='mt-4'>
        <TableCaption>Your favourite channels</TableCaption>
        <TableHeader>
          <TableRow>
            <TableHead className='w-[100px]'></TableHead>
            <TableHead className='w-[200px]'>Name</TableHead>
            <TableHead className='w-[150px]'>ID</TableHead>
            <TableHead className='w-[180px]'>Last Update</TableHead>
            <TableHead className='w-[200px] text-right'>Action</TableHead>
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
                            src={item.avatar}
                          />
                        </Link>
                      </TableCell>
                      <TableCell>
                        <Link href={`/dashboard/videos/${item.id}`}>
                          {item.name}
                        </Link>
                      </TableCell>
                      <TableCell>@{item.id}</TableCell>
                      <TableCell>
                        {new Date(item.updated).toLocaleString()}
                      </TableCell>
                      <TableCell className='text-right'>
                        <Button
                          size='sm'
                          variant='ghost'
                          onClick={() => {
                            setAuthor(item.id)
                            setCurrentUpdateChannel(item.id)
                            handleUpdate({ channelId: item.id })
                          }}>
                          {currentUpdateChannel == item.id && (
                            <Loader2 className='mr-4 h-8 w-8 animate-spin' />
                          )}
                          Update
                        </Button>
                        <Button
                          size='sm'
                          variant='destructive'
                          onClick={() => {
                            setCurrentDeleteChannel(item.id)
                            handleDelete({ channelId: item.id })
                          }}>
                          {currentDeleteChannel == item.id && (
                            <Loader2 className='mr-4 h-8 w-8 animate-spin' />
                          )}
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
