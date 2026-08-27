/**
 * Cek apakah URL adalah link YouTube
 */
export function isYouTubeUrl(url: string | null | undefined): boolean {
  if (!url) return false
  return /(?:youtube\.com|youtu\.be)/i.test(url)
}

/**
 * Ubah URL YouTube biasa menjadi URL embed
 * Contoh: https://www.youtube.com/watch?v=ABC123 → https://www.youtube.com/embed/ABC123
 */
export function getYouTubeEmbedUrl(url: string): string | null {
  if (!url) return null

  // Format: https://www.youtube.com/watch?v=VIDEO_ID
  const watchMatch = url.match(/[?&]v=([^&]+)/)
  if (watchMatch) {
    return `https://www.youtube.com/embed/${watchMatch[1]}`
  }

  // Format: https://youtu.be/VIDEO_ID
  const shortMatch = url.match(/youtu\.be\/([^?&]+)/)
  if (shortMatch) {
    return `https://www.youtube.com/embed/${shortMatch[1]}`
  }

  // Format: https://www.youtube.com/embed/VIDEO_ID (sudah embed)
  const embedMatch = url.match(/youtube\.com\/embed\/([^?&]+)/)
  if (embedMatch) {
    return url
  }

  return null
}