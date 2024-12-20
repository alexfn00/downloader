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
  const data = await db.channels.findFirst({
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

  const { getUser } = getKindeServerSession()
  const user = await getUser()

  if (!user?.id || !user.email) {
    throw new Error('403 Forbidden')
  }

  const where = channel == '' ? {
    AND: {
      type: type,
      userId: user?.id,
      title: {
        contains: search
      }
    }

  } : {
    AND: {
      channelId: channel,
      userId: user?.id,
      type: type,
      title: {
        contains: search
      }
    }
  }

  const totalCount = await db.videos.count({
    where: where
  })
  const data = await db.videos.findMany({
    skip: pageParam * LIMIT,
    where: where,
    include: {
      channels: true,
    },
    orderBy: [
      {
        updated: 'asc',
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
    const dbUser = await db.userInfo.findFirst({
      where: {
        id: user.id,
      },
    })
    if (!dbUser) {
      await db.userInfo.create({
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

export const fetchChannels = async ({
  pageParam,
}: {
  pageParam: number | 0
}) => {

  const { getUser } = getKindeServerSession()
  const user = await getUser()

  const subscriptionPlan = await getUserSubscriptionPlan()


  const totalCount = await db.channels.count({
    where: {
      userId: user?.id,
    }
  })
  const data = await db.channels.findMany({
    where: {
      userId: user?.id,
    },
    skip: pageParam * LIMIT,
    take: LIMIT,
    orderBy: {
      created: 'desc', // 'asc' for ascending order
    }
  })

  const nextPage = pageParam + LIMIT < totalCount ? pageParam + 1 : null
  const totalPages = totalCount / LIMIT + (totalCount % LIMIT)

  return {
    channels: [...data],
    totalCount: totalCount,
    totalPages: totalPages,
    currentPage: pageParam,
    nextPage: nextPage,
    subscriptionPlan: subscriptionPlan
  }
}

export const deleteChannel = async (channel: { channelId: string }) => {
  await db.channels.delete({
    where: {
      id: channel.channelId,
    },
  })
}

export const getVideoInfo = async (url: string | null) => {
  try {
    const response = await axios.post(process.env.TASK_URL + '/task/', {
      task_type: 'video_info',
      url: url,
    })
    return response.data
  } catch (error) {
    return { id: '', 'state': 'Error', value: error }
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

    const channelCount = await db.channels.count({
      where: {
        userId: user?.id,
      },
    })
    const subscriptionPlan = await getUserSubscriptionPlan()
    const { isSubscribed } = subscriptionPlan

    const isProExceeded =
      channelCount >= PLANS.find((plan) => plan.name === 'Pro')!.channelCount

    const isFreeExceeded =
      channelCount > PLANS.find((plan) => plan.name === 'Free')!.channelCount

    if (!isSubscribed && isFreeExceeded) {
      return { id: '', 'state': 'Error', value: 'Free Plan Exceeded or Pro plan expired, Please Upgrade to Pro Plan to continue' }
    }

    if (isSubscribed && isProExceeded) {
      return { id: '', 'state': 'Error', value: 'Pro Plan Exceeded' }
    }

    let channels = []
    if (channel.channelId == '') {
      const channel_list = await db.channels.findMany({
        where: {
          userId: user?.id,
        },
        select: {
          id: true,
        },
      })
      channels = [...channel_list.map((item) => item['id'])]
    } else {
      channels = [channel.channelId]
    }
    const data = {
      task_type: 'crawl',
      name: 'youtube',
      channels: channels,
      userId: user?.id
    }
    const result = await axios.post(process.env.TASK_URL + '/task/', data)

    return result.data
  } catch (error) {
    return { id: '', 'state': 'Error', value: error }
  }
}

export const updateChannel = async (channel: { channelId: string }) => {
  try {
    const { getUser } = getKindeServerSession()
    const user = await getUser()

    const channelCount = await db.channels.count({
      where: {
        userId: user?.id,
      },
    })

    const subscriptionPlan = await getUserSubscriptionPlan()

    if (subscriptionPlan.channelCount && channelCount > subscriptionPlan.channelCount) {
      return { id: '', state: 'Error', value: 'You cannot update any channels, please delete channels to ensure the number of channels is less than ' + subscriptionPlan.channelCount }
    }

    let channels = []
    if (channel.channelId == '') {
      return { id: '', state: 'Error', value: 'channel id cannot be empty' }
    } else {
      channels = [channel.channelId]
    }
    const data = {
      task_type: 'crawl',
      name: 'youtube',
      channels: channels,
      userId: user?.id
    }
    const result = await axios.post(process.env.TASK_URL + '/task/', data)
    return result.data
  } catch (error) {
    return { id: '', 'state': 'Error', value: error }
  }
}

export const updateChannels = async () => {
  try {
    const { getUser } = getKindeServerSession()
    const user = await getUser()

    const channelCount = await db.channels.count({
      where: {
        userId: user?.id,
      },
    })

    const subscriptionPlan = await getUserSubscriptionPlan()

    if (subscriptionPlan.channelCount && channelCount > subscriptionPlan.channelCount) {
      return { id: '', state: 'Error', value: 'You cannot update any channels, please delete channels to ensure the number of channels is less than ' + subscriptionPlan.channelCount }
    }

    const channels = await db.channels.findMany({
      where: {
        userId: user?.id,
      },
      select: {
        id: true,
      },
    })

    const data = {
      task_type: 'crawl',
      name: 'youtube',
      channels: [...channels.map((item) => item['id'])],
      userId: user?.id
    }
    const result = await axios.post(process.env.TASK_URL + '/task/', data)
    return result.data
  } catch (error) {
    console.log('updateChannels error:', error)
  }
}


export const startDownload = async (param: { downloadURL: string, type: string, value: string, userId: string | null }) => {
  try {
    let _userId = null
    let isAnonymous = true

    const { getUser } = getKindeServerSession()
    const user = await getUser()
    if (user && user?.id) {
      _userId = user?.id
      isAnonymous = true
    } else {
      if (param.userId && param.userId.length > 0) {
        _userId = param.userId
      }
    }

    if (!_userId) {
      console.log('UserId cannot be none')
      throw new Error('403 Forbidden')
    }

    const fileCount = await db.r2Bucket.count({
      where: {
        user_id: _userId,
      }
    })

    const subscriptionPlan = await getUserSubscriptionPlan()

    if (subscriptionPlan.quota && fileCount > subscriptionPlan.quota) {
      return { id: '', state: 'Error', value: 'You cannot download files, You are limited to download ' + subscriptionPlan.quota + ' files' }
    }

    if (param.type == 'dimension' && parseInt(param.value) >= 720 && !subscriptionPlan.hd) {
      return { id: '', state: 'Error', value: 'You cannot download HD videos in 720p or above' }
    }

    const data = {
      userId: _userId,
      task_type: 'download',
      url: param.downloadURL,
      download_type: param.type,
      download_value: param.value
    }
    const url = process.env.TASK_URL + '/task/download'
    const result = await axios.post(url, data)
    return result.data
  } catch (error) {
    console.log('startDownload error:', error)
  }
}

export const getTaskInfo = async (taskId: string | null) => {
  try {
    const response = await axios.get(process.env.TASK_URL + `/task/${taskId}`)
    const result = response.data
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

  const dbUser = await db.userInfo.findFirst({
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


export const fetch2buckets = async (userId: string | null) => {

  let _userId = null
  const { getUser } = getKindeServerSession()
  const user = await getUser()
  if (user && user?.id) {
    _userId = user?.id
  } else {
    if (userId && userId.length > 0) {
      _userId = userId
    }
  }


  if (!_userId) {
    console.log('UserId cannot be none')
    throw new Error('403 Forbidden')
  }

  const subscriptionPlan = await getUserSubscriptionPlan()

  const data = await db.r2Bucket.findMany({
    where: {
      user_id: _userId,
    }
  })
  return {
    data: [...data],
    subscriptionPlan: subscriptionPlan
  }
}


export const deleter2bucket = async (r2: { id: Number }) => {
  await db.r2Bucket.delete({
    where: {
      id: Number(r2.id),
    },
  })
}


export const doTranscript = async (url: string | null) => {
  try {
    const data = {
      userId: 'userId',
      url: url
    }
    const task_url = process.env.TASK_URL + '/task/transcribe'
    const response = await axios.post(task_url, data)
    return response.data
  } catch (error) {
    console.log('doTranscript error:', error)
  }
}