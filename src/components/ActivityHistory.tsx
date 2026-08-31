import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { engageApi } from '../api/client'
import type { ActivityItem } from '../types/media'

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
            <li key={`${item.kind}-${item.id}`}>
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
  const [comments, setComments] = useState<ActivityItem[]>([])
  const [likes, setLikes] = useState<ActivityItem[]>([])
  const [dislikes, setDislikes] = useState<ActivityItem[]>([])

  useEffect(() => {
    engageApi
      .history()
      .then((data) => {
        setComments(data.comments || [])
        setLikes(data.likes || [])
        setDislikes(data.dislikes || [])
      })
      .catch(() => {
        setComments([])
        setLikes([])
        setDislikes([])
      })
  }, [])

  return (
    <section className="history-section">
      <h2>Riwayat kamu</h2>
      <div className="history-grid">
        <List title="Riwayat komentar" items={comments} empty="Belum ada komentar." />
        <List title="Riwayat suka" items={likes} empty="Belum ada tanda suka." />
        <List title="Riwayat tidak suka" items={dislikes} empty="Belum ada tanda tidak suka." />
      </div>
    </section>
  )
}
