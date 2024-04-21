import { db } from '@/app/db'

export async function GET() {
  const urls = await db.uRL.findMany({
    take: 10,
  })
  console.log(urls)

  return Response.json(
    {
      urls,
    },
    {
      status: 200,
    },
  )
}
