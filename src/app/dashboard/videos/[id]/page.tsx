import ChannelPage from '@/components/Channel'

const VideoPage = ({ params }: { params: { id: string } }) => {
  return (
    <>
      <div className='text-3xl font-semibold p-4'>Channel </div>
      <ChannelPage
        params={{
          id: params.id,
        }}
      />
    </>
  )
}

export default VideoPage
