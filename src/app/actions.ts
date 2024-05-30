'use server'

import { db } from '@/db'

export const getUser = async ({ userId }: { userId: string }) => {
  const authors = await db.author.findMany({
    take: 10,
  })
  return authors
}

export const setUser = async ({ userId }: { userId: string }) => {
  return { name: 'John' }
}

const LIMIT = 10

export const fetchVideos = async ({
  author,
  pageParam,
}: {
  author: string
  pageParam: number | 0
}) => {
  const totalCount = await db.video.count({
    where: {
      author: author,
    },
  })
  const data = await db.video.findMany({
    skip: pageParam * LIMIT,
    where: {
      author: author,
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
  const totalCount = await db.author.count({})
  const data = await db.author.findMany({
    skip: pageParam * LIMIT,
    take: LIMIT,
  })
  const nextPage = pageParam + LIMIT < totalCount ? pageParam + 1 : null
  const totalPages = totalCount / LIMIT + (totalCount % LIMIT)

  return {
    authors: [...data],
    totalCount: totalCount,
    totalPages: totalPages,
    currentPage: pageParam,
    nextPage: nextPage,
  }
}
