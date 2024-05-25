'use server'

import { db } from '@/db'

export const getUser = async ({ userId }: { userId: string }) => {
  console.log('userId:', userId)
  const authors = await db.author.findMany({
    take: 10,
  })
  return authors
}

export const setUser = async ({ userId }: { userId: string }) => {
  return { name: 'John' }
}

export const getVideos = async ({ author }: { author: string }) => {
  console.log('getVideos author:', author)
  const data = await db.video.findMany({
    where: {
      author: author,
    },
    take: 10,
  })
  let lists: object[] = []

  data.map((item) => {
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

  // console.log(data)
  return data
}
