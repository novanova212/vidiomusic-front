import { FormEvent, useEffect, useState } from 'react'
import { mediaApi } from '../api/client'
import { searchYouTube, type SearchVideo } from '../api/youtubeSearch'
import type { Video } from '../types/media'
import MediaCard from '../components/MediaCard'
import { pickRandomVideos, type FeaturedVideo } from '../data/featuredVideos'

export default function VideoListPage() {
  const [uploaded, setUploaded] = useState<Video[]>([])
  const [q, setQ] = useState('')
  const [results, setResults] = useState<SearchVideo[] | null>(null)
  const [searching, setSearching] = useState(false)
  const [searchError, setSearchError] = useState('')
  const [homeCards, setHomeCards] = useState<FeaturedVideo[]>(() => pickRandomVideos(12))

  useEffect(() => {
    mediaApi.getVideos().then((res) => setUploaded(res.data)).catch(() => setUploaded([]))
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

  function refreshFeed() {
    setHomeCards(pickRandomVideos(12))
  }

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
            <button type="button" className="btn-back" onClick={refreshFeed}>
              Ganti video
            </button>
          </div>
          <div className="media-grid">
            {homeCards.map((v) => (
              <MediaCard
                key={v.id}
                to={`/watch/${v.id}`}
                title={v.title}
                subtitle="YouTube"
                thumbnail={v.thumbnail_url}
                sourceUrl={v.source_url}
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