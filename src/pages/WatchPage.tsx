import { useNavigate, useParams, useSearchParams } from 'react-router-dom'
import { featuredVideos } from '../data/featuredVideos'
import { getYouTubeEmbedUrl } from '../utils/youtube'

export default function WatchPage() {
  const { id } = useParams<{ id: string }>()
  const [params] = useSearchParams()
  const navigate = useNavigate()

  const catalog = featuredVideos.find((v) => v.id === id)
  const youtubeId = (catalog?.source_url.match(/v=([^&]+)/)?.[1] || id?.replace(/^yt-/, '') || '').trim()
  const title = params.get('title') || catalog?.title || 'Video YouTube'
  const embed = youtubeId ? getYouTubeEmbedUrl(`https://www.youtube.com/watch?v=${youtubeId}`) : null

  if (!embed) {
    return (
      <div>
        <button type="button" className="btn-back" onClick={() => navigate('/videos')}>
          ← Kembali
        </button>
        <p>Video tidak ditemukan.</p>
      </div>
    )
  }

  return (
    <div>
      <button type="button" className="btn-back" onClick={() => navigate('/videos')}>
        ← Kembali
      </button>
      <div className="player-card">
        <div className="youtube-embed-wrap">
          <iframe
            src={embed}
            title={title}
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
            allowFullScreen
            referrerPolicy="strict-origin-when-cross-origin"
          />
        </div>
        <div className="player-info">
          <h2>{title}</h2>
        </div>
      </div>
    </div>
  )
}