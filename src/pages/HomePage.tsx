import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { discoverApi } from '../api/client'
import type { DiscoverItem } from '../types/media'
import DiscoverCard from '../components/DiscoverCard'
import { getYouTubeEmbedUrl } from '../utils/youtube'
import { pickRandomVideos } from '../data/featuredVideos'
import EngagementBar from '../components/EngagementBar'
import CommentSection from '../components/CommentSection'

function toDiscover(items: ReturnType<typeof pickRandomVideos>): DiscoverItem[] {
  return items.map((v) => ({
    youtube_id: v.id.replace(/^yt-/, ''),
    title: v.title,
    channel_title: 'YouTube',
    thumbnail_url: v.thumbnail_url,
    watch_url: v.source_url,
  }))
}

export default function HomePage() {
  const [videos, setVideos] = useState<DiscoverItem[]>(() => toDiscover(pickRandomVideos(12)))
  const [music, setMusic] = useState<DiscoverItem[]>([])
  const [playing, setPlaying] = useState<DiscoverItem | null>(null)

  useEffect(() => {
    discoverApi.getVideos().then((data) => {
      if (Array.isArray(data) && data.length) setVideos(data)
    }).catch(() => {})
    discoverApi.getMusic().then(setMusic).catch(() => setMusic([]))
  }, [])

  function refreshVideos() {
    setVideos(toDiscover(pickRandomVideos(12)))
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
          <EngagementBar type="youtube" targetKey={playing.youtube_id} recordView />
          <CommentSection type="youtube" targetKey={playing.youtube_id} />
        </div>
      )}

      <section className="discover-section">
        <div className="section-head">
          <h2>Video Trending</h2>
          <button type="button" className="btn-back" onClick={refreshVideos}>
            Ganti video
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