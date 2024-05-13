import { ArrowRight } from 'lucide-react'

import MaxWidthWrapper from './MaxWidthWrapper'
import { buttonVariants } from './ui/button'
import { getKindeServerSession } from '@kinde-oss/kinde-auth-nextjs/server'

import {
  LoginLink,
  RegisterLink,
} from '@kinde-oss/kinde-auth-nextjs/components'

import Link from 'next/link'
import UserAccountNav from './UserAccountNav'
import MobileNav from './MobileNav'

const Navbar = async () => {
  const { getUser } = getKindeServerSession()
  const user = await getUser()

  return (
    <nav className='sticky h-14 inset-x-0 top-0 z-30 w-full border-b border-gray-200 bg-white/75 backdrop-blur-lg transition-all'>
      <MaxWidthWrapper>
        <div className='flex h-14 items-center justify-between border-b border-zinc-200'>
          <Link href='/' className='flex z-40 font-semibold'>
            <span>Logo</span>
          </Link>

          <MobileNav isAuth={!!user} />

          <div className='hidden items-center space-x-4 sm:flex'>
            {!user ? (
              <>
                <Link
                  href='/dashboard'
                  className={buttonVariants({
                    variant: 'ghost',
                    size: 'sm',
                  })}>
                  Dashboard
                </Link>
                <Link
                  href='/task'
                  className={buttonVariants({
                    variant: 'ghost',
                    size: 'sm',
                  })}>
                  Task
                </Link>
                <Link
                  href='/pricing'
                  className={buttonVariants({
                    variant: 'ghost',
                    size: 'sm',
                  })}>
                  Pricing
                </Link>
                <LoginLink
                  postLoginRedirectURL='/dashboard'
                  className={buttonVariants({
                    variant: 'ghost',
                    size: 'sm',
                  })}>
                  Sign in
                </LoginLink>
                <RegisterLink
                  postLoginRedirectURL='/dashboard'
                  className={buttonVariants({
                    size: 'sm',
                  })}>
                  Get started <ArrowRight className='ml-1.5 h-4 w-5' />
                </RegisterLink>
              </>
            ) : (
              <>
                <Link
                  href='/dashboard'
                  className={buttonVariants({
                    variant: 'ghost',
                    size: 'sm',
                  })}>
                  Dashboard
                </Link>

                <UserAccountNav
                  name={
                    !user.given_name || !user.family_name
                      ? 'Your Account'
                      : `${user.given_name} ${user.family_name}`
                  }
                  email={user.email ?? ''}
                  imageUrl={user.picture ?? ''}
                />
              </>
            )}
          </div>
        </div>
      </MaxWidthWrapper>
    </nav>
  )
}

export default Navbar
