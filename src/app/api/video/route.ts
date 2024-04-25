import { db } from '@/app/db'

export async function GET() {
  const videos = await db.video.findMany({
    take: 10,
  })
  console.log(videos)
  let lists: object[] = []

  videos.map((item) => {
    lists.push({
      author: item.author,
      title: item.title,
      href: item.href,
    })
  })

  return Response.json(
    {
      lists,
    },
    {
      status: 200,
    },
  )
}
