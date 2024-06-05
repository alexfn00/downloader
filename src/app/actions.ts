'use server'

import { db } from '@/db'

export const getUser = async ({ userId }: { userId: string }) => {
  const authors = await db.channel.findMany({
    take: 10,
  })
  return authors
}

export const setUser = async ({ userId }: { userId: string }) => {
  return { name: 'John' }
}

const LIMIT = 10

export const fetchVideos = async ({
  channel,
  type,
  pageParam,
}: {
  channel: string
  type: string
  pageParam: number | 0
}) => {
  const totalCount = await db.video.count({
    where: {
      channelId: channel,
    },
  })
  const data = await db.video.findMany({
    skip: pageParam * LIMIT,
    where: {
      channelId: channel,
      videoType: type,
    },
    include: {
      channel: true,
    },
    orderBy: [
      {
        updatedAt: 'desc',
      },
    ],
    take: LIMIT,
  })
  const nextPage = pageParam + LIMIT < totalCount ? pageParam + 1 : null
  const totalPages = totalCount / LIMIT + (totalCount % LIMIT)
  return {
    videos: [...data],
    totalCount: totalCount,
    totalPages: totalPages,
    currentPage: pageParam,
    nextPage: nextPage,
  }
}

export const fetchAuthors = async ({
  pageParam,
}: {
  pageParam: number | 0
}) => {
  const totalCount = await db.channel.count({})
  const data = await db.channel.findMany({
    skip: pageParam * LIMIT,
    take: LIMIT,
  })
  const nextPage = pageParam + LIMIT < totalCount ? pageParam + 1 : null
  const totalPages = totalCount / LIMIT + (totalCount % LIMIT)

  return {
    channels: [...data],
    totalCount: totalCount,
    totalPages: totalPages,
    currentPage: pageParam,
    nextPage: nextPage,
  }
}

// export const deleteAuthor = async ({ authorName }: { authorName: string }) => {
//   const deleteUser = await db.author.delete({
//     where: {
//       author: authorName,
//     },
//   })
// }
