import ChannelPage from '@/components/Channel'

const Page = () => {
  return (
    <>
      <div className='text-3xl font-semibold p-4'>All Channels </div>
      <ChannelPage
        params={{
          id: '',
        }}
      />
    </>
  )
}

export default Page
