import { nanoid } from '@/lib/utils'
import React from 'react'

const IndexPage = () => {
  const id = nanoid()
  return <div>{id}</div>
}

export default IndexPage
