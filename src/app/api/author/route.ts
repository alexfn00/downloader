import { db } from '@/app/db'

export async function GET() {
  const authors = await db.author.findMany({
    take: 10,
  })
  console.log(authors)

  return Response.json(
    {
      authors,
    },
    {
      status: 200,
    },
  )
}
