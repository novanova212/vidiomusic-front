import { Link } from 'react-router-dom'
import { getYouTubeThumb } from '../utils/youtube'

interface Props {
  to: string
  title: string
  subtitle?: string | null
  thumbnail?: string | null
  sourceUrl?: string | null
  downloadUrl?: string
}

export default function MediaCard({ to, title, subtitle, thumbnail, sourceUrl, downloadUrl }: Props) {
  const img = thumbnail || getYouTubeThumb(sourceUrl)

  return (
    <div className="media-card">
      <Link to={to} className="media-card-link">
        {img ? <img src={img} alt={title} /> : <div className="media-card-placeholder" />}
        <h3>{title}</h3>
        {subtitle && <p>{subtitle}</p>}
      </Link>
      {downloadUrl && (
        <a href={downloadUrl} download className="btn-download small">Unduh</a>
      )}
    </div>
  )
}