'use server'

import { db } from '@/db'
import { getKindeServerSession } from '@kinde-oss/kinde-auth-nextjs/server'
import axios from 'axios'
import { HttpsProxyAgent } from 'https-proxy-agent'
import ytdl from 'ytdl-core'

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


export const authCallback = async () => {
  try {
    const { getUser } = getKindeServerSession()
    const user = await getUser()
    if (!user?.id || !user.email) {
      return { success: false }
    }
    const dbUser = await db.user.findFirst({
      where: {
        id: user.id,
      },
    })
    if (!dbUser) {
      await db.user.create({
        data: {
          id: user.id,
          email: user.email,
        },
      })
    }
    return { success: true }

  } catch (error) {
    console.log('authCallback error:', error)
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

export const deleteChannel = async (channel: { channelId: string }) => {
  await db.channel.delete({
    where: {
      channelId: channel.channelId,
    },
  })
}

export const parseURL = async (search: string | null) => {
  if (search == null) {
    return
  }
  const url = search
  try {
    let options = {}
    if (process.env.HTTP_PROXY) {
      const agent = new HttpsProxyAgent(process.env.HTTP_PROXY)
      options = { agent }
    }
    const info = await ytdl.getInfo(url, {
      requestOptions: options,
    })

    const audio_formats = ytdl.filterFormats(info.formats, 'audio')
    const format = ytdl.chooseFormat(audio_formats, { quality: 'highest' })
    const videoandaudio_formats = ytdl.filterFormats(
      info.formats,
      'videoandaudio',
    )
    const videoonly_formats = ytdl.filterFormats(info.formats, 'videoonly')
    const audioonly_formats = ytdl.filterFormats(info.formats, 'audioonly')

    const filename = info?.videoDetails.title
    const lengthSeconds = info.videoDetails.lengthSeconds

    const new_list = [
      ...videoandaudio_formats,
      ...audioonly_formats,
      ...videoonly_formats,
    ]
    return {
      filename,
      lengthSeconds,
      audio_formats,
      format,
      new_list,
    }
  } catch (error) {
    console.log('parseURL error:', error)
  }
}

export const addChannel = async (channel: { channelId: string }) => {
  try {
    const { getUser } = getKindeServerSession()
    const user = await getUser()

    if (!user?.id || !user.email) {
      return 'Forbidden'
    }

    const data = {
      name: 'youtube',
      author: channel.channelId,
      userId: user.id
    }
    const url = process.env.TASK_URL + '/task/'
    const result = await axios.post(url, data)

    const taskId = result.data['id']
    let channelResult = ''

    let counter = 0
    const sleep = (ms: number) => new Promise(r => setTimeout(r, ms))
    while (channelResult != 'SUCCESS') {
      if (counter >= 10) {
        channelResult = 'TIMEOUT'
        break
      }
      counter++
      await sleep(5000)
      await axios.get(process.env.TASK_URL + `/task/${taskId}`).then((response) => {
        channelResult = response.data.state
      }).catch((error) => {
        console.error(error)
      })
    }
    return channelResult
  } catch (error) {
    console.log(error)
  }
}