import React, { useEffect, useState } from 'react'
import { useWatch } from './WatchProvider'
import axios from 'axios'
import { SkeletonCard } from './skeletons'

const SearchAuthor = () => {
  const { UpdateWatchId } = useWatch()
  const [loading, setLoading] = useState(false)
  const [results, setResults] = useState<any[]>([])

  const loadAuthors = async () => {
    try {
      setLoading(true)
      const response = await axios.get(`/api/author?q=`)
      // debugger

      if (response) {
        const data = response.data.authors
        setResults(data)
      }
    } catch (error) {
      console.log(error)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadAuthors()
  }, [])

  return (
    <div className='mt-2 space-x-2 w-full p-4 overflow-auto '>
      <div className='mx-2 flex flex-row justify-center border sm:flex-col bg-gray-100 rounded-md '>
        {loading && <SkeletonCard />}
        {loading &&
          results.map((item, index) => (
            <>
              <div className='m-2'>
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
              </div>
            </>
          ))}
      </div>
    </div>
  )
}

export default SearchAuthor
