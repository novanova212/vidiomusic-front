import { FormEvent, useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { discoverApi, mediaApi } from '../api/client'
import type { DiscoverItem, Song } from '../types/media'
import BackButton from '../components/BackButton'

function trackHref(item: DiscoverItem) {
  const params = new URLSearchParams({
    title: item.title,
    artist: item.channel_title,
    cover: item.thumbnail_url || '',
  })
  return `/listen/${item.youtube_id}?${params.toString()}`
}

export default function MusicListPage() {
  const [uploaded, setUploaded] = useState<Song[]>([])
  const [q, setQ] = useState('')
  const [results, setResults] = useState<DiscoverItem[] | null>(null)
  const [searching, setSearching] = useState(false)
  const [searchError, setSearchError] = useState('')
  const [forYou, setForYou] = useState<DiscoverItem[]>([])
  const [loadingForYou, setLoadingForYou] = useState(true)

  useEffect(() => {
    mediaApi.getSongs().then((res) => setUploaded(res.data)).catch(() => setUploaded([]))
    loadForYou()
  }, [])

  function loadForYou(refresh = false) {
    setLoadingForYou(true)
    discoverApi.getMusic({ refresh }).then((data) => {
      if (Array.isArray(data)) setForYou(data)
    }).catch(() => {}).finally(() => setLoadingForYou(false))
  }

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
    try {
      const data = await discoverApi.getMusic({ q: text })
      setResults(data)
      if (!data.length) setSearchError('Tidak ada hasil. Coba kata kunci lain.')
    } catch {
      setResults([])
      setSearchError('Gagal mencari musik. Coba lagi nanti.')
    }
    setSearching(false)
  }

  const list = results ?? forYou

  return (
    <div>
      <BackButton fallback="/" />
      <h1>Musik</h1>

      <form className="search-bar" onSubmit={onSearch}>
        <input
          value={q}
          onChange={(e) => setQ(e.target.value)}
          placeholder="Cari judul lagu atau nama artis..."
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

      {searchError && <p className="upload-error">{searchError}</p>}

      <div className="section-head">
        <h2>{results ? 'Hasil pencarian' : 'Untuk kamu'}</h2>
        {!results && (
          <button type="button" className="btn-back" onClick={() => loadForYou(true)}>
            Ganti lagu
          </button>
        )}
      </div>

      {!results && loadingForYou && <p className="upload-hint">Memuat rekomendasi musik...</p>}

      {!loadingForYou && list.length === 0 && !results && (
        <p className="upload-hint">
          Belum ada musik untuk ditampilkan. Pastikan <code>SPOTIFY_CLIENT_ID</code> dan{' '}
          <code>SPOTIFY_CLIENT_SECRET</code> sudah diisi di backend, lalu muat ulang halaman.
        </p>
      )}

      {list.length > 0 && (
        <div className="track-list">
          {list.map((item, i) => (
            <Link key={`${item.youtube_id}-${i}`} to={trackHref(item)} className="track-row">
              <span className="track-num">{i + 1}</span>
              {item.thumbnail_url ? (
                <img src={item.thumbnail_url} alt="" className="track-cover" />
              ) : (
                <div className="track-cover track-cover-placeholder" />
              )}
              <span className="track-meta">
                <strong className="track-title">{item.title}</strong>
                <span className="track-artist">{item.channel_title}</span>
              </span>
              <span className="track-play" aria-hidden="true">▶</span>
            </Link>
          ))}
        </div>
      )}

      {uploaded.length > 0 && (
        <>
          <h2 className="track-section-title">Lagu tambahan</h2>
          <div className="track-list">
            {uploaded.map((s, i) => (
              <Link key={s.id} to={`/music/${s.slug}`} className="track-row">
                <span className="track-num">{i + 1}</span>
                {s.cover_url ? (
                  <img src={s.cover_url} alt="" className="track-cover" />
                ) : (
                  <div className="track-cover track-cover-placeholder" />
                )}
                <span className="track-meta">
                  <strong className="track-title">{s.title}</strong>
                  <span className="track-artist">{s.artist || 'Musik'}</span>
                </span>
                <span className="track-play" aria-hidden="true">▶</span>
              </Link>
            ))}
          </div>
        </>
      )}
    </div>
  )
}