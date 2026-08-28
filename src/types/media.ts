// Tipe data yang cocok dengan response JSON dari backend Laravel.
// Catatan: tidak ada lagi file_size/duration dari upload, karena file
// tidak disimpan di server kita (cukup link ke sumber aslinya).

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
  downloads: number
  stream_url: string
  download_url: string
}

export interface Paginated<T> {
  data: T[]
  current_page: number
  last_page: number
  total: number
}
// Hasil "Discover" (video/musik otomatis dari YouTube, bukan dari
// database kita). Dipakai khusus di beranda.
export interface DiscoverItem {
  youtube_id: string
  title: string
  channel_title: string
  thumbnail_url: string | null
  watch_url: string
}