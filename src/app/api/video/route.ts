import { db } from '@/app/db'

export async function GET(res: Request) {
  const { searchParams } = new URL(res.url)
  const author = searchParams.get('q') || ''

  const videos = await db.video.findMany({
    where: {
      author: author,
    },
    take: 10,
  })
  let lists: object[] = []

  videos.map((item) => {
    lists.push({
      author: item.author,
      title: item.title,
      href: item.href,
      period: item.period,
      thumbnail: item.thumbnail,
      published: item.published,
      viewCount: item.viewCount,
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
