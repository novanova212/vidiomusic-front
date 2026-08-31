import { useEffect, useState } from 'react'
import { mediaApi } from '../api/client'
import type { Song } from '../types/media'
import MediaCard from '../components/MediaCard'
import BackButton from '../components/BackButton'

export default function MusicListPage() {
  const [songs, setSongs] = useState<Song[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    mediaApi.getSongs().then((res) => {
      setSongs(res.data)
      setLoading(false)
    })
  }, [])

  if (loading) return (
    <div>
      <BackButton fallback="/" />
      <p>Memuat daftar musik...</p>
    </div>
  )

  return (
    <div>
      <BackButton fallback="/" />
      <h1>Musik</h1>
      <div className="media-grid">
        {songs.map((s) => (
          <MediaCard
            key={s.id}
            to={`/music/${s.slug}`}
            title={s.title}
            subtitle={`${s.artist || 'Musik'} · ${s.views ?? s.plays} ditonton`}
            thumbnail={s.cover_url}
            downloadUrl={s.download_url}
          />
        ))}
      </div>
    </div>
  )
}