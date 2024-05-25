'use client'

import { useQuery } from '@tanstack/react-query'

import { getUser } from '../actions'
import { SkeletonCard } from '@/components/skeletons'

const Page = () => {
  const { data, isLoading, isError } = useQuery({
    queryFn: async () => await getUser({ userId: '0001' }),
    queryKey: ['q'], //Array according to Documentation
  })
  if (isLoading) return <SkeletonCard />
  if (isError) return <div>Sorry There was an Error</div>

  console.log(data)
  return (
    <div className='mt-4 -mb-3'>
      <ul>
        {data?.map((item) => (
          <li key={item.id}>{item.name}</li>
        ))}
      </ul>
    </div>
  )
}

export default Page
