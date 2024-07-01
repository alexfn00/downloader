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
import { Loader2 } from 'lucide-react'
import { useEffect, useState } from 'react'
import { SkeletonCard } from '@/components/skeletons'
import {
  useInfiniteQuery,
  useMutation,
  useQueryClient,
} from '@tanstack/react-query'
import { addChannel, deleteChannel, fetchAuthors } from '../actions'
import { useInView } from 'react-intersection-observer'
import { Button } from '@/components/ui/button'
import Link from 'next/link'

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
    <main className='md:max-w-6xl md:px-4 mx-auto md:w-2/3 border'>
      <div className='flex flex-col items-center min-h-[200px] justify-center border bg-indigo-400 rounded-md text-white'>
        <h3 className=' w-11/12 text-center'>Search Authors</h3>
        <div className='mt-4 space-x-2 w-full flex justify-center p-4'>
          <input
            type='text'
            value={author}
            onChange={(e) => setAuthor(e.target.value)}
            className='p-2 w-[60%] outline-none text-black'
            placeholder='Input the youtube author'
          />
          <button
            onClick={() => {
              handleAdd({ channelId: author })
            }}
            className='border rounded-md p-1 font-semibold'>
            Search
          </button>
        </div>

        {isAddPending ? (
          <Loader2 className='mr-4 h-16 w-16 animate-spin' />
        ) : (
          taskResult
        )}
      </div>

      {isDeletePending && (
        <div className='flex items-center justify-center'>
          <Loader2 className='mr-4 h-8 w-8 animate-spin' />
        </div>
      )}

      <Table>
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
