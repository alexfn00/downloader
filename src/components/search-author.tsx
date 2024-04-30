import React, { createContext, useEffect, useState } from 'react'
import Image from 'next/image'
import { useWatch } from './WatchProvider'

const SearchAuthor = () => {
  const { watchId, UpdateWatchId } = useWatch()
  const [query, setQuery] = useState(true)
  const [results, setResults] = useState<any[]>([])
  const search = (e: any) => {
    setTimeout(() => {
      setQuery(e.target.value)
    }, 500)
  }

  useEffect(() => {
    if (query) {
      fetch(`/api/search?q=${query}`)
        .then((response) => {
          return response.json()
        })
        .then((data) => {
          setResults(data.authors)
        })
    }
  }, [query])
  return (
    <div className='mt-4 space-x-2 w-full flex flex-col p-4'>
      <h1>{watchId}</h1>
      <input
        type='text'
        onChange={search}
        className='p-2 w-[60%] outline-none text-black'
        placeholder='Search author'
      />
      {results.map((item, index) => (
        <>
          <button
            className='flex items-center justify-start hover:bg-slate-300 rounded-md'
            key={item.id}
            onClick={() => {
              // alert(item.author)
              UpdateWatchId(item.author)
            }}>
            <img
              className='rounded-full mx-3 my-3'
              alt='Author'
              height={30}
              width={30}
              src={item.avatar}
            />
            <h3 className='text-sm line-clamp-1'>{item.name}</h3>
          </button>
        </>
      ))}
    </div>
  )
}

export default SearchAuthor
