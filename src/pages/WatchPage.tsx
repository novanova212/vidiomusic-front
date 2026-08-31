import { useParams, useSearchParams } from 'react-router-dom'
import { featuredVideos } from '../data/featuredVideos'
import { getYouTubeEmbedUrl } from '../utils/youtube'
import EngagementBar from '../components/EngagementBar'
import CommentSection from '../components/CommentSection'
import BackButton from '../components/BackButton'

export default function WatchPage() {
  const { id } = useParams<{ id: string }>()
  const [params] = useSearchParams()
  const catalog = featuredVideos.find((v) => v.id === id)
  const youtubeId = (catalog?.source_url.match(/v=([^&]+)/)?.[1] || id?.replace(/^yt-/, '') || '').trim()
  const title = params.get('title') || catalog?.title || 'Video YouTube'
  const embed = youtubeId ? getYouTubeEmbedUrl(`https://www.youtube.com/watch?v=${youtubeId}`) : null

  if (!embed || !youtubeId) {
    return (
      <div>
        <BackButton fallback="/videos" />
        <p>Video tidak ditemukan.</p>
      </div>
    )
  }

  return (
    <div>
      <BackButton fallback="/videos" />
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
      <EngagementBar type="youtube" targetKey={youtubeId} title={title} recordView />
      <CommentSection type="youtube" targetKey={youtubeId} title={title} />
    </div>
  )
}
