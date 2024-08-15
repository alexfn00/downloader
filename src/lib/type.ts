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


interface InstagramPost {
  profile: string
  url: string
  caption: string
  is_video: boolean
  video_url: string
  video_view_count: number
  likes: number
  comments: number
  caption_hashtags: string[]
}
export interface InstagramInfo {
  pic_url: string
  username: string
  userid: number
  mediacount: number
  followers: number
  followees: number
  biography: string
  external_url: string
  posts: InstagramPost[]
}