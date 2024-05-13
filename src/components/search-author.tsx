import React, { createContext, useEffect, useState } from 'react'
import Image from 'next/image'
import { useWatch } from './WatchProvider'
import SidebarToggle from './sidebar-toggle'

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
    <div className='mt-4 space-x-2 w-full p-4'>
      <div className='mx-5 flex flex-row sm:flex-col'>
        {results.map((item, index) => (
          <>
            <button
              className='flex items-center justify-start hover:bg-slate-300 rounded-md'
              key={item.id}
              onClick={() => {
                UpdateWatchId(item.author)
              }}>
              <img
                className='rounded-full mx-3 my-3'
                alt='Author'
                height={48}
                width={48}
                src={item.avatar}
              />
              <h3 className='text-sm line-clamp-1 hidden sm:block'>
                {item.name}
              </h3>
            </button>
          </>
        ))}
      </div>
    </div>
  )
}

export default SearchAuthor
