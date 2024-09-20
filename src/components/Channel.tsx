'use client'

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Loader2, Search, X } from 'lucide-react'

import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import ChannelSection, { ChildComponentRef } from './ChannelSection'
import ChannelTitle from './ChannelTitle'
import { useRef, useState } from 'react'
import { useDebouncedCallback } from 'use-debounce'
import { useMutation, useQuery } from '@tanstack/react-query'
import {
  addChannel,
  getChannelNameById,
  getTaskInfo,
  updateChannel,
} from '@/app/actions'
import { toast } from './ui/use-toast'

const ChannelPage = ({ params }: { params: { id: string } }) => {
  let intervalId = 0
  const channelId = params.id
  const [search, setSearch] = useState<string>('')
  const [term, setTerm] = useState<string>('')
  const [taskId, setTaskId] = useState<string>('')
  const [isTaskRunning, setIsTaskRunning] = useState(false)
  // const router = useRouter()

  const handleSearch = useDebouncedCallback((term) => {
    setSearch(term)
  }, 300)

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
      handleButtonClick()
    }
  }

  function intervalFunction(callback: (result: string) => void) {
    fetchtask().then((data) => {
      callback(data.data)
    })
  }

  const { mutateAsync: handleUpdateChannel } = useMutation({
    mutationFn: updateChannel,
    onSuccess: (data) => {
      console.log('handleUpdateChannel success, data.id=', data)
      if (data.id == '' || data.state == 'Error') {
        toast({
          title: data.state,
          description: data.value,
          variant: 'destructive',
        })
      } else {
        setTaskId(data.id)
        intervalId = window.setInterval(intervalFunction, 5000, task_complete)
      }
    },
  })

  const childRef = useRef<ChildComponentRef>(null)

  const handleButtonClick = () => {
    if (childRef.current) {
      childRef.current.triggerFunction()
    }
  }

  const { data, isLoading } = useQuery({
    queryFn: () => getChannelNameById({ id: params.id }),
    queryKey: ['channelName', { channelId }],
    enabled: true, // disable this query from automatically running
    gcTime: 0,
  })

  return (
    <>
      <div className='text-3xl font-semibold p-4'>
        <ChannelTitle
          params={{
            id: params.id,
          }}
        />
      </div>
      <div className='flex flex-col sm:flex-row sm:items-center items-start justify-around'>
        <div className='flex w-full sm:w-1/2 items-center rounded-lg border-2 mx-4 px-4'>
          <Search className='h-8 w-8 ml-2' />
          <Input
            className='w-full px-4 py-4 mr-4 border-none bg-transparent outline-none focus:outline-none focus-visible:ring-transparent '
            type='text'
            value={term}
            onChange={(e) => {
              setTerm(e.target.value)
              handleSearch(term)
            }}
            placeholder='Search'
          />

          <Button
            size='sm'
            variant='ghost'
            className='rounded-md m-2'
            onClick={() => {
              setTerm('')
            }}>
            <X className='h-4 w-4' />
          </Button>
        </div>
        {!isLoading && (
          <Button
            size='sm'
            variant='ghost'
            className='rounded-md m-2'
            onClick={() => {
              setIsTaskRunning(true)
              handleUpdateChannel({ channelId: data?.channelId || '' })
            }}>
            {isTaskRunning && <Loader2 className='mr-4 h-8 w-8 animate-spin' />}
            Update Channel
          </Button>
        )}
      </div>

      <Tabs defaultValue='videos' className='w-full mt-4'>
        <TabsList className='grid w-[400px] grid-cols-3'>
          <TabsTrigger value='videos'>Videos</TabsTrigger>
          <TabsTrigger value='streams'>Alives</TabsTrigger>
          <TabsTrigger value='shorts'>Shorts</TabsTrigger>
        </TabsList>
        <TabsContent value='videos'>
          <Card>
            <CardHeader>
              <CardTitle>Videos</CardTitle>
            </CardHeader>
            <CardContent className='space-y-2'>
              <ChannelSection
                ref={childRef}
                id={params.id}
                type='videos'
                search={search}
              />
            </CardContent>
          </Card>
        </TabsContent>
        <TabsContent value='streams'>
          <Card>
            <CardHeader>
              <CardTitle>Alives</CardTitle>
            </CardHeader>
            <CardContent className='space-y-2'>
              <ChannelSection
                ref={childRef}
                id={params.id}
                type='streams'
                search={search}
              />
            </CardContent>
          </Card>
        </TabsContent>
        <TabsContent value='shorts'>
          <Card>
            <CardHeader>
              <CardTitle>Shorts</CardTitle>
            </CardHeader>
            <CardContent className='space-y-2'>
              <ChannelSection
                ref={childRef}
                id={params.id}
                type='shorts'
                search={search}
              />
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </>
  )
}

export default ChannelPage
