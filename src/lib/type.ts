interface VideoFormat {
  format_id: string
  format_note: string
  ext: string
  dimension: string
  resolution: string
  filesize: number
  protocol: string
  vcodec: string
  acodec: string
  code: string
}

export interface VideoInfo {
  id: string
  title: string
  duration: number
  formats: VideoFormat[]
}