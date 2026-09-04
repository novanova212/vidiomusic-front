import { useParams, useSearchParams } from 'react-router-dom'
import { getSpotifyEmbedUrl } from '../utils/spotify'
import EngagementBar from '../components/EngagementBar'
import CommentSection from '../components/CommentSection'
import BackButton from '../components/BackButton'

// Halaman ini untuk memutar lagu yang datang dari Spotify (discover /
// hasil pencarian), BUKAN dari database kita. Sama seperti WatchPage
// untuk video YouTube: tidak ada file yang disimpan, cuma diputar
// lewat iframe embed Spotify berdasarkan ID lagu di URL.
export default function ListenPage() {
  const { id } = useParams<{ id: string }>()
  const [params] = useSearchParams()
  const title = params.get('title') || 'Musik'
  const artist = params.get('artist') || ''
  const cover = params.get('cover') || ''
  const embed = id ? getSpotifyEmbedUrl(`https://open.spotify.com/track/${id}`) : null

  if (!embed || !id) {
    return (
      <div>
        <BackButton fallback="/music" />
        <p>Musik tidak ditemukan.</p>
      </div>
    )
  }

  return (
    <div>
      <BackButton fallback="/music" />
      <div className="player-card">
        {cover && <img src={cover} alt={title} className="cover-art" />}
        <iframe
          className="spotify-embed"
          src={embed}
          title={title}
          allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture"
          loading="lazy"
        />
        <div className="player-info">
          <h2>{title}</h2>
          {artist && <p>{artist}</p>}
        </div>
      </div>
      <EngagementBar type="spotify" targetKey={id} title={title} recordView />
      <CommentSection type="spotify" targetKey={id} title={title} />
    </div>
  )
}