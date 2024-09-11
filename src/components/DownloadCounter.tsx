'use client'

import { fetchR2Buckets } from '@/app/actions'
import { useQuery } from '@tanstack/react-query'
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import React, { useEffect, useState } from 'react'

const DownloadCounter = () => {
  const [anonymous, setAnonymous] = useState<string | null>('')

  useEffect(() => {
    if (typeof window !== 'undefined') {
      setAnonymous(localStorage.getItem('anonymousSession'))
      refetch()
    }
  }, [])

  const { data, refetch, isLoading } = useQuery({
    queryFn: () => fetchR2Buckets(anonymous),
    queryKey: ['r2buckets', { anonymous }],
    enabled: true, // disable this query from automatically running
    gcTime: 0,
  })

  {
    !isLoading && console.log(data)
  }
  return (
    <>
      {data && data.data.length > 0 && (
        <div className='w-full mt-4'>
          <div>Total: {data.data.length}</div>
          <Table className='border'>
            <TableCaption>
              <div>
                Your downloaded file list. The video will be deleted within 1
                hour
              </div>
              <div>
                The video will be deleted within
                <span className='font-semibold'> 60 </span>
                minutes. Please download it to your local computer as soon as
                possible.
              </div>
            </TableCaption>
            <TableHeader>
              <TableRow>
                <TableHead className='w-[100px] text-left'>No.</TableHead>
                <TableHead>File Name</TableHead>
                <TableHead className='text-left'>Action</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {data?.data.map((item, index) => (
                <TableRow key={index}>
                  <TableCell className='text-left'>{index + 1}</TableCell>
                  <TableCell>
                    <div>
                      <a href={`https://r2.oecent.net/${item.r2}`}>
                        {item.fileName}
                      </a>
                    </div>
                  </TableCell>
                  <TableCell className='text-left'>
                    <a href={`https://r2.oecent.net/${item.r2}`}>Save</a>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      )}
    </>
  )
}

export default DownloadCounter
