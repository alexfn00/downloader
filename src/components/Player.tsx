'use client'
import { useState } from 'react'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { useSearchParams } from 'next/navigation'
import { useMutation, useQuery } from '@tanstack/react-query'
import { parseURL, startDownload } from '@/app/actions'
import { Loader2 } from 'lucide-react'
import { Button } from './ui/button'

const Player = () => {
  const searchParams = useSearchParams()
  const search = searchParams.get('url')

  const [currentOption, setCurrentOption] = useState('0')

  const { data: todos, isLoading } = useQuery({
    queryFn: () => parseURL(search),
    queryKey: ['parseURL', { search }],
    gcTime: 0,
  })

  const {
    data: taskResult,
    mutateAsync: handleDownload,
    isPending: isDownloading,
  } = useMutation({
    mutationFn: startDownload,
    onSuccess: () => {
      console.log('taskResult', taskResult)
    },
  })

  if (!isLoading) {
    console.log(todos)
  }

  function getCurrent() {
    const i = Number(currentOption)
    let video = true
    if (!todos?.new_list[i].hasVideo) {
      video = false
    }
    return { video: video, url: todos?.new_list[i].url }
  }

  return (
    <main className='mx-auto max-w-full sm:max-w-6xl mt-12 '>
      <div className='flex flex-col items-center min-h-[300px] justify-center border bg-gray-300 rounded-md'>
        {isLoading && (
          <div className='flex items-center justify-center'>
            <Loader2 className='mr-4 h-8 w-8 animate-spin' />
          </div>
        )}
        {!isLoading && (
          <>
            <div className='mt-4 w-full flex-row overflow-y-auto items-center justify-center'>
              <div className=' '>
                <div className='flex flex-col sm:flex-row items-center my-4'>
                  <div className='w-full sm:w-1/2 items-center justify-center px-4'>
                    {getCurrent().video && (
                      <video src={getCurrent().url} controls autoPlay></video>
                    )}
                    {!getCurrent().video && (
                      <audio src={getCurrent().url} controls autoPlay></audio>
                    )}
                  </div>
                  <div className='flex flex-col w-full sm:w-1/2 mt-8 items-start px-4'>
                    <h3>
                      <div>{todos?.filename}</div>
                    </h3>
                    <div className='py-4 flex items-center'>
                      <Select
                        defaultValue={currentOption}
                        onValueChange={(value: any) => {
                          console.log(value)
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
                        onClick={() => {
                          handleDownload(search)
                        }}>
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
