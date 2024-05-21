import { db } from '@/db'

export async function GET() {
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
