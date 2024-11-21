import { buttonVariants } from '@/components/ui/button'
import { ArrowLeft } from 'lucide-react'
import Image from 'next/image'
import Link from 'next/link'

const page = () => {
  return (
    <div>
      <main className='md:max-w-6xl md:px-4 px-2 w-full'>
        <div className='mb-12 px-6 lg:px-8 flex flex-col items-center justify-center text-center mt-8'>
          <div className='max-auto max-w-2xl '>
            <h2 className='mt-2 font-bold text-4xl text-gray-900 sm:text-5xl'>
              Four steps to add channels and download related videos
            </h2>
          </div>
        </div>
        <div className='flex flex-row w-full items-start'>
          <Link
            href='/dashboard/manage'
            className={buttonVariants({
              variant: 'ghost',
              size: 'sm',
            })}>
            <ArrowLeft className='mr-2' />
            Channel Managment
          </Link>
        </div>
        {/* steps */}
        <ol className='my-8 space-y-10 pt-8 md:space-y-0'>
          <li className='md:flex-1'>
            <div className='flex flex-col space-y-2 border-l-4 border-zinc-300 py-2 pl-4 md:border-l-0 md:border-t-2 md:pb-0 md:pl-0 md:pt-4 mb-10'>
              <span className='text-xl font-semibold text-blue-600'>
                Step 1
              </span>
              <span className=''>
                Open{' '}
                <span>
                  {' '}
                  <a className=' text-blue-500' href='https://www.youtube.com'>
                    www.youtube.com
                  </a>
                </span>{' '}
                via your browser and search for your favorite channel
              </span>
              <div className='mx-auto max-w-6xl px-6 lg:px8'>
                <div className='mt-16 flow-root sm:mt-24'>
                  <div className='-m-2 rounded-xl bg-gray-900/5 p-2 ring-1 ring-inset ring-gray-900/10 lg:-m-4 lg:rounded-2xl lg:p-4'>
                    <Image
                      src='/search-channel.png'
                      alt='searching channel preview'
                      width={1288}
                      height={444}
                      quality={100}
                      className='rounded-md bg-white p-2 sm:p-8 md:p-20 shadow-2xl ring-1 ring-gray-900/10'
                    />
                  </div>
                </div>
              </div>
            </div>
          </li>
          <li className='md:flex-1'>
            <div className='flex flex-col space-y-2 border-l-4 border-zinc-300 py-2 pl-4 md:border-l-0 md:border-t-2 md:pb-0 md:pl-0 md:pt-4 mb-10'>
              <span className='text-xl font-semibold text-blue-600'>
                Step 2
              </span>
              <p className=''>
                Copy and paste the channel ID into the channel management input
                box
              </p>
              <p className=''>
                Click Add Channel, wait for a while, and then you can see the
                channel you added in the table
              </p>
              <div className='mx-auto max-w-6xl px-6 lg:px8'>
                <div className='mt-16 flow-root sm:mt-24'>
                  <div className='-m-2 rounded-xl bg-gray-900/5 p-2 ring-1 ring-inset ring-gray-900/10 lg:-m-4 lg:rounded-2xl lg:p-4'>
                    <Image
                      src='/add-channel.png'
                      alt='add channel preview'
                      width={1288}
                      height={444}
                      quality={100}
                      className='rounded-md bg-white p-2 sm:p-8 md:p-20 shadow-2xl ring-1 ring-gray-900/10'
                    />
                  </div>
                </div>
              </div>
            </div>
          </li>
          <li className='md:flex-1'>
            <div className='flex flex-col space-y-2 border-l-4 border-zinc-300 py-2 pl-4 md:border-l-0 md:border-t-2 md:pb-0 md:pl-0 md:pt-4 mb-10'>
              <span className='text-xl font-semibold text-blue-600'>
                Step 3
              </span>
              <p className=''>
                Click on the channel name to enter the channel list
              </p>
              <div className='mx-auto max-w-6xl px-6 lg:px8'>
                <div className='mt-16 flow-root sm:mt-24'>
                  <div className='-m-2 rounded-xl bg-gray-900/5 p-2 ring-1 ring-inset ring-gray-900/10 lg:-m-4 lg:rounded-2xl lg:p-4'>
                    <Image
                      src='/list-channel.png'
                      alt='add channel preview'
                      width={1288}
                      height={444}
                      quality={100}
                      className='rounded-md bg-white p-2 sm:p-8 md:p-20 shadow-2xl ring-1 ring-gray-900/10'
                    />
                  </div>
                </div>
              </div>
            </div>
          </li>
          <li className='md:flex-1'>
            <div className='flex flex-col space-y-2 border-l-4 border-zinc-300 py-2 pl-4 md:border-l-0 md:border-t-2 md:pb-0 md:pl-0 md:pt-4 mb-10'>
              <span className='text-xl font-semibold text-blue-600'>
                Step 4
              </span>
              <p className=''>
                Click on the video you like to watch or download
              </p>
              <div className='mx-auto max-w-6xl px-6 lg:px8'>
                <div className='mt-16 flow-root sm:mt-24'>
                  <div className='-m-2 rounded-xl bg-gray-900/5 p-2 ring-1 ring-inset ring-gray-900/10 lg:-m-4 lg:rounded-2xl lg:p-4'>
                    <Image
                      src='/watch-channel.png'
                      alt='add channel preview'
                      width={1288}
                      height={444}
                      quality={100}
                      className='rounded-md bg-white p-2 sm:p-8 md:p-20 shadow-2xl ring-1 ring-gray-900/10'
                    />
                  </div>
                </div>
              </div>
            </div>
          </li>
        </ol>
      </main>
    </div>
  )
}

export default page
