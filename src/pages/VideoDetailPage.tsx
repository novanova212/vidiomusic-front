import { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { mediaApi } from '../api/client'
import type { Video } from '../types/media'
import VideoPlayer from '../components/VideoPlayer'

export default function VideoDetailPage() {
  const { slug } = useParams<{ slug: string }>()
  const navigate = useNavigate()
  const [video, setVideo] = useState<Video | null>(null)
  const [deleting, setDeleting] = useState(false)

  useEffect(() => {
    if (slug) mediaApi.getVideo(slug).then(setVideo)
  }, [slug])

  async function handleDelete() {
    if (!slug) return
    if (!window.confirm('Hapus video ini dari daftar?')) return
    setDeleting(true)
    try {
      await mediaApi.deleteVideo(slug)
      navigate('/videos')
    } catch {
      alert('Gagal menghapus video.')
      setDeleting(false)
    }
  }

  if (!video) return <p>Memuat video...</p>

  return (
    <div>
      <div className="detail-actions">
        <button type="button" className="btn-back" onClick={() => navigate('/videos')}>
          ← Kembali
        </button>
        <button type="button" className="btn-delete" onClick={handleDelete} disabled={deleting}>
          {deleting ? 'Menghapus...' : 'Hapus video'}
        </button>
      </div>
      <VideoPlayer video={video} />
    </div>
  )
}