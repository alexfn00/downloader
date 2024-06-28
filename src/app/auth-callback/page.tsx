import { Suspense } from 'react'
import Redirect from '@/components/Redirect'

const Page = () => {
  return (
    <Suspense fallback={<>Loading</>}>
      <Redirect />
    </Suspense>
  )
}

export default Page
