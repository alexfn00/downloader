'use client'

import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { Loader2, Search } from 'lucide-react'
import { useEffect, useState } from 'react'
import { SkeletonCard } from '@/components/skeletons'
import {
  useInfiniteQuery,
  useMutation,
  useQueryClient,
} from '@tanstack/react-query'
import {
  addChannel,
  deleteChannel,
  fetchAuthors,
  updateChannels,
} from '../actions'
import { useInView } from 'react-intersection-observer'
import { Button } from '@/components/ui/button'
import Link from 'next/link'
import { Input } from '@/components/ui/input'

export default function Home() {
  const queryClient = useQueryClient()
  const [author, setAuthor] = useState<string>('')

  const {
    data: taskResult,
    mutateAsync: handleAdd,
    isPending: isAddPending,
  } = useMutation({
    mutationFn: addChannel,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['authors'] })
    },
  })

  const {
    data: updateResult,
    mutateAsync: handleUpdateAll,
    isPending: isUpdatePending,
  } = useMutation({
    mutationFn: updateChannels,
    onSuccess: () => {
      console.log('updateResult:', updateResult)
      queryClient.invalidateQueries({ queryKey: ['authors'] })
    },
  })

  const { data, error, status, fetchNextPage, isFetchingNextPage } =
    useInfiniteQuery({
      queryKey: ['authors'],
      queryFn: ({ pageParam }) => fetchAuthors({ pageParam }),
      initialPageParam: 0,
      getNextPageParam: (lastPage) => {
        return lastPage.nextPage
      },
    })

  const { ref, inView } = useInView()

  useEffect(() => {
    if (inView) {
      fetchNextPage()
    }
  }, [fetchNextPage, inView])

  const { mutateAsync: handleDelete, isPending: isDeletePending } = useMutation(
    {
      mutationFn: deleteChannel,
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: ['authors'] })
      },
    },
  )

  if (status === 'pending')
    return (
      <div>
        <SkeletonCard />
      </div>
    )

  if (status === 'error') return <div>{error.message}</div>

  return (
    <main className='md:max-w-6xl md:px-4 mx-auto md:w-2/3'>
      <div className='flex w-full max-w-2xl justify-start items-start space-x-2 py-8'>
        <Search className='mr-2 h-8 w-8' />
        <Input
          type='text'
          placeholder='Input youtube channel name'
          value={author}
          onChange={(e) => setAuthor(e.target.value)}
        />
        {isAddPending && <Loader2 className='mr-4 h-8 w-8 animate-spin' />}
        <Button
          size='sm'
          variant='ghost'
          className='rounded-md '
          onClick={() => {
            handleAdd({ channelId: author })
          }}>
          Add
        </Button>
        <Button
          size='sm'
          variant='ghost'
          onClick={() => {
            handleUpdateAll()
          }}>
          Update All
        </Button>
      </div>

      {isDeletePending && (
        <div className='flex items-center justify-center'>
          <Loader2 className='mr-4 h-8 w-8 animate-spin' />
        </div>
      )}

      <Table className='mt-4'>
        <TableCaption>Your favourite authors</TableCaption>
        <TableHeader>
          <TableRow>
            <TableHead className='w-[100px]'></TableHead>
            <TableHead>Name</TableHead>
            <TableHead>Last Update</TableHead>
            <TableHead className='text-right'>Action</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {data.pages.map((page) => {
            return (
              <>
                {page.channels.map((item) => {
                  return (
                    <TableRow key={item.id}>
                      <TableCell className='font-medium'>
                        <Link href={`/dashboard/videos/${item.id}`}>
                          <img
                            className='rounded-full mx-3 my-2'
                            alt='Author'
                            height={48}
                            width={48}
                            src={item.channelAvatar}
                          />
                        </Link>
                      </TableCell>
                      <TableCell>
                        <Link href={`/dashboard/videos/${item.id}`}>
                          {item.channelName}
                        </Link>
                      </TableCell>
                      <TableCell>
                        {new Date(item.updatedAt).toLocaleString()}
                      </TableCell>
                      <TableCell className='text-right'>
                        {isUpdatePending && (
                          <Loader2 className='mr-4 h-8 w-8 animate-spin' />
                        )}
                        <Button
                          size='sm'
                          variant='ghost'
                          onClick={() => {
                            setAuthor(item.channelId)
                            handleAdd({ channelId: item.channelId })
                          }}>
                          Update
                        </Button>
                        <Button
                          size='sm'
                          variant='destructive'
                          onClick={() => {
                            handleDelete({ channelId: item.channelId })
                          }}>
                          Delete
                        </Button>
                      </TableCell>
                    </TableRow>
                  )
                })}
              </>
            )
          })}
        </TableBody>
        <div ref={ref} className='flex flex-col items-center'>
          {isFetchingNextPage && (
            <Loader2 className='mr-4 h-16 w-16 animate-spin' />
          )}
        </div>
      </Table>
    </main>
  )
}
