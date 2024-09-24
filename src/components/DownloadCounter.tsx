'use client'

import { deleteR2Bucket, fetch2buckets } from '@/app/actions'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
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
import { Button } from './ui/button'
import { download, getAnonymousSession } from '@/lib/utils'
import { useToast } from '@/components/ui/use-toast'
import { Loader2 } from 'lucide-react'

const DownloadCounter = () => {
  const [anonymous, setAnonymous] = useState<string | null>('')
  const [currentItem, setCurrentItem] = useState('')

  const { toast } = useToast()
  const queryClient = useQueryClient()
  useEffect(() => {
    setAnonymous(getAnonymousSession())
    refetch()
  }, [])

  const { data, refetch, isLoading } = useQuery({
    queryFn: () => fetch2buckets(anonymous),
    queryKey: ['r2buckets', { anonymous }],
    enabled: true, // disable this query from automatically running
    gcTime: 0,
  })

  const { mutateAsync: handleDelete, isPending } = useMutation({
    mutationFn: deleteR2Bucket,
    onSuccess: () => {
      toast({
        title: 'Remove',
        description: 'File has been removed',
      })
      queryClient.invalidateQueries({ queryKey: ['r2buckets'] })
    },
  })

  return (
    <>
      <div className='w-full mt-4 '>
        <h1 className='text-xl sm:text-3xl font-semibold sm:my-4'>
          Temporarily store files in our cloud server
        </h1>
        <p className='mt-y text-lg text-gray-600'>
          File will be deleted within
          <span className='font-semibold'> 60 </span>
          minutes. Please save as soon as possible.
        </p>
        {isLoading && (
          <div className='flex items-center justify-center'>
            <Loader2 className='mr-4 h-8 w-8 animate-spin' />
          </div>
        )}
        <div className='my-4 flex flex-row items-center text-left'>
          <div className='my-4'>Total: {data && data.data.length}</div>
        </div>
      </div>

      <div className='w-full mt-4 '>
        <Table className='border'>
          <TableCaption></TableCaption>
          <TableHeader>
            <TableRow>
              <TableHead className='w-[10px] text-left'>No.</TableHead>
              <TableHead>File Name</TableHead>
              <TableHead>File Type/Size</TableHead>
              <TableHead className='text-left'>Action</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {data?.data.map((item, index) => (
              <TableRow key={index}>
                <TableCell className='text-left'>{index + 1}</TableCell>
                <TableCell className='text-left'>
                  <div>
                    <a href={`https://r2.oecent.net/${item.r2}`}>
                      {item.fileName}
                    </a>
                  </div>
                </TableCell>
                <TableCell className='text-left'>
                  <div>{item.size}</div>
                </TableCell>
                <TableCell className='text-left'>
                  <Button
                    size='sm'
                    variant='ghost'
                    onClick={() => {
                      const url = `https://r2.oecent.net/${item.r2}`
                      download(url, item.fileName)
                    }}>
                    Download
                  </Button>
                  <Button
                    size='sm'
                    variant='destructive'
                    onClick={() => {
                      setCurrentItem(item.id)
                      handleDelete({ id: item.id })
                    }}>
                    {isPending && currentItem == item.id && (
                      <Loader2 className='mr-4 h-8 w-8 animate-spin' />
                    )}
                    Delete
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </>
  )
}

export default DownloadCounter
