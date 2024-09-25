'use client'

import { getChannelNameById } from '@/app/actions'
import { useQuery } from '@tanstack/react-query'

const ChannelTitle = ({ params }: { params: { id: string } }) => {
  const channelId = params.id

  const { data, isLoading } = useQuery({
    queryFn: () => getChannelNameById({ id: channelId }),
    queryKey: ['channelName', { channelId }],
    enabled: true, // disable this query from automatically running
    gcTime: 0,
  })
  return (
    <>
      <div className='text-3xl font-semibold p-4'>
        {!isLoading && data?.channelName ? data?.channelName : 'All Channels'}
      </div>
      <div className='text-lg text-gray-600 px-4'>
        {!isLoading && data?.channelName && '@' + data?.channelId}
      </div>
    </>
  )
}

export default ChannelTitle
