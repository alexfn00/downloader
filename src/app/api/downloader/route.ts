import { HttpsProxyAgent } from 'https-proxy-agent'
import { NextResponse } from 'next/server'
import ytdl from 'ytdl-core'

export async function GET(res: Request) {
  const { searchParams } = new URL(res.url)

  const url = searchParams.get('url') || ''

  try {
    let options = {}
    if (process.env.HTTP_PROXY) {
      const agent = new HttpsProxyAgent(process.env.HTTP_PROXY)
      options = { agent }
    }
    console.log('start fetching')
    const info = await ytdl.getInfo(url, {
      requestOptions: options,
    })
    console.log('fetch completed')

    let qualities: string[] = []
    let lists: object[] = []
    let currentOption = {}

    const formats = ytdl.filterFormats(info.formats, 'audio')

    console.log(formats)
    const format = ytdl.chooseFormat(formats, { quality: 'highest' })
    const filename = `${info?.videoDetails.title}.${format.container}`
    const responseHeaders = {
      'content-Disposition': `attachment='${filename}'`,
    }

    formats.map((item) => {
      const isVideo = item.hasVideo && item.hasAudio
      const isAudio = !item.hasVideo && item.hasAudio
      const mimeType = item.mimeType?.split(';')[0]
      const optionTag = mimeType?.split('/')[0]
      const optionType = mimeType?.split('/')[1]

      const option =
        item.hasVideo && item.hasAudio
          ? optionTag + ' ' + optionType + ' ' + item.height
          : optionTag + ' ' + optionType + ' ' + item.audioBitrate

      lists.push({
        mimeType: mimeType,
        container: item.container,
        quality: item.quality,
        optionTag: optionTag,
        url: item.url,
        bitrate: item.bitrate,
        test:
          item.mimeType?.split(';')[0] === 'video/mp4'
            ? item.mimeType?.split(';')[0] + ' ' + item.qualityLabel
            : item.mimeType?.split(';')[0] + ' ' + item.bitrate,
        option: option.toUpperCase(),
      })
      currentOption = lists[0]
      qualities.push(item.qualityLabel)
    })
    return NextResponse.json({
      qualities,
      currentOption,
      lists,
      format,
      formats,
      responseHeaders,
      filename,
    })
  } catch (error) {
    console.log('fetch error:', error)
  }
}
export async function POST(req: Request) {
  const body = await req.json()
  console.log(body)

  return new Response(JSON.stringify({ hello: 'world' }))
}
