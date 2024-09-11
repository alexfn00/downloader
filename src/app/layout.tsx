import { GeistSans } from 'geist/font/sans'
import { GeistMono } from 'geist/font/mono'

import type { Metadata } from 'next'
import './globals.css'
import SidebarProvider from '@/components/SidebarProvider'
import { cn } from '@/lib/utils'
import { Toaster } from '@/components/ui/toaster'
import Navbar from '@/components/Navbar'
import Providers from '@/components/Providers'

export const metadata: Metadata = {
  title: 'Youtube Downloader',
  description:
    'Youtube Downloader is a user-friendly software designed for downloading YouTube videos. With a simple interface, users can easily copy and paste video links to quickly download their favorite YouTube videos to their devices. The software supports various video formats and resolutions, allowing users to choose the format and quality that suits their needs. Whether users want to save videos for offline viewing or share them with friends, Youtube Downloader makes it easy to manage and enjoy YouTube content hassle-free.',
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang='en'>
      <body
        className={cn(
          'min-h-screen font-sans antialiased grainy',
          GeistSans.variable,
          GeistMono.variable,
        )}>
        <Providers>
          <SidebarProvider>
            <Toaster />
            <Navbar />
            <main className='flex flex-col flex-1 bg-muted/50'>{children}</main>
          </SidebarProvider>
        </Providers>
      </body>
    </html>
  )
}
