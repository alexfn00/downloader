'use client'

import { ArrowRight, Menu } from 'lucide-react'
import React, { useEffect, useState } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import {
  LoginLink,
  LogoutLink,
  RegisterLink,
} from '@kinde-oss/kinde-auth-nextjs/components'

const MobileNav = ({ isAuth }: { isAuth: boolean }) => {
  const [isOpen, setOpen] = useState<boolean>(false)

  const toggoeOpen = () => setOpen((prev) => !prev)
  const pathname = usePathname()

  useEffect(() => {
    if (isOpen) toggoeOpen()
  }, [pathname])

  const closeOnCurrent = (href: string) => {
    if (pathname === href) {
      toggoeOpen()
    }
  }
  return (
    <div className='sm:hidden'>
      <Menu
        onClick={toggoeOpen}
        className='relative z-50 w-5 h-5 text-zinc-700'
      />

      {isOpen && (
        <div className='fixed animate-in slide-in-from-top-5 fade-in-20 inset-0 z-0 w-full'>
          <ul className='absolute bg-white border-b border-zinc-200 shadow-xl grid w-full gap-3 px-10 pt-20 pb-8'>
            <li>
              <Link
                onClick={() => {
                  closeOnCurrent('/')
                }}
                className='flex items-center w-full font-semibold'
                href='/'>
                Home
              </Link>
            </li>
            <li className='my-3 h-px w-full bg-gray-300' />
            <li>
              <Link
                onClick={() => {
                  closeOnCurrent('/instagram')
                }}
                className='flex items-center w-full font-semibold'
                href='/instagram'>
                Instagram
              </Link>
            </li>
            <li className='my-3 h-px w-full bg-gray-300' />
            <li>
              <Link
                onClick={() => {
                  closeOnCurrent('/contact')
                }}
                className='flex items-center w-full font-semibold'
                href='/contact'>
                Contact Us
              </Link>
            </li>
            <li className='my-3 h-px w-full bg-gray-300' />
            <li>
              <Link
                onClick={() => {
                  closeOnCurrent('/download')
                }}
                className='flex items-center w-full font-semibold'
                href='/download'>
                My files
              </Link>
            </li>
            <li className='my-3 h-px w-full bg-gray-300' />
            {!isAuth ? (
              <>
                <li>
                  <Link
                    onClick={() => {
                      closeOnCurrent('/pricing')
                    }}
                    className='flex items-center w-full font-semibold'
                    href='/pricing'>
                    Pricing
                  </Link>
                </li>
                <li className='my-3 h-px w-full bg-gray-300' />
                <li>
                  <LoginLink
                    onClick={() => {
                      closeOnCurrent('/sign-in')
                    }}
                    className='flex items-center w-full font-semibold'>
                    Sign in
                  </LoginLink>
                </li>
                <li className='my-3 h-px w-full bg-gray-300' />
                <li>
                  <RegisterLink
                    onClick={() => {
                      closeOnCurrent('/sign-up')
                    }}
                    className='flex items-center w-full font-semibold text-green-600'>
                    Get started <ArrowRight className='ml-2 h-5 w-5' />
                  </RegisterLink>
                </li>
              </>
            ) : (
              <>
                <li>
                  <Link
                    onClick={() => {
                      closeOnCurrent('/dashboard')
                    }}
                    className='flex items-center w-full font-semibold'
                    href='/dashboard'>
                    My Channels
                  </Link>
                </li>
                <li className='my-3 h-px w-full bg-gray-300' />
                <li>
                  <LogoutLink className='flex items-center w-full font-semibold'>
                    Sign out
                  </LogoutLink>
                </li>
              </>
            )}
            <li className='my-3 h-px w-full bg-gray-300' />
          </ul>
        </div>
      )}
    </div>
  )
}

export default MobileNav
