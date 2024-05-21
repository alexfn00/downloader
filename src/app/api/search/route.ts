import { db } from '@/db'

export async function GET(res: Request) {
  const { searchParams } = new URL(res.url)
  const author = searchParams.get('q') || ''

  const authors = await db.author.findMany({
    take: 10,
  })

  return Response.json(
    {
      authors,
    },
    {
      status: 200,
    },
  )
}
