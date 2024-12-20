import { Button } from '@/components/ui/button'
import { useMutation, useQuery } from '@tanstack/react-query'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip'
import { Info, Loader2, VolumeX } from 'lucide-react'
import YouTube, { YouTubeProps } from 'react-youtube'
import { useEffect, useRef, useState } from 'react'
import {
  bytesToReadableSize,
  download,
  getAnonymousSession,
  secondsToTimeFormat,
} from '@/lib/utils'
import { toast } from '@/components/ui/use-toast'
import { ToastAction } from '@radix-ui/react-toast'
import {
  doTranscript,
  fetch2buckets,
  getTaskInfo,
  getVideoInfo,
  startDownload,
} from '@/app/actions'
import { VideoInfo } from '@/lib/type'
import Link from 'next/link'

const Downloader = ({
  params,
}: {
  params: {
    url: string
  }
}) => {
  let intervalId = 0
  const url = params.url
  const [videoData, setVideoData] = useState<VideoInfo>()
  const [videoId, setVideoId] = useState('')
  const [isLoadingVideoInfo, setIsLoadingVideoInfo] = useState(true)
  const [isTaskRunning, setIsTaskRunning] = useState(false)
  const [isTranscripting, setIsTranscript] = useState(false)
  const [transcription, setTranscription] = useState<string>('')
  const [progress, setProgress] = useState('')
  const [state, setState] = useState('')
  const [currentOption, setCurrentOption] = useState('0')
  const [taskId, setTaskId] = useState<string>('')
  const [anonymous, setAnonymous] = useState<string | null>('')

  const [boxSize, setBoxSize] = useState<{ width: number; height: number }>({
    width: 0,
    height: 0,
  })
  const boxRef = useRef<HTMLDivElement>(null)

  const { mutateAsync: handleVideoInfo } = useMutation({
    mutationFn: getVideoInfo,
    onSuccess: (data) => {
      if (data && data.state == 'Error') {
        toast({
          variant: 'destructive',
          title: 'Error',
          description:
            'Cannot get video infomation, video might not be avaliable.',
        })
        setIsLoadingVideoInfo(false)
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
            setIsLoadingVideoInfo(false)
            const videoInfo: VideoInfo = {
              id: data.value.id,
              title: data.value.title,
              duration: data.value.duration,
              formats: [...data.value.formats],
            }

            setVideoData(videoInfo)
            setVideoId(data.value.id)
          }
        },
      )
    },
  })

  useEffect(() => {
    if (url) {
      handleVideoInfo(url)
    }
    setAnonymous(getAnonymousSession())
  }, [])

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

  const { data } = useQuery({
    queryFn: () => fetch2buckets(anonymous),
    queryKey: ['r2buckets', { anonymous }],
    enabled: true, // disable this query from automatically running
    gcTime: 0,
  })

  const { refetch: fetchtask } = useQuery({
    queryFn: () => getTaskInfo(taskId),

    queryKey: ['taskInfo', { taskId }],
    enabled: false, // disable this query from automatically running
    gcTime: 0,
  })

  const { mutateAsync: handleDownload } = useMutation({
    mutationFn: startDownload,
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
          if (data.state == 'PROGRESS') {
            setProgress(data.value.percent)
            setState(data.value.status)
          } else if (data.state == 'SUCCESS') {
            setProgress('100%')
            setState('')
            clearInterval(intervalId)
            setIsTaskRunning(false)
            if (data.value.filename == null) {
              toast({
                variant: 'destructive',
                title: 'Uh oh! Something went wrong.',
                description: data.value.message,
                action: (
                  <ToastAction altText='Try again'>Try again</ToastAction>
                ),
              })
            } else {
              const url = `https://r2.oecent.net/${data.value.unique}`
              download(url, data.value.filename)
            }
          }
          console.log(data)
        },
      )
    },
    onError: (error, variables, context) => {},
    onSettled: (data, error, variables, context) => {},
  })

  const { mutateAsync: handleTranscript } = useMutation({
    mutationFn: doTranscript,
    onSuccess: (data) => {
      console.log('data', data)
      if (data && data.state == 'Error') {
        toast({
          variant: 'destructive',
          title: 'Error',
          description: data.value,
        })
        setIsTranscript(false)
        return
      }
      setIsTranscript(true)
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
            setIsTranscript(false)
            setTranscription(data.value)
          }
          console.log(data)
        },
      )
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
    <div
      className='mt-4 w-full flex-row sm:flex-col overflow-y-auto items-center justify-center border'
      ref={boxRef}>
      {isLoadingVideoInfo && (
        <div className='flex items-center justify-center'>
          <Loader2 className='mr-4 h-8 w-8 animate-spin' />
        </div>
      )}
      {!isLoadingVideoInfo && (
        <div className='flex flex-col items-center my-4'>
          <div className='w-full items-center justify-center pl-4'>
            {videoId && videoId && videoId.length > 0 && (
              <YouTube videoId={videoId} opts={opts} onReady={onPlayerReady} />
            )}
          </div>
          <div className='w-full pl-4 border'>
            <div className='text-xl font-semibold my-4 flex items-start'>
              {videoData?.title}
            </div>
            <div className=' text-gray-500 my-4 flex items-start'>
              {videoData?.duration && secondsToTimeFormat(videoData?.duration)}
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
                  {videoData?.formats.map((todo, index) => (
                    <SelectItem
                      className='flex items-center'
                      value={index.toString()}
                      key={index.toString()}>
                      <div className='flex items-end justify-end'>
                        <div className='pl-2 pr-4'>
                          {todo['ext'].toUpperCase()}
                        </div>

                        {todo['code'] == 'Video' ? (
                          <VolumeX className='text-red-500 w-8' />
                        ) : (
                          <span className='pl-8'></span>
                        )}
                        <span className='px-2 w-20'>{todo['format_note']}</span>
                        <span className='pl-2'>
                          {bytesToReadableSize(todo['filesize'])}
                        </span>
                      </div>
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
                      videoData?.formats[Number(currentOption)][
                        'code'
                      ].toString()

                    const itag: string =
                      videoData?.formats[Number(currentOption)][
                        'format_id'
                      ].toString() ?? ''

                    const dimension: string =
                      videoData?.formats[Number(currentOption)]['dimension'] ??
                      ''

                    handleDownload({
                      downloadURL: url,
                      type: code == 'Video and Audio' ? 'dimension' : 'itag',
                      value: code == 'Video and Audio' ? dimension : itag,
                      userId: anonymous,
                    })
                    setProgress('0%')
                    setIsTaskRunning(true)
                  }}>
                  {isTaskRunning ? (
                    <>
                      <span className='pr-2'>{progress}</span>
                      <Loader2 className='mr-2 h-4 w-4 animate-spin' />
                      {state == 'download' && <>Downloading</>}
                      {state == 'upload' && <>Saving</>}
                      {state == '' && <>Download</>}
                    </>
                  ) : (
                    <>Download</>
                  )}
                </Button>
              </div>
            </div>
            <div className='py-2 w-full flex items-center'>
              <div className='flex flex-row items-end sm:justify-end justify-end '>
                <Button
                  size='lg'
                  variant='ghost'
                  className='rounded-md py-4 ml-2 bg-green-700 text-white hover:bg-green-600 hover:text-white'
                  onClick={() => {
                    setTranscription('')
                    handleTranscript(url)
                  }}>
                  {isTranscripting ? (
                    <>
                      <Loader2 className='mr-2 h-4 w-4 animate-spin' />
                      Transcript
                    </>
                  ) : (
                    <>Transcript</>
                  )}
                </Button>
              </div>
            </div>

            <div className='p-2 w-full flex items-center border mr-4'>
              <p>{transcription}</p>
            </div>

            <div className='my-4'>
              Total: {data && data.data.length}/
              {data && data.subscriptionPlan.quota}
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger>
                    <Info className='ml-4 h-4 w-4' />
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>
                      You are now on the{' '}
                      <span className='font-semibold'>
                        {data && data.subscriptionPlan.name}
                      </span>{' '}
                      Plan. Limited to{' '}
                      <span className='font-semibold'>
                        {data && data.subscriptionPlan.quota}
                      </span>{' '}
                      downloads per month
                    </p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
              <Link className='ml-4' href='/download'>
                Goto My Files
              </Link>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default Downloader
