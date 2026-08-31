import { FormEvent, useEffect, useState } from 'react'
import { discoverApi, mediaApi } from '../api/client'
import { searchYouTube, type SearchVideo } from '../api/youtubeSearch'
import type { DiscoverItem, Video } from '../types/media'
import MediaCard from '../components/MediaCard'
import { featuredVideos } from '../data/featuredVideos'

type Card = {
  key: string
  to: string
  title: string
  subtitle: string
  thumbnail: string | null
  sourceUrl: string
}

function cardsFromFeed(items: DiscoverItem[]): Card[] {
  return items.map((v) => ({
    key: v.youtube_id,
    to: `/watch/yt-${v.youtube_id}?title=${encodeURIComponent(v.title)}`,
    title: v.title,
    subtitle: v.channel_title || 'YouTube',
    thumbnail: v.thumbnail_url,
    sourceUrl: v.watch_url,
  }))
}

function cardsFromFeatured(): Card[] {
  return featuredVideos.map((v) => ({
    key: v.id,
    to: `/watch/${v.id}`,
    title: v.title,
    subtitle: 'YouTube',
    thumbnail: v.thumbnail_url,
    sourceUrl: v.source_url,
  }))
}

export default function VideoListPage() {
  const [uploaded, setUploaded] = useState<Video[]>([])
  const [q, setQ] = useState('')
  const [results, setResults] = useState<SearchVideo[] | null>(null)
  const [searching, setSearching] = useState(false)
  const [searchError, setSearchError] = useState('')
  const [feed, setFeed] = useState<DiscoverItem[]>([])
  const [refreshing, setRefreshing] = useState(false)

  useEffect(() => {
    mediaApi.getVideos().then((res) => setUploaded(res.data)).catch(() => setUploaded([]))
    discoverApi.getVideos().then(setFeed).catch(() => setFeed([]))
  }, [])

  async function onSearch(e: FormEvent) {
    e.preventDefault()
    const text = q.trim()
    if (!text) {
      setResults(null)
      setSearchError('')
      return
    }
    setSearching(true)
    setSearchError('')
    const found = await searchYouTube(text)
    setResults(found)
    if (!found.length) setSearchError('Tidak ada hasil. Coba kata lain.')
    setSearching(false)
  }

  async function refreshFeed() {
    setRefreshing(true)
    try {
      setFeed(await discoverApi.getVideos(true))
    } catch {
      // biarkan
    }
    setRefreshing(false)
  }

  const homeCards = feed.length ? cardsFromFeed(feed) : cardsFromFeatured()

  return (
    <div>
      <h1>Video</h1>

      <form className="search-bar" onSubmit={onSearch}>
        <input
          value={q}
          onChange={(e) => setQ(e.target.value)}
          placeholder="Cari video atau nama akun YouTube..."
        />
        <button type="submit" className="btn-primary" disabled={searching}>
          {searching ? 'Mencari...' : 'Cari'}
        </button>
        {results && (
          <button
            type="button"
            className="btn-back"
            onClick={() => {
              setResults(null)
              setQ('')
              setSearchError('')
            }}
          >
            Beranda
          </button>
        )}
      </form>

      {searchError && <p>{searchError}</p>}

      {results ? (
        <>
          <h2>Hasil pencarian</h2>
          <div className="media-grid">
            {results.map((v) => (
              <MediaCard
                key={v.id}
                to={`/watch/${v.id}?title=${encodeURIComponent(v.title)}`}
                title={v.title}
                subtitle="YouTube"
                thumbnail={v.thumbnail_url}
                sourceUrl={v.source_url}
              />
            ))}
          </div>
        </>
      ) : (
        <>
          <div className="section-head">
            <h2>Untuk kamu</h2>
            <button type="button" className="btn-back" onClick={refreshFeed} disabled={refreshing}>
              {refreshing ? 'Mengganti...' : 'Ganti video'}
            </button>
          </div>
          <div className="media-grid">
            {homeCards.map((v) => (
              <MediaCard
                key={v.key}
                to={v.to}
                title={v.title}
                subtitle={v.subtitle}
                thumbnail={v.thumbnail}
                sourceUrl={v.sourceUrl}
              />
            ))}
          </div>

          {uploaded.length > 0 && (
            <>
              <h2>Upload kamu</h2>
              <div className="media-grid">
                {uploaded.map((v) => (
                  <MediaCard
                    key={v.id}
                    to={`/videos/${v.slug}`}
                    title={v.title}
                    subtitle={`${v.views} kali ditonton`}
                    thumbnail={v.thumbnail_url}
                    sourceUrl={v.source_url}
                  />
                ))}
              </div>
            </>
          )}
        </>
      )}
    </div>
  )
}