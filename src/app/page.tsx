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
import { parseURL, startDownload } from './actions'
import { Loader2, X } from 'lucide-react'
import YouTube, { YouTubeProps } from 'react-youtube'
import { useEffect, useRef, useState } from 'react'

export default function Home() {
  const [url, setUrl] = useState<string>('')
  const [videoId, setVideoId] = useState('')
  const [currentOption, setCurrentOption] = useState('0')
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
        setBoxSize({ width, height })
      }
    }

    handleResize()
    window.addEventListener('resize', handleResize)

    return () => window.removeEventListener('resize', handleResize)
  }, [])

  const {
    data: todos,
    refetch,
    isLoading,
  } = useQuery({
    queryFn: () => parseURL(url),

    queryKey: ['parseURL', { url }],
    enabled: false, // disable this query from automatically running
    gcTime: 0,
  })

  const { mutateAsync: handleDownload, isPending: isDownloading } = useMutation(
    {
      mutationFn: startDownload,
      onSuccess: (data) => {
        const url = `https://r2.oecent.net/${data.value.filename}`
        download(url, data.value.filename)
      },
    },
  )

  function download(fileUrl: string, filename: string) {
    const anchor = document.createElement('a')
    anchor.href = fileUrl
    anchor.download = filename
    document.body.appendChild(anchor)
    anchor.click()
    document.body.removeChild(anchor)
    URL.revokeObjectURL(fileUrl)
  }
  const onPlayerReady: YouTubeProps['onReady'] = (event) => {
    // access to player in all event handlers via event.target
    event.target.pauseVideo()
  }
  const opts = {
    height: ((boxSize.width - 80) * 3) / 4,
    width: boxSize.width - 80,
    playerVars: {
      // https://developers.google.com/youtube/player_parameters
      autoplay: 1,
    },
  }

  return (
    <div>
      <MaxWidthWrapper className='mb-12 mt-20 sm:mt-20 flex flex-col items-center justify-center text-center'>
        <div className='max-w-6xl w-full sm:px-6 lg:px8' ref={boxRef}>
          <h1 className='text-3xl font-semibold my-4'>
            Free Online Video Downloader
          </h1>
          <div className='flex w-full justify-start items-start space-x-2 py-8 flex-col sm:flex-row'>
            <div className='flex sm:w-3/4 w-full rounded border-4 border-green-700 mr-2'>
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
            <div className='sm:w-1/4 w-full flex flex-row items-center sm:justify-start justify-center mt-4 sm:mt-0'>
              <Button
                size='sm'
                variant='ghost'
                className='rounded-md py-6 m-1 bg-green-700 text-white hover:bg-green-600 hover:text-white'
                onClick={() => {
                  var n = url?.split('v=')
                  if (n !== undefined) {
                    setVideoId(n[1])
                  }
                  refetch()
                }}>
                Download
              </Button>
            </div>
          </div>
          {isLoading && (
            <div className='flex items-center justify-center'>
              <Loader2 className='mr-4 h-8 w-8 animate-spin' />
            </div>
          )}
          {!isLoading && videoId.length > 0 && (
            <>
              <div className='mt-4 w-full flex-row overflow-y-auto items-center justify-center'>
                <div className=' '>
                  <div className='flex flex-row sm:flex-row items-center my-4'>
                    <div className='w-full items-center justify-center px-4'>
                      <YouTube
                        videoId={videoId}
                        opts={opts}
                        onReady={onPlayerReady}
                      />
                    </div>
                  </div>
                </div>
              </div>

              <div className='flex flex-col w-full  mt-8 items-start px-4'>
                <div className='text-2xl font-semibold '>{todos?.filename}</div>
                <div className='py-4 flex items-center'>
                  <Select
                    defaultValue={currentOption}
                    onValueChange={(value: any) => {
                      setCurrentOption(value)
                    }}>
                    <SelectTrigger className='w-[180px]'>
                      <SelectValue placeholder='Qualitiy' />
                    </SelectTrigger>
                    <SelectContent>
                      {todos?.new_list.map((todo, index) => (
                        <SelectItem
                          value={index.toString()}
                          key={todo.lastModified}>
                          <span className='px-2'>
                            {todo.hasAudio && todo.hasVideo && (
                              <span>Video and Audio</span>
                            )}
                            {todo.hasAudio && !todo.hasVideo && (
                              <span>Audio</span>
                            )}
                            {!todo.hasAudio && todo.hasVideo && (
                              <span>Video</span>
                            )}

                            {todo.container}
                          </span>
                          <span className='px-2'>{todo.codecs}</span>
                          <span className='px-2'>
                            {todo.hasVideo && todo.qualityLabel}
                          </span>
                          <span className='px-2'>
                            {Number(todo.bitrate) / 1000}
                          </span>
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <Button
                    size='sm'
                    variant='ghost'
                    className='rounded-md py-4 m-1 bg-green-700 text-white hover:bg-green-600 hover:text-white'
                    onClick={() => {
                      const itag =
                        todos?.new_list[Number(currentOption)][
                          'itag'
                        ].toString()
                      handleDownload({
                        downloadURL: url,
                        itag: itag ? itag : '',
                      })
                    }}>
                    {isDownloading && (
                      <Loader2 className='mr-2 h-4 w-4 animate-spin' />
                    )}
                    Download
                  </Button>
                </div>
              </div>
            </>
          )}
        </div>
      </MaxWidthWrapper>
    </div>
  )
}
