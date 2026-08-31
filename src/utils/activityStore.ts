import type { ActivityHistory, ActivityItem, EngagementType } from '../types/media'

const KEY = 'vidiomusic_activity_v1'

function empty(): ActivityHistory {
  return { comments: [], likes: [], dislikes: [] }
}

export function readActivity(): ActivityHistory {
  try {
    const raw = localStorage.getItem(KEY)
    if (!raw) return empty()
    const parsed = JSON.parse(raw) as ActivityHistory
    return {
      comments: Array.isArray(parsed.comments) ? parsed.comments : [],
      likes: Array.isArray(parsed.likes) ? parsed.likes : [],
      dislikes: Array.isArray(parsed.dislikes) ? parsed.dislikes : [],
    }
  } catch {
    return empty()
  }
}

function writeActivity(data: ActivityHistory) {
  localStorage.setItem(KEY, JSON.stringify(data))
}

function push(list: ActivityItem[], item: ActivityItem) {
  return [item, ...list.filter((x) => !(x.kind === item.kind && x.target_type === item.target_type && x.target_key === item.target_key && x.kind !== 'comment'))].slice(0, 30)
}

export function logActivity(item: Omit<ActivityItem, 'id' | 'created_at'> & { id?: number }) {
  const data = readActivity()
  const full: ActivityItem = {
    ...item,
    id: item.id ?? Date.now(),
    created_at: new Date().toISOString(),
  }
  if (full.kind === 'comment') data.comments = [full, ...data.comments].slice(0, 30)
  if (full.kind === 'like') {
    data.likes = push(data.likes, full)
    data.dislikes = data.dislikes.filter((x) => !(x.target_type === full.target_type && x.target_key === full.target_key))
  }
  if (full.kind === 'dislike') {
    data.dislikes = push(data.dislikes, full)
    data.likes = data.likes.filter((x) => !(x.target_type === full.target_type && x.target_key === full.target_key))
  }
  writeActivity(data)
  return data
}

export function clearReaction(type: EngagementType, key: string, kind: 'like' | 'dislike') {
  const data = readActivity()
  if (kind === 'like') data.likes = data.likes.filter((x) => !(x.target_type === type && x.target_key === key))
  else data.dislikes = data.dislikes.filter((x) => !(x.target_type === type && x.target_key === key))
  writeActivity(data)
  return data
}

export function mergeHistory(remote?: ActivityHistory | null): ActivityHistory {
  const local = readActivity()
  if (!remote) return local
  const pack = (a: ActivityItem[], b: ActivityItem[]) => {
    const seen = new Set<string>()
    const out: ActivityItem[] = []
    for (const item of [...a, ...b]) {
      const k = `${item.kind}-${item.target_type}-${item.target_key}-${item.id}-${item.body || ''}`
      if (seen.has(k)) continue
      seen.add(k)
      out.push(item)
    }
    return out.slice(0, 30)
  }
  return {
    comments: pack(local.comments, remote.comments || []),
    likes: pack(local.likes, remote.likes || []),
    dislikes: pack(local.dislikes, remote.dislikes || []),
  }
}
