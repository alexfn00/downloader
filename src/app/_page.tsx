'use client'

import axios from 'axios'
import { useState } from 'react'
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'

export default function Home() {
  const makeApiCall = async () => {
    const response = await fetch('/api/search/')
  }
  const [videoLink, setVideoLink] = useState('')
  const [fileName, setFileName] = useState()
  const [videoTitle, setVideoTitle] = useState('')
  const [showDownload, setShowDownload] = useState(false)
  const [options, setOptions] = useState<any[]>([])
  const [currentOption, setCurrentOption] = useState<any>(null)
  const handleConvrt = async () => {
    try {
      console.log('handleDownload enter')
      setShowDownload(false)
      const res = await axios.get(`/api/downloader?url=${videoLink}`)
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
  const handleDownload = async () => {
    try {
      const a = document.createElement('a')
      a.href = currentOption.url
      a.download = videoTitle
      document.body.appendChild(a)
      a.click()
      a.remove()
    } catch (error) {
      console.log(error)
    }
  }
  return (
    <main className='mx-auto md:max-w-6xl px-4'>
      <header className='flex justify-between mx-auto max-w-6xl py-4'>
        <div>
          <h3 className='text-xl font-semibold tracking-wider'>
            Youtube Downloader
          </h3>
        </div>
        <div>
          <p>Share Now</p>
        </div>
      </header>
      <div className='flex flex-col items-center min-h-[300px] justify-center border bg-indigo-400 rounded-md text-white'>
        <h3>Youtube Video Downloader</h3>
        <div className='mt-4 space-x-2 w-full flex justify-center p-4'>
          <input
            type='text'
            value={videoLink}
            onChange={(e) => setVideoLink(e.target.value)}
            className='p-2 w-[60%] outline-none text-black'
            placeholder='https://www.youtube.com/live/Lq9ZMwqqr9U?si=3VLazpBpEwGnJAtm'
          />
          <button
            onClick={handleConvrt}
            className='border rounded-md p-1 font-semibold'>
            Convert
          </button>
        </div>
      </div>
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
              <div rounded-md text-white>
                <button
                  onClick={handleDownload}
                  className='border rounded-md p-1 font-semibold'>
                  Download
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
      {/* <button onClick={makeApiCall} className='mb-40'>
        make call
      </button> */}
    </main>
  )
}
