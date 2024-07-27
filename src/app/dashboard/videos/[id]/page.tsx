import ChannelPage from '@/components/Channel'

const VideoPage = ({ params }: { params: { id: string } }) => {
  return (
    <>
      <ChannelPage
        params={{
          id: params.id,
        }}
      />
    </>
  )
}

export default VideoPage
