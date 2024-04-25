import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'

const inter = Inter({ subsets: ['latin'] })

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
      <body className={inter.className}>{children}</body>
    </html>
  )
}
