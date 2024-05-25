'use client'
import { getVideos } from '@/app/actions'
import { useQuery, useQueryClient } from '@tanstack/react-query'
import { Loader2, Play } from 'lucide-react'
import Link from 'next/link'

const Page = ({ params }: { params: { id: string } }) => {
  const queryClient = useQueryClient()
  console.log('author:', params.id)

  const {
    data: videos,
    isLoading,
    isError,
  } = useQuery({
    queryFn: async () => await getVideos({ author: params.id }),
    queryKey: ['videos'],
    staleTime: Infinity,
    gcTime: 0,
  })
  setTimeout(() => {
    queryClient.invalidateQueries({ queryKey: ['videos'], type: 'active' })
  }, 100)

  if (isError) return <div>Sorry There was an Error</div>
  // if (!isLoading) {
  //   console.log(data)
  // }

  return (
    <section className='grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 p-4 md:p-6'>
      {isLoading && <Loader2 className='mr-4 h-16 w-16 animate-spin' />}
      {!isLoading &&
        videos?.map((video) => (
          <>
            <div className='relative group overflow-hidden rounded-lg'>
              <Link
                key={video.id}
                className='absolute inset-0 z-10'
                href={`/dashboard/watch?url=${video.href}`}>
                <span className='sr-only'>Play</span>
                <div className='absolute inset-0 flex items-center justify-center'>
                  <Play className='w-12 h-12 drop-shadow-lg' />
                </div>
              </Link>
              <div>
                <img
                  className='w-[480px] h-auto'
                  src={video.thumbnail}
                  alt='Youtube video cover'
                />
              </div>

              <div className='bg-white p-4 dark:bg-gray-950'>
                <h3 className='font-semibold text-lg md:text-xl line-clamp-2'>
                  {video.title}
                </h3>
                <div className='flex items-center justify-between text-sm text-gray-500 dark:text-gray-400'>
                  <span>{video.author}</span>
                  <span>{video.period}</span>
                </div>
                <div className='flex items-center justify-between text-sm text-gray-500 dark:text-gray-400'>
                  <span>{video.published}</span>
                  <span>{video.viewCount}</span>
                </div>
              </div>
            </div>
          </>
        ))}
    </section>
  )
}

export default Page
