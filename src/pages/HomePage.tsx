import { useEffect, useRef, useState } from 'react'
import { Link } from 'react-router-dom'
import { discoverApi, mediaApi } from '../api/client'
import type { DiscoverItem } from '../types/media'
import { getYouTubeEmbedUrl } from '../utils/youtube'
import { getSpotifyEmbedUrl, isSpotifyUrl } from '../utils/spotify'
import { pickRandomVideos } from '../data/featuredVideos'
import EngagementBar from '../components/EngagementBar'
import CommentSection from '../components/CommentSection'
import MovingRail from '../components/MovingRail'
import ActivityHistory from '../components/ActivityHistory'

function toDiscover(items: ReturnType<typeof pickRandomVideos>, label = 'YouTube'): DiscoverItem[] {
  return items.map((v) => ({
    youtube_id: v.id.replace(/^yt-/, ''),
    title: v.title,
    channel_title: label,
    thumbnail_url: v.thumbnail_url,
    watch_url: v.source_url,
  }))
}

export default function HomePage() {
  const [videos, setVideos] = useState<DiscoverItem[]>(() => toDiscover(pickRandomVideos(12), 'Video'))
  // "Musik berjalan" sekarang murni musik (Spotify), bukan video YouTube lagi.
  // Kosong dulu sampai data asli datang dari backend, biar tidak salah nampilin video.
  const [music, setMusic] = useState<DiscoverItem[]>([])
  const [playing, setPlaying] = useState<DiscoverItem | null>(null)
  const playerRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (playing) playerRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' })
  }, [playing])

  // Tutup pemutar dengan tombol Escape supaya makin mudah keluar.
  useEffect(() => {
    if (!playing) return
    function onKey(e: KeyboardEvent) {
      if (e.key === 'Escape') setPlaying(null)
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [playing])

  useEffect(() => {
    discoverApi.getVideos().then((data) => {
      if (Array.isArray(data) && data.length) setVideos(data)
    }).catch(() => {})

    // Sumber utama: lagu asli dari Spotify (lewat backend, tanpa nyimpen
    // file apa pun secara lokal — cuma metadata + embed, sama seperti
    // video YouTube di atas).
    discoverApi.getMusic().then((data) => {
      if (Array.isArray(data) && data.length) {
        setMusic(data)
        return
      }
      // Kalau Spotify belum dikonfigurasi di backend (SPOTIFY_CLIENT_ID/SECRET
      // kosong), fallback ke lagu yang sudah ditambahkan lewat halaman
      // "Tambah konten" (kalau linknya Spotify) — tetap musik asli, bukan video.
      mediaApi.getSongs().then((res) => {
        const fallback: DiscoverItem[] = res.data
          .filter((s) => isSpotifyUrl(s.source_url))
          .map((s) => ({
            youtube_id: s.slug,
            title: s.title,
            channel_title: s.artist || 'Musik',
            thumbnail_url: s.cover_url,
            watch_url: s.source_url,
          }))
        if (fallback.length) setMusic(fallback)
      }).catch(() => {})
    }).catch(() => {})
  }, [])

  const isMusic = playing ? isSpotifyUrl(playing.watch_url) : false
  const youtubeEmbedUrl = playing && !isMusic ? getYouTubeEmbedUrl(playing.watch_url) : null
  const spotifyEmbedUrl = playing && isMusic ? getSpotifyEmbedUrl(playing.watch_url) : null
  const embedType = playing ? (isMusic ? 'spotify' : 'youtube') : null

  return (
    <div className="home-page">
      {playing && (youtubeEmbedUrl || spotifyEmbedUrl) && (
        <div className="player-card discover-player player-enter" ref={playerRef}>
          <div className="player-close-bar">
            <button type="button" className="btn-back" onClick={() => setPlaying(null)}>
              ← Kembali
            </button>
            <button
              type="button"
              className="player-close-btn"
              onClick={() => setPlaying(null)}
              aria-label="Tutup pemutar"
              title="Tutup pemutar"
            >
              ✕
            </button>
          </div>

          {spotifyEmbedUrl ? (
            <iframe
              className="spotify-embed"
              src={spotifyEmbedUrl}
              title={playing.title}
              allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture"
              loading="lazy"
            />
          ) : (
            <div className="youtube-embed-wrap">
              <iframe
                src={youtubeEmbedUrl ?? undefined}
                title={playing.title}
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
                referrerPolicy="strict-origin-when-cross-origin"
              />
            </div>
          )}

          <div className="player-info">
            <h2>{playing.title}</h2>
            <p>{playing.channel_title}</p>
          </div>
          <EngagementBar type={embedType!} targetKey={playing.youtube_id} title={playing.title} recordView />
          <CommentSection type={embedType!} targetKey={playing.youtube_id} title={playing.title} />
        </div>
      )}

      <MovingRail title="Video berjalan" items={videos} onSelect={setPlaying} />
      <MovingRail title="Musik berjalan" items={music} onSelect={setPlaying} />

      <section className="page-switch">
        <Link to="/videos" className="switch-card video">
          <span>Masuk halaman</span>
          <strong>Video <span className="switch-arrow">→</span></strong>
          <em>Cari dan tonton koleksi video</em>
        </Link>
        <Link to="/music" className="switch-card music">
          <span>Masuk halaman</span>
          <strong>Musik <span className="switch-arrow">→</span></strong>
          <em>Putar lagu dan daftar musik</em>
        </Link>
      </section>

      <ActivityHistory />
    </div>
  )
}