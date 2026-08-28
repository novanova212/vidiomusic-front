import api from './client'
import { featuredVideos } from '../data/featuredVideos'

export type SearchVideo = {
  id: string
  title: string
  thumbnail_url: string
  source_url: string
}

export async function searchYouTube(query: string): Promise<SearchVideo[]> {
  const q = query.trim().toLowerCase()
  if (!q) return []

  const local: SearchVideo[] = featuredVideos
    .filter((v) => v.title.toLowerCase().includes(q))
    .map((v) => ({
      id: v.id,
      title: v.title,
      thumbnail_url: v.thumbnail_url,
      source_url: v.source_url,
    }))

  let remote: SearchVideo[] = []
  try {
    const { data } = await api.get('/discover/videos', { params: { q: query.trim() } })
    if (Array.isArray(data)) remote = data
  } catch {
    remote = []
  }

  const seen = new Set(local.map((v) => v.id))
  const merged = [...local]
  for (const v of remote) {
    if (!seen.has(v.id)) {
      seen.add(v.id)
      merged.push(v)
    }
  }
  return merged
}