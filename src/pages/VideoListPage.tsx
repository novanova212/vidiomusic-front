import { useEffect, useState } from 'react'
import { mediaApi } from '../api/client'
import type { Video } from '../types/media'
import MediaCard from '../components/MediaCard'

export default function VideoListPage() {
  const [videos, setVideos] = useState<Video[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    mediaApi.getVideos().then((res) => {
      setVideos(res.data)
      setLoading(false)
    })
  }, [])

  if (loading) return <p>Memuat daftar video...</p>

  return (
    <div>
      <h1>Video</h1>
      {videos.length === 0 && <p>Belum ada video.</p>}
      <div className="media-grid">
        {videos.map((v) => (
          <MediaCard
            key={v.id}
            to={`/videos/${v.slug}`}
            title={v.title}
            subtitle={`${v.views} kali ditonton`}
            thumbnail={v.thumbnail_url}
            sourceUrl={v.source_url}
          />
        ))}
      </div>
    </div>
  )
}