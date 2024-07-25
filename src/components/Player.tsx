'use client'
import { useEffect, useRef, useState } from 'react'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { useSearchParams } from 'next/navigation'
import { useMutation, useQuery } from '@tanstack/react-query'
import { getVideoInfo, startDownload } from '@/app/actions'
import { Loader2 } from 'lucide-react'
import { Button } from './ui/button'
import YouTube, { YouTubeProps } from 'react-youtube'
import { download, secondsToTimeFormat } from '@/lib/utils'
import { toast } from './ui/use-toast'
import { ToastAction } from '@radix-ui/react-toast'

const Player = () => {
  const searchParams = useSearchParams()
  const search = searchParams.get('url')
  const [currentOption, setCurrentOption] = useState('0')
  const [videoId, setVideoId] = useState('')
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

  const onPlayerReady: YouTubeProps['onReady'] = (event) => {
    event.target.playVideo()
  }

  const opts = {
    height: (boxSize.width * 2) / 3,
    width: boxSize.width,
    playerVars: {
      autoplay: 1,
    },
  }

  useEffect(() => {
    var n = search?.split('v=')
    if (n !== undefined) {
      setVideoId(n[1])
    }
  }, [])

  const { data: todos, isLoading } = useQuery({
    queryFn: () => getVideoInfo(search),
    queryKey: ['parseURL', { search }],
    gcTime: 0,
  })

  const { mutateAsync: handleDownload, isPending: isDownloading } = useMutation(
    {
      mutationFn: startDownload,
      onSuccess: (data) => {
        if (data.state === 'PENDING') {
          toast({
            variant: 'destructive',
            title: 'Uh oh! Something went wrong.',
            description: 'Download timeout',
          })
        } else if (data.value.filename == null) {
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
      },
    },
  )

  return (
    <main className='mx-auto max-w-full sm:max-w-6xl sm:mt-12'>
      <h1 className='flex items-center justify-center text-xl sm:text-3xl font-semibold my-4'>
        Free Online Video Downloader
      </h1>
      <div
        className='flex flex-col items-center min-h-[300px] justify-center rounded-md'
        ref={boxRef}>
        {/* {boxSize.width}, {boxSize.height} */}
        {isLoading && (
          <div className='flex items-center justify-center'>
            <Loader2 className='mr-4 h-8 w-8 animate-spin' />
          </div>
        )}
        {!isLoading && videoId.length > 0 && (
          <>
            <div className='mt-4 w-full flex-row sm:flex-col overflow-y-auto items-center justify-center border'>
              <div className='flex flex-col sm:flex-col items-center my-4'>
                <div className='w-full items-center justify-center pl-4'>
                  <YouTube
                    videoId={videoId}
                    opts={opts}
                    onReady={onPlayerReady}
                  />
                </div>
                <div className=' w-full mx-4 '>
                  <div className='text-2xl font-semibold mt-4 flex items-start px-4'>
                    {todos?.title}
                  </div>
                  <div className=' text-gray-500 my-4 flex items-start pl-4'>
                    {secondsToTimeFormat(todos?.duration)}
                  </div>
                  <div className='py-4 w-full flex items-center pl-4'>
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

                            {/* <span className='px-2'>{todo['format_note']}</span> */}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <div className='flex flex-row items-end sm:justify-end justify-end sm:mt-0 mr-4 border'>
                      <Button
                        size='sm'
                        variant='ghost'
                        className='rounded-md ml-4 bg-green-700 text-white hover:bg-green-600 hover:text-white'
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
                            downloadURL: search != null ? search : '',
                            type:
                              code == 'Video and Audio' ? 'dimension' : 'itag',
                            value: code == 'Video and Audio' ? dimension : itag,
                          })
                        }}>
                        {isDownloading && (
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
    </main>
  )
}

export default Player
