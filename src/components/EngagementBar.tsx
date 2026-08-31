import { useEffect, useState } from 'react'
import { engageApi } from '../api/client'
import type { EngagementSummary, EngagementType } from '../types/media'
import { clearReaction, logActivity } from '../utils/activityStore'

interface Props {
  type: EngagementType
  targetKey: string
  title?: string
  recordView?: boolean
  initialViews?: number
  initialLikes?: number
  initialDislikes?: number
}

function formatCount(n: number) {
  if (n >= 1_000_000) return `${(n / 1_000_000).toFixed(1).replace(/\.0$/, '')} jt`
  if (n >= 1_000) return `${(n / 1_000).toFixed(1).replace(/\.0$/, '')} rb`
  return String(n)
}

export default function EngagementBar({
  type,
  targetKey,
  title,
  recordView = false,
  initialViews = 0,
  initialLikes = 0,
  initialDislikes = 0,
}: Props) {
  const [data, setData] = useState<EngagementSummary>({
    target_type: type,
    target_key: targetKey,
    views: initialViews,
    likes: initialLikes,
    dislikes: initialDislikes,
    comments_count: 0,
    my_reaction: null,
  })
  const [busy, setBusy] = useState(false)

  useEffect(() => {
    let cancelled = false
    const load = recordView
      ? engageApi.recordView(type, targetKey)
      : engageApi.get(type, targetKey)

    load
      .then((res) => {
        if (!cancelled) setData(res)
      })
      .catch(() => {})

    return () => {
      cancelled = true
    }
  }, [type, targetKey, recordView])

  function remember(reaction: 'like' | 'dislike', next: 'like' | 'dislike' | null) {
    if (next === null) clearReaction(type, targetKey, reaction)
    else {
      logActivity({
        kind: next,
        target_type: type,
        target_key: targetKey,
        title: title || null,
      })
    }
  }

  async function onReact(reaction: 'like' | 'dislike') {
    if (busy) return
    setBusy(true)
    try {
      const res = await engageApi.react(type, targetKey, reaction)
      setData(res)
      remember(reaction, res.my_reaction)
    } catch {
      const next = data.my_reaction === reaction ? null : reaction
      setData((prev) => ({
        ...prev,
        my_reaction: next,
        likes: prev.likes + (next === 'like' ? 1 : 0) - (prev.my_reaction === 'like' ? 1 : 0),
        dislikes: prev.dislikes + (next === 'dislike' ? 1 : 0) - (prev.my_reaction === 'dislike' ? 1 : 0),
      }))
      remember(reaction, next)
    } finally {
      setBusy(false)
    }
  }

  return (
    <div className="engagement-bar">
      <span className="view-count">{formatCount(data.views)} ditonton</span>
      <div className="react-group">
        <button
          type="button"
          className={`react-btn ${data.my_reaction === 'like' ? 'active like' : ''}`}
          onClick={() => onReact('like')}
          disabled={busy}
        >
          Suka {formatCount(data.likes)}
        </button>
        <button
          type="button"
          className={`react-btn ${data.my_reaction === 'dislike' ? 'active dislike' : ''}`}
          onClick={() => onReact('dislike')}
          disabled={busy}
        >
          Tidak suka {formatCount(data.dislikes)}
        </button>
      </div>
    </div>
  )
}
