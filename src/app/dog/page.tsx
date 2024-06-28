'use client'
import React from 'react'

const Dog = () => {
  const downloadFileStream = async (fileUrl: string) => {
    try {
      const response = await fetch(
        `/api/download?url=${encodeURIComponent(fileUrl)}`,
      )
      if (response.ok) {
        const reader = response.body?.getReader()
        const stream = new ReadableStream({
          start(controller) {
            function push() {
              reader?.read().then(({ done, value }) => {
                if (done) {
                  controller.close()
                  return
                }
                controller.enqueue(value)
                push()
              })
            }
            push()
          },
        })

        const newResponse = new Response(stream)
        const blob = await newResponse.blob()
        const url = window.URL.createObjectURL(blob)
        const a = document.createElement('a')
        a.href = url
        a.download = fileUrl.split('/').pop() || 'download'
        document.body.appendChild(a)
        a.click()
        a.remove()
        window.URL.revokeObjectURL(url)
      } else {
        console.error('Failed to download file')
      }
    } catch (error) {
      console.error('An error occurred while downloading the file', error)
    }
  }

  const downloadFile = async (fileUrl: string) => {
    try {
      const response = await fetch(
        `/api/download?url=${encodeURIComponent(fileUrl)}`,
      )
      if (response.ok) {
        const blob = await response.blob()
        const url = window.URL.createObjectURL(blob)
        const a = document.createElement('a')
        a.href = url
        a.download = 'demo.mp4' // fileUrl.split('/').pop() || 'download'
        document.body.appendChild(a)
        a.click()
        a.remove()
        window.URL.revokeObjectURL(url)
      } else {
        console.error('Failed to download file')
      }
    } catch (error) {
      console.error('An error occurred while downloading the file', error)
    }
  }

  const handleDownload = () => {
    // const fileUrl =
    //   'http://172.32.150.40:8082/artifactory/heyun/online_install.sh'

    const fileUrl =
      'https://rr2---sn-i3b7knlk.googlevideo.com/videoplayback?expire=1718372852&ei=lPVrZsuGDbvj7OsP6LGi8AY&ip=91.199.84.94&id=o-AI3H0JvXdZvlJsHMeMnPZUEOCwzPp2atMPl1C69t0kDb&itag=22&source=youtube&requiressl=yes&xpc=EgVo2aDSNQ%3D%3D&mh=Mg&mm=31%2C26&mn=sn-i3b7knlk%2Csn-un57sn7y&ms=au%2Conr&mv=m&mvi=2&pl=24&initcwndbps=2612500&bui=AbKP-1NUvGdC_pTktQ-I3axphSBH21RnyuHyRa-S7Bx4zkvyo-Cm26hA6-lsP_qAph6pVn9RZhTR9Kwt&spc=UWF9f6O7BzPAxrI22AmLxZ7KfWaBt6-_saxij5d5SzCmmZdtUhsQBP3I50nu&vprv=1&svpuc=1&mime=video%2Fmp4&ns=59qV8mXHaKOZT3Ov2yeMgVIQ&rqh=1&cnr=14&ratebypass=yes&dur=1025.811&lmt=1716528269732012&mt=1718350875&fvip=1&c=WEB&sefc=1&txp=5308224&n=nqLokvJq-J6l-Q&sparams=expire%2Cei%2Cip%2Cid%2Citag%2Csource%2Crequiressl%2Cxpc%2Cbui%2Cspc%2Cvprv%2Csvpuc%2Cmime%2Cns%2Crqh%2Ccnr%2Cratebypass%2Cdur%2Clmt&sig=AJfQdSswRgIhANtt-VZuqM7s8q8ExqIHA1duwNSt9zCHHM3bU2HOHgqFAiEAt1_dxL4q_K_d4dWqOsCGKTTtkJk1yk2eFpbQJyAjxMg%3D&lsparams=mh%2Cmm%2Cmn%2Cms%2Cmv%2Cmvi%2Cpl%2Cinitcwndbps&lsig=AHlkHjAwRQIhALm4Mbxo7Jjysor7pKjX-rttELSw_a7IqtjFPu5x9VIBAiB0DJ5B-xEDkJS-K2Sb5kMGSNPLd_hhtveLzkELeFPpLw%3D%3D'

    downloadFileStream(fileUrl)
  }

  return (
    <div>
      <button onClick={handleDownload}>Download File</button>
    </div>
  )
}

export default Dog
