import { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { mediaApi } from '../api/client'
import type { Video } from '../types/media'
import VideoPlayer from '../components/VideoPlayer'

export default function VideoDetailPage() {
  const { slug } = useParams<{ slug: string }>()
  const navigate = useNavigate()
  const [video, setVideo] = useState<Video | null>(null)

  useEffect(() => {
    if (slug) mediaApi.getVideo(slug).then(setVideo)
  }, [slug])

  if (!video) return <p>Memuat video...</p>

  return (
    <div>
      <button
        type="button"
        className="btn-back"
        onClick={() => {
          if (window.history.length > 1) {
            navigate(-1)
          } else {
            navigate('/videos')
          }
        }}
      >
        ← Kembali
      </button>
      <VideoPlayer video={video} />
    </div>
  )
}