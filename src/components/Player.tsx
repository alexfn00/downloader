'use client'
import axios from 'axios'
import { useEffect, useState } from 'react'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { useSearchParams } from 'next/navigation'

const Player = () => {
  const searchParams = useSearchParams()
  const search = searchParams.get('url')
  console.log('search:', search)
  const [videoLink, setVideoLink] = useState('')
  const [fileName, setFileName] = useState()
  const [videoTitle, setVideoTitle] = useState('')
  const [showDownload, setShowDownload] = useState(false)
  const [options, setOptions] = useState<any[]>([])
  const [currentOption, setCurrentOption] = useState<any>(null)
  const [videos, setVideos] = useState<any[]>([])

  useEffect(() => {
    const loadVideos = async () => {
      try {
        if (!search) {
          console.log('search is null')
          return
        }
        setShowDownload(false)
        const res = await axios.get(`/api/downloader?url=${search}`)
        console.log(res.data)
        console.log(res.data.qualities)
        setVideoTitle(res.data.filename)
        setOptions(res.data.lists)
        setCurrentOption(res.data.currentOption)
        setShowDownload(true)
      } catch (error) {
        console.log(error)
      }
    }

    loadVideos()
  }, [search])
  return (
    <main className='mx-auto md:max-w-6xl px-4'>
      <div className='flex flex-col items-center min-h-[300px] justify-center border bg-gray-300 rounded-md'>
        {showDownload && (
          <div className='mt-4 space-x-2 w-full flex justify-center p-4'>
            {/* <div>
              <audio src={finalLink} controls></audio>
            </div> */}
            <div className='p-2'>
              {currentOption.optionTag === 'video' && (
                <video src={currentOption.url} controls></video>
              )}
              {currentOption.optionTag === 'audio' && (
                <audio src={currentOption.url} controls></audio>
              )}
            </div>
            <div className='p-2 flex flex-col  gap-8'>
              <h3>{videoTitle}</h3>
              <div className='py-4'>
                <Select
                  defaultValue={currentOption.url}
                  onValueChange={(value: any) => {
                    console.log(value)
                    setCurrentOption(options[Number(value)])
                  }}>
                  <SelectTrigger className='w-[180px]'>
                    <SelectValue placeholder='Qualitiy' />
                  </SelectTrigger>
                  <SelectContent>
                    {options.map((option, index) => (
                      <SelectItem value={index.toString()} key={option.option}>
                        {option.option}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className='rounded-md'>
                <button className='border border-white px-4 py-2 rounded-md font-semibold'>
                  Download
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </main>
  )
}

export default Player
