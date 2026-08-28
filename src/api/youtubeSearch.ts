export type SearchVideo = {
  id: string
  title: string
  thumbnail_url: string
  source_url: string
}

const INSTANCES = [
  'https://inv.nadeko.net',
  'https://invidious.nerdvpn.de',
  'https://yt.artemislena.eu',
]

export async function searchYouTube(query: string): Promise<SearchVideo[]> {
  const q = query.trim()
  if (!q) return []

  for (const base of INSTANCES) {
    try {
      const url = `${base}/api/v1/search?q=${encodeURIComponent(q)}&type=video`
      const res = await fetch(url)
      if (!res.ok) continue
      const data = await res.json()
      if (!Array.isArray(data)) continue

      const videos = data
        .filter((v: { type?: string; videoId?: string }) => v.type === 'video' && v.videoId)
        .slice(0, 24)
        .map((v: { videoId: string; title: string; videoThumbnails?: { url: string }[] }) => ({
          id: `yt-${v.videoId}`,
          title: v.title,
          thumbnail_url: `https://img.youtube.com/vi/${v.videoId}/hqdefault.jpg`,
          source_url: `https://www.youtube.com/watch?v=${v.videoId}`,
        }))

      if (videos.length) return videos
    } catch {
      // coba instance berikutnya
    }
  }

  return []
}