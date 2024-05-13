'use client'

import { VideoList } from '@/components/component/video-list'
import SearchAuthor from '@/components/search-author'
import SidebarToggle from '@/components/sidebar-toggle'

const Home = () => {
  return (
    <div className='flex flex-col'>
      <div className='mx-5 hidden sm:block'>
        <SidebarToggle />
      </div>
      <div className=' block sm:hidden'>
        <SearchAuthor />
      </div>
      <VideoList />
    </div>
  )
}

export default Home
