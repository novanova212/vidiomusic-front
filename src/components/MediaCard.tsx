import { Link } from 'react-router-dom'

interface Props {
  to: string
  title: string
  subtitle?: string | null
  thumbnail?: string | null
  downloadUrl?: string
}

export default function MediaCard({ to, title, subtitle, thumbnail, downloadUrl }: Props) {
  return (
    <div className="media-card">
      <Link to={to} className="media-card-link">
        {thumbnail ? (
          <img src={thumbnail} alt={title} />
        ) : (
          <div className="media-card-placeholder" />
        )}
        <h3>{title}</h3>
        {subtitle && <p>{subtitle}</p>}
      </Link>
      {downloadUrl && (
        <a href={downloadUrl} download className="btn-download small">
          Unduh
        </a>
      )}
    </div>
  )
}