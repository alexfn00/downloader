'use client'

import MaxWidthWrapper from '@/components/MaxWidthWrapper'
import { Button } from '@/components/ui/button'
import { useMutation, useQuery } from '@tanstack/react-query'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { getTaskInfo, getVideoInfo, startDownload } from './actions'
import { Loader2, X } from 'lucide-react'
import YouTube, { YouTubeProps } from 'react-youtube'
import { useEffect, useRef, useState } from 'react'
import { bytesToReadableSize, download, secondsToTimeFormat } from '@/lib/utils'
import { toast } from '@/components/ui/use-toast'
import { ToastAction } from '@radix-ui/react-toast'

export default function Home() {
  let intervalId = 0

  const [isTaskRunning, setIsTaskRunning] = useState(false)
  const [url, setUrl] = useState<string>('')
  const [videoId, setVideoId] = useState('')
  const [currentOption, setCurrentOption] = useState('0')
  const [taskId, setTaskId] = useState<string>('')
  const [boxSize, setBoxSize] = useState<{ width: number; height: number }>({
    width: 0,
    height: 0,
  })
  const boxRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    function handleResize() {
      if (boxRef.current) {
        const width = boxRef.current.offsetWidth
        const height = boxRef.current.offsetHeight

        if (window.innerWidth < 640) {
          setBoxSize({
            width: width - 32,
            height: height,
          })
        } else {
          setBoxSize({
            width: (width * 3) / 4 - 8,
            height: height,
          })
        }
      }
    }

    handleResize()
    window.addEventListener('resize', handleResize)

    return () => window.removeEventListener('resize', handleResize)
  }, [])

  const { refetch: fetchtask } = useQuery({
    queryFn: () => getTaskInfo(taskId),

    queryKey: ['taskInfo', { taskId }],
    enabled: false, // disable this query from automatically running
    gcTime: 0,
  })

  const {
    data: todos,
    refetch,
    isLoading,
  } = useQuery({
    queryFn: () => getVideoInfo(url),

    queryKey: ['parseURL', { url }],
    enabled: false, // disable this query from automatically running
    gcTime: 0,
  })

  function task_complete(data: any) {
    if (data.state == 'SUCCESS') {
      clearInterval(intervalId)
      setIsTaskRunning(false)
      if (data.value.filename == null) {
        toast({
          variant: 'destructive',
          title: 'Uh oh! Something went wrong.',
          description: data.value.message,
          action: <ToastAction altText='Try again'>Try again</ToastAction>,
        })
      } else {
        const url = `https://r2.oecent.net/${data.value.filename}`
        download(url, data.value.filename)
      }
    }
  }

  function intervalFunction(callback: (result: string) => void) {
    fetchtask().then((data) => {
      callback(data.data)
    })
  }

  const { mutateAsync: handleDownload } = useMutation({
    mutationFn: startDownload,
    onSuccess: (data) => {
      setTaskId(data.id)
      intervalId = window.setInterval(intervalFunction, 5000, task_complete)
    },
    onError: (error, variables, context) => {},
    onSettled: (data, error, variables, context) => {},
  })

  const onPlayerReady: YouTubeProps['onReady'] = (event) => {
    // access to player in all event handlers via event.target
    event.target.pauseVideo()
  }
  const opts = {
    height: (boxSize.width * 2) / 3,
    width: boxSize.width,
    playerVars: {
      // https://developers.google.com/youtube/player_parameters
      autoplay: 1,
    },
  }
  return (
    <div>
      <MaxWidthWrapper className='sm:mb-12 mt-4 sm:mt-10 flex flex-col items-center justify-center text-center'>
        <div className='max-w-6xl w-full sm:px-6 lg:px8'>
          <h1 className='text-xl sm:text-3xl font-semibold sm:my-4'>
            Free Online Video Downloader
          </h1>
          <div
            className='flex w-full justify-between items-center space-x-2 py-2 sm:py-8 flex-col sm:flex-row border'
            ref={boxRef}>
            <div className='flex w-full items-end rounded border-4 border-green-700 mx-4'>
              <input
                type='text'
                value={url}
                className='w-full px-4 py-4 border-none bg-transparent outline-none focus:outline-none'
                onChange={(e) => {
                  setUrl(e.target.value)
                }}
                placeholder='Paste video link here'
              />
              <Button
                size='sm'
                variant='ghost'
                className='rounded-md m-2'
                onClick={() => {
                  setUrl('')
                  setVideoId('')
                }}>
                <X className='h-4 w-4' />
              </Button>
            </div>
            <div className='sm:w-1/4 w-full flex flex-row items-end sm:justify-end justify-end mt-4 sm:mt-0'>
              <Button
                size='sm'
                variant='ghost'
                className='rounded-md py-6 mr-4 bg-green-700 text-white hover:bg-green-600 hover:text-white'
                onClick={() => {
                  var n = url?.split('v=')
                  if (n !== undefined) {
                    setVideoId(n[1])
                  }
                  refetch()
                }}>
                {isLoading && <Loader2 className='mr-4 h-8 w-8 animate-spin' />}
                Download
              </Button>
            </div>
          </div>

          {!isLoading && videoId.length > 0 && (
            <>
              <div className='mt-4 w-full flex-row sm:flex-col overflow-y-auto items-center justify-center border'>
                <div className='flex flex-col items-center my-4'>
                  <div className='w-full items-center justify-center pl-4'>
                    <YouTube
                      videoId={videoId}
                      opts={opts}
                      onReady={onPlayerReady}
                    />
                  </div>
                  <div className='w-full pl-4'>
                    <div className='text-2xl font-semibold mt-4 flex items-start'>
                      {todos?.title}
                    </div>
                    <div className=' text-gray-500 my-4 flex items-start'>
                      {secondsToTimeFormat(todos?.duration)}
                    </div>
                    <div className='py-4 w-full flex items-center'>
                      <Select
                        defaultValue={currentOption}
                        onValueChange={(value: any) => {
                          setCurrentOption(value)
                        }}>
                        <SelectTrigger className='w-3/4 border-4 border-green-700 py-4'>
                          <SelectValue placeholder='Qualitiy' />
                        </SelectTrigger>
                        <SelectContent>
                          {todos?.formats.map((todo, index) => (
                            <SelectItem
                              className='hover:bg-green-600 hover:text-white'
                              value={index.toString()}
                              key={todo.lastModified}>
                              <span className='px-2'>
                                {todo['ext'].toUpperCase()}
                              </span>
                              <span className='px-2'>{todo['code']}</span>
                              {todo['format_note']}
                              <span className='px-2'>{todo['code']}</span>
                              {bytesToReadableSize(todo['filesize'])}

                              {/* <span className='px-2'>{todo['format_note']}</span> */}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <div className='flex flex-row items-end sm:justify-end justify-end mr-4'>
                        <Button
                          size='sm'
                          variant='ghost'
                          className='rounded-md py-4 ml-4 bg-green-700 text-white hover:bg-green-600 hover:text-white'
                          onClick={() => {
                            const code =
                              todos?.formats[Number(currentOption)][
                                'code'
                              ].toString()

                            const itag =
                              todos?.formats[Number(currentOption)][
                                'format_id'
                              ].toString()

                            const dimension =
                              todos?.formats[Number(currentOption)]['dimension']

                            handleDownload({
                              downloadURL: url,
                              type:
                                code == 'Video and Audio'
                                  ? 'dimension'
                                  : 'itag',
                              value:
                                code == 'Video and Audio' ? dimension : itag,
                            })
                            setIsTaskRunning(true)
                          }}>
                          {isTaskRunning && (
                            <Loader2 className='mr-2 h-4 w-4 animate-spin' />
                          )}
                          Download
                        </Button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </>
          )}
        </div>
      </MaxWidthWrapper>
    </div>
  )
}
