'use client'

import { ArrowRight } from 'lucide-react'
import { Button } from './ui/button'
import { useMutation } from '@tanstack/react-query'
import { createStripeSession } from '@/app/actions'

const UpgradeButton = () => {
  const { mutateAsync: handleStripeSession } = useMutation({
    mutationFn: createStripeSession,
    onSuccess: ({ url }) => {
      window.location.href = url ?? '/dashboard/billing'
    },
  })
  return (
    <Button
      className='w-full'
      onClick={() => {
        handleStripeSession()
      }}>
      Upgrade now <ArrowRight className='h-5 w-5 ml-1.5' />
    </Button>
  )
}

export default UpgradeButton
