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

export const getVideoInfo = async (url: string | null) => {
  try {
    const response = await axios.get(process.env.TASK_URL + `/video?url=${url}`)
    const result = { "id": response.data['id'], 'title': response.data['title'], 'duration': response.data['duration'], formats: [...response.data['formats']] }
    // console.log('getVideoInfo', result)
    return result
  } catch (error) {
    console.log('getVideoInfo error:', error)
  }
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
    // console.log(info)

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

const sleep = (ms: number) => new Promise(r => setTimeout(r, ms))

export const runTask = async (channel: string, userId: string) => {
  try {
    const data = {
      task_type: 'crawl',
      name: 'youtube',
      author: channel,
      userId: userId
    }
    const url = process.env.TASK_URL + '/task/'
    const result = await axios.post(url, data)
    const taskId = result.data['id']
    let channelResult = ''

    let counter = 0
    while (channelResult != 'SUCCESS') {
      if (counter >= 60) {
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


export const addChannel = async (channel: { channelId: string }) => {
  try {
    const { getUser } = getKindeServerSession()
    const user = await getUser()

    if (!user?.id || !user.email) {
      return 'Forbidden'
    }
    return runTask(channel.channelId, user.id)
  } catch (error) {
    console.log('addChannel error:', error)
  }
}

export const updateChannels = async () => {
  const { getUser } = getKindeServerSession()
  const user = await getUser()

  if (!user?.id || !user.email) {
    return 'Forbidden'
  }
  const channels = await db.channel.findMany({
    where: {
      userId: user.id,
    },
  })
  for (let channel of channels) {
    await runTask(channel.channelId, user.id)
  }
}


export const startDownload = async (param: { downloadURL: string, type: string, value: string }) => {
  try {
    const data = {
      task_type: 'download',
      url: param.downloadURL,
      download_type: param.type,
      download_value: param.value
    }
    console.log('startDownload data', data)
    const url = process.env.TASK_URL + '/task/'
    const result = await axios.post(url, data)
    console.log('post result:', result.data)
    let res = result.data
    const taskId = result.data['id']
    let channelResult = ''

    let counter = 0
    while (channelResult != 'SUCCESS') {
      if (counter >= 20) {
        channelResult = 'TIMEOUT'
        break
      }
      counter++
      await sleep(5000)
      // const response = await fetch(process.env.TASK_URL + `/task/${taskId}`);
      // res = response
      // console.log('task result', response)
      await axios.get(process.env.TASK_URL + `/task/${taskId}`).then((response) => {
        channelResult = response.data.state
        res = response.data
        console.log(response.data)
      }).catch((error) => {
        console.error(error)
      })
    }
    console.log('startDownload:', channelResult)
    console.log('res:', res)
    return res
  } catch (error) {
    console.log('startDownload error:', error)
  }
}

export const getTaskInfo = async (taskId: string | null) => {
  try {
    return await axios.get(process.env.TASK_URL + `/task/${taskId}`)
  } catch (error) {
    console.log('getTaskInfo error:', error)
  }
}