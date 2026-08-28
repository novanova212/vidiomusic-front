import type { Video } from '../types/media'
import { getYouTubeEmbedUrl, isYouTubeUrl } from '../utils/youtube'

interface Props {
  video: Video
}

export default function VideoPlayer({ video }: Props) {
  const youtube = isYouTubeUrl(video.source_url)
  const embedUrl = youtube ? getYouTubeEmbedUrl(video.source_url) : null

  return (
    <div className="player-card">
      {youtube && embedUrl ? (
        <div className="youtube-embed-wrap">
          <iframe
            src={embedUrl}
            title={video.title}
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
          />
        </div>
      ) : (
        <video
          controls
          preload="metadata"
          poster={video.thumbnail_url ?? undefined}
          style={{ width: '100%', borderRadius: 8, background: '#000' }}
        >
          <source src={video.stream_url} type={video.mime_type ?? undefined} />
          Browser Anda tidak mendukung tag video.
        </video>
      )}
      <div className="player-info">
        <h2>{video.title}</h2>
        {video.description && <p>{video.description}</p>}
      </div>
    </div>
  )
}