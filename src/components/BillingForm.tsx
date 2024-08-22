'use client'

import { getUserSubscriptionPlan } from '@/lib/stripe'
import { useToast } from './ui/use-toast'
import MaxWidthWrapper from './MaxWidthWrapper'
import {
  Card,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from './ui/card'
import { Button } from './ui/button'
import { Loader2 } from 'lucide-react'
import { format } from 'date-fns'
import { useMutation } from '@tanstack/react-query'
import { createStripeSession } from '@/app/actions'

interface BillingFormProps {
  subscriptionPlan: Awaited<ReturnType<typeof getUserSubscriptionPlan>>
}

const BillingForm = ({ subscriptionPlan }: BillingFormProps) => {
  const { toast } = useToast()

  const { mutateAsync: handleStripeSession, isPending } = useMutation({
    mutationFn: createStripeSession,
    onSuccess: ({ url }) => {
      if (url) {
        window.location.href = url
      } else {
        toast({
          title: 'There is a problem...',
          description: 'Please try again in a moment',
          variant: 'destructive',
        })
      }
    },
  })

  return (
    <MaxWidthWrapper className='max-w-5xl'>
      <div className='mt-12'>
        <Card>
          <CardHeader>
            <CardTitle>Subscription Plan</CardTitle>
            <CardDescription>
              You are currently on the <strong>{subscriptionPlan.name}</strong>{' '}
              plan
            </CardDescription>
          </CardHeader>

          <CardFooter className='flex flex-col items-center space-y-2 md:flex-row md:justify-between md: space-x-0 '>
            <Button
              onClick={() => {
                handleStripeSession()
              }}>
              {isPending ? (
                <Loader2 className='mr-4 h-4 w-4 animate-spin' />
              ) : null}
              {subscriptionPlan.isSubscribed
                ? 'Manage Subsciption'
                : 'Upgrade to PRO'}
            </Button>

            {subscriptionPlan.isSubscribed ? (
              <p className='rounded-full text-xs font-medium'>
                {subscriptionPlan.isCanceled
                  ? 'Your plan will be canceled on'
                  : 'Your plan renews on '}
                {format(subscriptionPlan.stripeCurrentPeriodEnd!, 'dd.MM.yyyy')}
                .
              </p>
            ) : null}
          </CardFooter>
        </Card>
      </div>
    </MaxWidthWrapper>
  )
}

export default BillingForm
