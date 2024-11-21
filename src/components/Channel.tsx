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
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import {
  getChannelNameById,
  getTaskInfo,
  updateChannel,
  updateChannels,
} from '@/app/actions'
import { toast } from './ui/use-toast'

const ChannelPage = ({ params }: { params: { id: string } }) => {
  let intervalId = 0
  const channelId = params.id
  const [search, setSearch] = useState<string>('')
  const [term, setTerm] = useState<string>('')
  const [taskId, setTaskId] = useState<string>('')
  const [isTaskRunning, setIsTaskRunning] = useState(false)
  const queryClient = useQueryClient()

  const handleSearch = useDebouncedCallback((term) => {
    setSearch(term)
  }, 300)

  const { refetch: fetchtask } = useQuery({
    queryFn: () => getTaskInfo(taskId),

    queryKey: ['taskInfo', { taskId }],
    enabled: false, // disable this query from automatically running
    gcTime: 0,
  })

  const { mutateAsync: handleUpdateChannel } = useMutation({
    mutationFn: updateChannel,
    onSuccess: (data) => {
      if (data.id == '' || data.state == 'Error') {
        toast({
          title: data.state,
          description: data.value,
          variant: 'destructive',
        })
      } else {
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
                description: 'Channel updated successfully',
              })
              handleButtonClick()
            }
          },
        )
      }
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
              title: 'Update',
              description: 'All channels updated',
            })
            queryClient.invalidateQueries({ queryKey: ['taskInfo'] })
          }
        },
      )
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
      <div className='p-4'>
        <ChannelTitle
          params={{
            id: params.id,
          }}
        />
      </div>
      <div className='flex flex-col sm:flex-row sm:items-center items-start mx-2'>
        <div className='flex w-full items-center rounded-lg border-2'>
          <Search className='h-8 w-8 ml-2' />
          <Input
            className='w-full  py-2 mr-2 border-none bg-transparent outline-none focus:outline-none focus-visible:ring-transparent '
            type='text'
            value={term}
            onChange={(e) => {
              setTerm(e.target.value)
              handleSearch(term)
            }}
            placeholder='Search'
          />

          <Button
            size='icon'
            variant='ghost'
            className='rounded-md m-1'
            onClick={() => {
              setTerm('')
            }}>
            <X className='h-6 w-6' />
          </Button>
        </div>
        {!isLoading && (
          <Button
            size='lg'
            variant='outline'
            className='rounded-md m-2'
            onClick={() => {
              setIsTaskRunning(true)
              if (data?.name) {
                handleUpdateChannel({ channelId: data?.id || '' })
              } else {
                handleUpdateAll()
              }
            }}>
            {isTaskRunning && <Loader2 className='mr-4 h-4 w-4 animate-spin' />}
            {data?.name && <>Update Channel</>}
            {!data?.name && <>Update All Channels</>}
          </Button>
        )}
      </div>

      <Tabs defaultValue='videos' className='w-full mt-4 mx-2'>
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
