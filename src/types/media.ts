export interface Video {
  id: number
  title: string
  slug: string
  description: string | null
  source_url: string
  thumbnail_url: string | null
  mime_type: string | null
  views: number
  downloads: number
  likes?: number
  dislikes?: number
  stream_url: string
  download_url: string
}

export interface Song {
  id: number
  title: string
  slug: string
  artist: string | null
  album: string | null
  source_url: string
  cover_url: string | null
  mime_type: string | null
  plays: number
  views?: number
  downloads: number
  likes?: number
  dislikes?: number
  stream_url: string
  download_url: string
}

export interface Paginated<T> {
  data: T[]
  current_page: number
  last_page: number
  total: number
}

export interface DiscoverItem {
  youtube_id: string
  title: string
  channel_title: string
  thumbnail_url: string | null
  watch_url: string
  duration_ms?: number | null
}

export type EngagementType = 'video' | 'song' | 'youtube' | 'spotify'

export interface EngagementSummary {
  target_type: EngagementType
  target_key: string
  views: number
  likes: number
  dislikes: number
  comments_count: number
  my_reaction: 'like' | 'dislike' | null
}

export interface MediaComment {
  id: number
  author_name: string
  body: string
  created_at: string | null
}


export interface ActivityItem {
  id: number
  kind: 'comment' | 'like' | 'dislike'
  target_type: EngagementType
  target_key: string
  title: string | null
  body?: string | null
  created_at: string | null
}

export interface ActivityHistory {
  comments: ActivityItem[]
  likes: ActivityItem[]
  dislikes: ActivityItem[]
}