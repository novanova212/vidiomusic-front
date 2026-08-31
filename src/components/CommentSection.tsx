import { FormEvent, useEffect, useState } from 'react'
import { engageApi, getSavedName, saveName } from '../api/client'
import type { EngagementType, MediaComment } from '../types/media'

interface Props {
  type: EngagementType
  targetKey: string
}

function formatWhen(iso: string | null) {
  if (!iso) return ''
  const d = new Date(iso)
  if (Number.isNaN(d.getTime())) return ''
  return d.toLocaleString('id-ID', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  })
}

export default function CommentSection({ type, targetKey }: Props) {
  const [comments, setComments] = useState<MediaComment[]>([])
  const [name, setName] = useState(getSavedName)
  const [body, setBody] = useState('')
  const [sending, setSending] = useState(false)
  const [error, setError] = useState('')

  useEffect(() => {
    let cancelled = false
    engageApi
      .comments(type, targetKey)
      .then((list) => {
        if (!cancelled) setComments(Array.isArray(list) ? list : [])
      })
      .catch(() => {
        if (!cancelled) setComments([])
      })
    return () => {
      cancelled = true
    }
  }, [type, targetKey])

  async function onSubmit(e: FormEvent) {
    e.preventDefault()
    const author = name.trim()
    const text = body.trim()
    if (!author || !text) {
      setError('Isi nama dan komentar dulu.')
      return
    }
    setSending(true)
    setError('')
    try {
      const created = await engageApi.addComment(type, targetKey, author, text)
      saveName(author)
      setComments((prev) => [created, ...prev])
      setBody('')
    } catch (err: unknown) {
      const msg =
        (err as { response?: { data?: { message?: string } } })?.response?.data?.message ||
        'Gagal mengirim komentar. Jalankan migrasi backend dulu.'
      setError(msg)
    } finally {
      setSending(false)
    }
  }

  return (
    <section className="comment-section">
      <h3>Komentar ({comments.length})</h3>
      <form className="comment-form" onSubmit={onSubmit}>
        <input
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="Nama kamu"
          maxLength={40}
          required
        />
        <textarea
          value={body}
          onChange={(e) => setBody(e.target.value)}
          placeholder="Tulis komentar yang sopan..."
          maxLength={500}
          rows={3}
          required
        />
        <button type="submit" className="btn-primary" disabled={sending}>
          {sending ? 'Mengirim...' : 'Kirim komentar'}
        </button>
        {error && <p className="upload-error">{error}</p>}
      </form>
      <ul className="comment-list">
        {comments.length === 0 && <li className="comment-empty">Belum ada komentar. Jadi yang pertama!</li>}
        {comments.map((c) => (
          <li key={c.id} className="comment-item">
            <div className="comment-meta">
              <strong>{c.author_name}</strong>
              <span>{formatWhen(c.created_at)}</span>
            </div>
            <p>{c.body}</p>
          </li>
        ))}
      </ul>
    </section>
  )
}
