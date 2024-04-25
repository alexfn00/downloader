import React, { useEffect, useState } from 'react'
import Image from 'next/image'

const SearchAuthor = () => {
  const [query, setQuery] = useState()
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
    <div className='mt-4 space-x-2 w-full flex justify-center p-4'>
      <input
        type='text'
        onChange={search}
        className='p-2 w-[60%] outline-none text-black'
        placeholder='Search author'
      />
      {/* <a href=''>{typeof results}</a> */}
      {results.map((item, index) => (
        <>
          <a key={item.id} href=''>
            <img
              alt='Video Thumbnail'
              height={60}
              src={item.avatar}
              width={60}
            />
            <h3>{item.name}</h3>
          </a>
          {/* <div className='relative group overflow-hidden rounded-lg'>
            {item.name}
          </div> */}
        </>
      ))}
    </div>
  )
}

export default SearchAuthor
