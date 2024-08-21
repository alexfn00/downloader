'use server'

import { db } from '@/db'
import { getKindeServerSession } from '@kinde-oss/kinde-auth-nextjs/server'
import axios from 'axios'
import { HttpsProxyAgent } from 'https-proxy-agent'
import ytdl from 'ytdl-core'
import { MailtrapClient } from "mailtrap"
import { VideoInfo } from '@/lib/type'
import { absoluteUrl } from '@/lib/utils'
import { getUserSubscriptionPlan, stripe } from '@/lib/stripe'
import { PLANS } from '@/config/stripe'


export const getChannelNameById = async ({ id }: { id: string }) => {
  const data = await db.channel.findFirst({
    where: {
      id,
    }
  })
  return data
}

export const setUser = async ({ userId }: { userId: string }) => {
  return { name: 'John' }
}

const LIMIT = 10

export const fetchVideos = async ({
  channel,
  type,
  search,
  pageParam,
}: {
  channel: string
  type: string
  search: string
  pageParam: number | 0
}) => {
  const where = channel == '' ? {
    AND: {
      videoType: type,
      videoTitle: {
        contains: search
      }
    }

  } : {
    AND: {
      channelId: channel,
      videoType: type,
      videoTitle: {
        contains: search
      }
    }
  }

  const totalCount = await db.video.count({
    where: where
  })
  const data = await db.video.findMany({
    skip: pageParam * LIMIT,
    where: where,
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
    const response = await axios.post(process.env.TASK_URL + '/video', {
      url: url,
    })
    const videoInfo: VideoInfo = {
      id: response.data['id'],
      title: response.data['title'],
      duration: response.data['duration'],
      formats: [...response.data['formats']]
    }
    return videoInfo
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


export const addChannel = async (channel: { channelId: string }) => {
  try {
    const { getUser } = getKindeServerSession()
    const user = await getUser()

    if (!user?.id || !user.email) {
      return 'Forbidden'
    }
    console.log('ChannelId:', channel.channelId)
    let channels = []
    if (channel.channelId == '') {
      const channel_list = await db.channel.findMany({
        where: {
          userId: user.id,
        },
        select: {
          channelId: true,
        },
      })
      channels = [...channel_list.map((item) => item['channelId'])]
    } else {
      channels = [channel.channelId]
    }
    const data = {
      task_type: 'crawl',
      name: 'youtube',
      channels: channels,
      userId: user.id
    }
    console.log('data', data)
    const result = await axios.post(process.env.TASK_URL + '/task/', data)
    return result.data
  } catch (error) {
    console.log('addChannel error:', error)
  }
}

export const updateChannels = async () => {
  try {
    const { getUser } = getKindeServerSession()
    const user = await getUser()

    if (!user?.id || !user.email) {
      return 'Forbidden'
    }
    const channels = await db.channel.findMany({
      where: {
        userId: user.id,
      },
      select: {
        channelId: true,
      },
    })

    const data = {
      task_type: 'crawl',
      name: 'youtube',
      channels: [...channels.map((item) => item['channelId'])],
      userId: user.id
    }
    console.log(data)

    const result = await axios.post(process.env.TASK_URL + '/task/', data)
    return result.data
  } catch (error) {
    console.log('updateChannels error:', error)
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
    return result.data
  } catch (error) {
    console.log('startDownload error:', error)
  }
}

export const getTaskInfo = async (taskId: string | null) => {
  try {
    const response = await axios.get(process.env.TASK_URL + `/task/${taskId}`)
    const result = response.data
    console.log('getTaskInfo', result)
    return result
  } catch (error) {
    console.log('getTaskInfo error:', error)
  }
}


export const sendEmail = async (param: { firstName: string, lastName: string, email: string, message: string }) => {
  try {
    const client = new MailtrapClient({ token: process.env.MAILTRAP_API_TOKEN || '' })

    const sender = {
      email: "mailtrap@oecent.net",
      name: "Mailtrap Contact Us",
    }
    const recipients = [
      {
        email: "alexfn00@gmail.com",
      }
    ]
    client.send({
      from: sender,
      to: recipients,
      subject: "Contact us",
      text: 'from: ' + param.firstName + ' ' + param.lastName + ' ' + param.message,
      category: "contact us",
    }).then(console.log, console.error)
    return 'ok'
  } catch (error) {
    console.log('sendEmail error:', error)
  }
}


export const getInstagramInfo = async (userId: string | null) => {
  try {
    const data = {
      userId: userId,
    }
    const url = process.env.TASK_URL + '/task/instagram'
    const result = await axios.post(url, data)
    console.log('post result:', result.data)
    return result.data
  } catch (error) {
    console.log('run task getInstagramInfo error:', error)
  }
}


export const createStripeSession = async () => {
  const billingUrl = absoluteUrl('/dashboard/billing')

  const { getUser } = getKindeServerSession()
  const user = await getUser()

  if (!user?.id || !user.email) {
    throw new Error('403 Forbidden')
  }

  const dbUser = await db.user.findFirst({
    where: {
      id: user?.id,
    },
  })
  if (!dbUser) {
    throw new Error('401 UNAUTHORIZED')
  }

  const subscriptionPlan = await getUserSubscriptionPlan()
  if (subscriptionPlan.isSubscribed && dbUser.stripeCustomerId) {
    const stripeSession = await stripe.billingPortal.sessions.create({
      customer: dbUser.stripeCustomerId,
      return_url: billingUrl,
    })

    return { url: stripeSession.url }
  }
  const stripeSession = await stripe.checkout.sessions.create({
    success_url: billingUrl,
    cancel_url: billingUrl,
    payment_method_types: ['card', 'paypal'],
    mode: 'subscription',
    billing_address_collection: 'auto',
    line_items: [
      {
        price: PLANS.find((plan) => plan.name === 'Pro')?.price.priceIds.test,
        quantity: 1,
      },
    ],
    metadata: {
      userId: user?.id,
    },
  })
  return { url: stripeSession.url }
}
