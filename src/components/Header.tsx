import React from 'react'
import SidebarToggle from './sidebar-toggle'
// import SidebarMobile from './SidebarMobile'
// import ChatHistory from './ChatHistory'

const Header = () => {
  return (
    <>
      <div className='sticky top-0 z-50 flex items-center justify-between w-full h-16 px-4 border-b shrink-0 bg-gradient-to-b from-background/10 via-background/50 to-background/80 backdrop-blur-xl'>
        {/* <SidebarMobile>
          <ChatHistory />
        </SidebarMobile> */}
        <SidebarToggle />
      </div>
    </>
  )
}

export default Header
