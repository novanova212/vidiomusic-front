import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { discoverApi } from '../api/client'
import type { DiscoverItem } from '../types/media'
import DiscoverCard from '../components/DiscoverCard'
import { getYouTubeEmbedUrl } from '../utils/youtube'

export default function HomePage() {
  const [videos, setVideos] = useState<DiscoverItem[]>([])
  const [music, setMusic] = useState<DiscoverItem[]>([])
  const [playing, setPlaying] = useState<DiscoverItem | null>(null)
  const [loadingFeed, setLoadingFeed] = useState(false)

  useEffect(() => {
    discoverApi.getVideos().then(setVideos).catch(() => setVideos([]))
    discoverApi.getMusic().then(setMusic).catch(() => setMusic([]))
  }, [])

  async function refreshVideos() {
    setLoadingFeed(true)
    try {
      setVideos(await discoverApi.getVideos(true))
    } catch {
      // biarkan yang lama
    }
    setLoadingFeed(false)
  }

  const embedUrl = playing ? getYouTubeEmbedUrl(playing.watch_url) : null

  return (
    <div>
      <div className="home-hero">
        <h1>Vidio Music</h1>
        <p>Putar video & musik dari YouTube.</p>
        <div className="home-links">
          <Link to="/videos" className="btn-primary">Jelajahi Video</Link>
          <Link to="/music" className="btn-primary">Jelajahi Musik</Link>
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
              referrerPolicy="strict-origin-when-cross-origin"
            />
          </div>
          <div className="player-info">
            <h2>{playing.title}</h2>
            <p>{playing.channel_title}</p>
          </div>
        </div>
      )}

      <section className="discover-section">
        <div className="section-head">
          <h2>Video Trending</h2>
          <button type="button" className="btn-back" onClick={refreshVideos} disabled={loadingFeed}>
            {loadingFeed ? 'Mengganti...' : 'Ganti video'}
          </button>
        </div>
        <div className="media-grid">
          {videos.map((v) => (
            <DiscoverCard key={v.youtube_id} item={v} onClick={setPlaying} />
          ))}
        </div>
      </section>

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