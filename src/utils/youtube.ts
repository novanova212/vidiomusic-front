export function extractYouTubeId(url: string | null | undefined): string | null {
  if (!url) return null
  const patterns = [
    /[?&]v=([^&]+)/,
    /youtu\.be\/([^?&]+)/,
    /youtube\.com\/embed\/([^?&]+)/,
    /youtube\.com\/shorts\/([^?&]+)/,
    /youtube\.com\/live\/([^?&]+)/,
  ]
  for (const p of patterns) {
    const m = url.match(p)
    if (m?.[1]) return m[1]
  }
  return null
}

export function isYouTubeUrl(url: string | null | undefined): boolean {
  return extractYouTubeId(url) !== null
}

export function getYouTubeEmbedUrl(url: string): string | null {
  const id = extractYouTubeId(url)
  if (!id) return null
  return `https://www.youtube.com/embed/${id}`
}

export function getYouTubeThumb(url: string | null | undefined): string | null {
  const id = extractYouTubeId(url)
  if (!id) return null
  return `https://img.youtube.com/vi/${id}/hqdefault.jpg`
}