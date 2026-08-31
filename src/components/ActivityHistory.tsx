import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { engageApi } from '../api/client'
import type { ActivityItem } from '../types/media'
import { mergeHistory, readActivity } from '../utils/activityStore'

function hrefOf(item: ActivityItem) {
  if (item.target_type === 'video') return `/videos/${item.target_key}`
  if (item.target_type === 'song') return `/music/${item.target_key}`
  return `/watch/${item.target_key}`
}

function labelOf(type: ActivityItem['target_type']) {
  if (type === 'video') return 'Video'
  if (type === 'song') return 'Musik'
  return 'YouTube'
}

function List({ title, items, empty }: { title: string; items: ActivityItem[]; empty: string }) {
  return (
    <article className="history-col">
      <h3>{title}</h3>
      {items.length === 0 ? (
        <p className="history-empty">{empty}</p>
      ) : (
        <ul>
          {items.map((item) => (
            <li key={`${item.kind}-${item.id}-${item.target_key}`}>
              <Link to={hrefOf(item)}>
                <strong>{item.title || item.target_key}</strong>
                {item.body && <span>{item.body}</span>}
                <small>{labelOf(item.target_type)}</small>
              </Link>
            </li>
          ))}
        </ul>
      )}
    </article>
  )
}

export default function ActivityHistory() {
  const initial = readActivity()
  const [comments, setComments] = useState<ActivityItem[]>(initial.comments)
  const [likes, setLikes] = useState<ActivityItem[]>(initial.likes)
  const [dislikes, setDislikes] = useState<ActivityItem[]>(initial.dislikes)

  useEffect(() => {
    engageApi
      .history()
      .then((data) => {
        const merged = mergeHistory(data)
        setComments(merged.comments)
        setLikes(merged.likes)
        setDislikes(merged.dislikes)
      })
      .catch(() => {
        const local = readActivity()
        setComments(local.comments)
        setLikes(local.likes)
        setDislikes(local.dislikes)
      })
  }, [])

  return (
    <section className="history-section">
      <h2>Riwayat kamu</h2>
      <div className="history-grid">
        <List title="Riwayat komentar" items={comments} empty="Belum ada. Tulis komentar di video atau musik dulu." />
        <List title="Riwayat suka" items={likes} empty="Belum ada. Tekan Suka di video atau musik dulu." />
        <List title="Riwayat tidak suka" items={dislikes} empty="Belum ada. Tekan Tidak suka di video atau musik dulu." />
      </div>
    </section>
  )
}
