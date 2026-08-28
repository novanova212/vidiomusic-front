import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { discoverApi } from '../api/client'
import type { DiscoverItem } from '../types/media'
import DiscoverCard from '../components/DiscoverCard'
import { getYouTubeEmbedUrl } from '../utils/youtube'

// Beranda: selain link ke daftar video/musik milik sendiri, ada juga
// bagian "Video & Musik Trending" yang diambil OTOMATIS dari YouTube
// Data API (bukan dari database kita) — jadi beranda tidak pernah
// kosong walau belum ada satupun yang ditambahkan manual.
export default function HomePage() {
  const [videos, setVideos] = useState<DiscoverItem[]>([])
  const [music, setMusic] = useState<DiscoverItem[]>([])
  const [playing, setPlaying] = useState<DiscoverItem | null>(null)

  useEffect(() => {
    discoverApi.getVideos().then(setVideos).catch(() => setVideos([]))
    discoverApi.getMusic().then(setMusic).catch(() => setMusic([]))
  }, [])

  const embedUrl = playing ? getYouTubeEmbedUrl(playing.watch_url) : null

  return (
    <div>
      <div className="home-hero">
        <h1>Vidio Music</h1>
        <p>Putar dan unduh video & musik langsung dari sumber aslinya.</p>
        <div className="home-links">
          <Link to="/videos" className="btn-primary">Video Saya</Link>
          <Link to="/music" className="btn-primary">Musik Saya</Link>
        </div>
      </div>

      {playing && embedUrl && (
        <div className="player-card discover-player">
          <div className="youtube-embed-wrap">
            <iframe
              src={embedUrl}
              title={playing.title}
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
            />
          </div>
          <div className="player-info">
            <h2>{playing.title}</h2>
            <p>{playing.channel_title}</p>
            <a className="btn-download" href={playing.watch_url} target="_blank" rel="noopener noreferrer">
              Buka di YouTube (unduh sendiri di sana)
            </a>
          </div>
        </div>
      )}

      {videos.length > 0 && (
        <section className="discover-section">
          <h2>Video Trending</h2>
          <div className="media-grid">
            {videos.map((v) => (
              <DiscoverCard key={v.youtube_id} item={v} onClick={setPlaying} />
            ))}
          </div>
        </section>
      )}

      {music.length > 0 && (
        <section className="discover-section">
          <h2>Musik Trending</h2>
          <div className="media-grid">
            {music.map((m) => (
              <DiscoverCard key={m.youtube_id} item={m} onClick={setPlaying} />
            ))}
          </div>
        </section>
      )}
    </div>
  )
}