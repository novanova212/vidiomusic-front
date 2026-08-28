import { useNavigate, useParams } from 'react-router-dom'
import { featuredVideos } from '../data/featuredVideos'
import { getYouTubeEmbedUrl } from '../utils/youtube'

export default function WatchPage() {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const video = featuredVideos.find((v) => v.id === id)

  if (!video) {
    return (
      <div>
        <button type="button" className="btn-back" onClick={() => navigate('/videos')}>
          ← Kembali
        </button>
        <p>Video tidak ditemukan.</p>
      </div>
    )
  }

  const embed = getYouTubeEmbedUrl(video.source_url)

  return (
    <div>
      <button type="button" className="btn-back" onClick={() => navigate('/videos')}>
        ← Kembali
      </button>
      <div className="player-card">
        {embed && (
          <div className="youtube-embed-wrap">
            <iframe
              src={embed}
              title={video.title}
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
            />
          </div>
        )}
        <div className="player-info">
          <h2>{video.title}</h2>
        </div>
      </div>
    </div>
  )
}