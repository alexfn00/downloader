import { createRedisInstance } from '@/lib/redis'
import axios from 'axios'
import Redis from 'ioredis'
import { NextResponse } from 'next/server'

export async function GET(res: Request) {
  const { searchParams } = new URL(res.url)

  // try fetch cached data

  const category = searchParams.get('category') || ''
  try {
    const redis = createRedisInstance()
    // const res = await redis.get('subscriptions', (err, result) => {
    //   console.log(err, result)
    // })
    // console.log(res)
    // redis.quit()
    // const redis = new Redis();
    redis.set('foo', category)
    redis.get('foo', (err, result) => {
      // `result` should be "bar"
      console.log(err, result)
    })
    redis.quit()
    // Or use Promise
    const result = await redis.get('foo')

    return NextResponse.json({ result })
  } catch (error) {
    console.log('fetch error:', error)
  }
}
