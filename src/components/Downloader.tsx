import { Button } from '@/components/ui/button'
import { useMutation, useQuery } from '@tanstack/react-query'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Loader2, VolumeX } from 'lucide-react'
import YouTube, { YouTubeProps } from 'react-youtube'
import { useEffect, useRef, useState } from 'react'
import { bytesToReadableSize, download, secondsToTimeFormat } from '@/lib/utils'
import { toast } from '@/components/ui/use-toast'
import { ToastAction } from '@radix-ui/react-toast'
import { getTaskInfo, startDownload } from '@/app/actions'
import { VideoInfo } from '@/lib/type'

const Downloader = ({
  params,
}: {
  params: {
    url: string
    data: VideoInfo
  }
}) => {
  let intervalId = 0
  const url = params.url
  const todos = params.data
  const [videoId, setVideoId] = useState('')
  const [isTaskRunning, setIsTaskRunning] = useState(false)
  const [progress, setProgress] = useState<number>(0)
  const [currentOption, setCurrentOption] = useState('0')
  const [taskId, setTaskId] = useState<string>('')
  const [boxSize, setBoxSize] = useState<{ width: number; height: number }>({
    width: 0,
    height: 0,
  })
  const boxRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    var n = url?.split('v=')
    if (n !== undefined) {
      setVideoId(n[1])
    }
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

  const { refetch: fetchtask } = useQuery({
    queryFn: () => getTaskInfo(taskId),

    queryKey: ['taskInfo', { taskId }],
    enabled: false, // disable this query from automatically running
    gcTime: 0,
  })

  const { mutateAsync: handleDownload } = useMutation({
    mutationFn: startDownload,
    onSuccess: (data) => {
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
            setProgress(data.value.current)
          } else if (data.state == 'SUCCESS') {
            setProgress(100)
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
              const url = `https://r2.oecent.net/${data.value.filename}`
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
      <div className='flex flex-col items-center my-4'>
        <div className='w-full items-center justify-center pl-4'>
          {videoId && videoId.length > 0 && (
            <YouTube videoId={videoId} opts={opts} onReady={onPlayerReady} />
          )}
        </div>
        <div className='w-full pl-4'>
          <div className='text-xl font-semibold my-4 flex items-start'>
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
                    todos?.formats[Number(currentOption)]['code'].toString()

                  const itag =
                    todos?.formats[Number(currentOption)][
                      'format_id'
                    ].toString()

                  const dimension =
                    todos?.formats[Number(currentOption)]['dimension']

                  handleDownload({
                    downloadURL: url,
                    type: code == 'Video and Audio' ? 'dimension' : 'itag',
                    value: code == 'Video and Audio' ? dimension : itag,
                  })
                  setProgress(0)
                  setIsTaskRunning(true)
                }}>
                {isTaskRunning ? (
                  <>
                    <span className='pr-2'>{progress} %</span>
                    <Loader2 className='mr-2 h-4 w-4 animate-spin' />
                    Downloading
                  </>
                ) : (
                  <>Download</>
                )}
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Downloader
