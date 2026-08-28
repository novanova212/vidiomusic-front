import { useEffect, useState } from 'react'
import { mediaApi } from '../api/client'
import type { Video } from '../types/media'
import MediaCard from '../components/MediaCard'
import { featuredVideos } from '../data/featuredVideos'

export default function VideoListPage() {
  const [uploaded, setUploaded] = useState<Video[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    mediaApi
      .getVideos()
      .then((res) => setUploaded(res.data))
      .catch(() => setUploaded([]))
      .finally(() => setLoading(false))
  }, [])

  return (
    <div>
      <h1>Video</h1>
      

      <h2>Untuk kamu</h2>
      <div className="media-grid">
        {featuredVideos.map((v) => (
          <MediaCard
            key={v.id}
            to={`/watch/${v.id}`}
            title={v.title}
            subtitle="YouTube"
            thumbnail={v.thumbnail_url}
            sourceUrl={v.source_url}
          />
        ))}
      </div>

      {uploaded.length > 0 && (
        <>
          <h2>Upload kamu</h2>
          <div className="media-grid">
            {uploaded.map((v) => (
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
        </>
      )}

      {loading && <p>Memuat upload kamu...</p>}
    </div>
  )
}