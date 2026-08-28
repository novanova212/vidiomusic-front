import axios from 'axios'
import type { DiscoverItem, Paginated, Song, Video } from '../types/media'

// Base URL API Laravel.
// - Development: Vite mem-proxy '/api' ke backend lokal (lihat vite.config.ts).
// - Production (Vercel): WAJIB set env VITE_API_URL ke domain backend Railway.
const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || '/api',
})

export const mediaApi = {
  getVideos: (page = 1) =>
    api.get<Paginated<Video>>('/videos', { params: { page } }).then((r) => r.data),

  getVideo: (slug: string) =>
    api.get<Video>(`/videos/${slug}`).then((r) => r.data),

  getSongs: (page = 1) =>
    api.get<Paginated<Song>>('/songs', { params: { page } }).then((r) => r.data),

  getSong: (slug: string) =>
    api.get<Song>(`/songs/${slug}`).then((r) => r.data),

  deleteVideo: (slug: string) => api.delete(`/videos/${slug}`),

  deleteSong: (slug: string) => api.delete(`/songs/${slug}`),
}

// Tambah video baru CUKUP DENGAN LINK (bukan upload file). source_url
// adalah link ke video yang sudah ada di tempat lain (Google Drive yang
// di-share publik, hosting sendiri, dsb).
export function addVideo(data: { title: string; description?: string; source_url: string; thumbnail_url?: string }) {
  return api.post('/videos', data)
}

// Tambah musik baru cukup dengan link.
export function addSong(data: { title: string; artist?: string; source_url: string; cover_url?: string }) {
  return api.post('/songs', data)
}

// Video/musik OTOMATIS dari YouTube (bukan dari database kita), dipakai
// di beranda supaya selalu ada isi walau belum ada yang ditambah manual.
export const discoverApi = {
  getVideos: () => api.get<DiscoverItem[]>('/discover/videos').then((r) => r.data),
  getMusic: () => api.get<DiscoverItem[]>('/discover/music').then((r) => r.data),
}

export default api