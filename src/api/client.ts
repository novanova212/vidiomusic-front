import axios from 'axios'
import type {
  DiscoverItem,
  EngagementSummary,
  EngagementType,
  ActivityHistory,
  MediaComment,
  Paginated,
  Song,
  Video,
} from '../types/media'

const GUEST_KEY = 'vidiomusic_guest_id'
const NAME_KEY = 'vidiomusic_display_name'

function makeGuestId() {
  const bytes = new Uint8Array(16)
  crypto.getRandomValues(bytes)
  return Array.from(bytes, (b) => b.toString(16).padStart(2, '0')).join('')
}

export function getGuestId() {
  try {
    let id = localStorage.getItem(GUEST_KEY)
    if (!id || !/^[A-Za-z0-9_-]{8,64}$/.test(id)) {
      id = makeGuestId()
      localStorage.setItem(GUEST_KEY, id)
    }
    return id
  } catch {
    return makeGuestId()
  }
}

export function getSavedName() {
  try {
    return localStorage.getItem(NAME_KEY) || ''
  } catch {
    return ''
  }
}

export function saveName(name: string) {
  try {
    localStorage.setItem(NAME_KEY, name)
  } catch {
    /* ignore */
  }
}

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || '/api',
})

api.interceptors.request.use((config) => {
  const guestId = getGuestId()
  const headers = config.headers as { set?: (k: string, v: string) => void } & Record<string, string>
  if (typeof headers?.set === 'function') headers.set('X-Guest-Id', guestId)
  else config.headers = { ...headers, 'X-Guest-Id': guestId }
  return config
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

export function addVideo(data: { title: string; description?: string; source_url: string; thumbnail_url?: string }) {
  return api.post('/videos', data)
}

export function addSong(data: { title: string; artist?: string; source_url: string; cover_url?: string }) {
  return api.post('/songs', data)
}

export const discoverApi = {
  getVideos: (refresh = false) =>
    api.get<DiscoverItem[]>('/discover/videos', { params: refresh ? { refresh: 1 } : {} }).then((r) => r.data),
  getMusic: (opts: { q?: string; refresh?: boolean } = {}) =>
    api
      .get<DiscoverItem[]>('/discover/music', {
        params: opts.q ? { q: opts.q } : opts.refresh ? { refresh: 1 } : {},
      })
      .then((r) => r.data),
}

export const engageApi = {
  get: (type: EngagementType, key: string) =>
    api.get<EngagementSummary>(`/engage/${type}/${encodeURIComponent(key)}`).then((r) => r.data),

  recordView: (type: EngagementType, key: string) =>
    api.post<EngagementSummary>(`/engage/${type}/${encodeURIComponent(key)}/view`).then((r) => r.data),

  react: (type: EngagementType, key: string, reaction: 'like' | 'dislike') =>
    api.post<EngagementSummary>(`/engage/${type}/${encodeURIComponent(key)}/react`, { reaction }).then((r) => r.data),

  comments: (type: EngagementType, key: string) =>
    api.get<MediaComment[]>(`/engage/${type}/${encodeURIComponent(key)}/comments`).then((r) => r.data),

  addComment: (type: EngagementType, key: string, author_name: string, body: string) =>
    api.post<MediaComment>(`/engage/${type}/${encodeURIComponent(key)}/comments`, { author_name, body }).then((r) => r.data),

  history: () =>
    api.get<ActivityHistory>('/me/history', { params: { name: getSavedName() } }).then((r) => r.data),
}

export default api