import { useState, FormEvent } from 'react'
import { addSong, addVideo } from '../api/client'
import BackButton from '../components/BackButton'

// Halaman "Tambah Video/Musik" TANPA UPLOAD FILE. Kamu cukup tempel LINK
// ke video/musik yang sudah ada di tempat lain (misal: file di Google
// Drive yang sudah di-share publik, hosting sendiri, atau CDN). Server
// kita tidak pernah menyimpan file aslinya — jadi tidak berat.
export default function UploadPage() {
  const [type, setType] = useState<'video' | 'song'>('video')
  const [title, setTitle] = useState('')
  const [extra, setExtra] = useState('') // description (video) atau artist (musik)
  const [sourceUrl, setSourceUrl] = useState('')
  const [imageUrl, setImageUrl] = useState('') // thumbnail (video) atau cover (musik), opsional
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle')
  const [errorMsg, setErrorMsg] = useState('')

  async function handleSubmit(e: FormEvent) {
    e.preventDefault()
    setStatus('loading')
    setErrorMsg('')

    try {
      if (type === 'video') {
        await addVideo({ title, description: extra, source_url: sourceUrl, thumbnail_url: imageUrl || undefined })
      } else {
        await addSong({ title, artist: extra, source_url: sourceUrl, cover_url: imageUrl || undefined })
      }
      setStatus('success')
      setTitle('')
      setExtra('')
      setSourceUrl('')
      setImageUrl('')
    } catch (err: any) {
      setStatus('error')
      setErrorMsg(err?.response?.data?.message || 'Gagal menambahkan. Pastikan link video/musiknya benar dan bisa diakses publik.')
    }
  }

  return (
    <div className="player-card">
      <BackButton fallback="/" />
      <h1>Tambah {type === 'video' ? 'Video' : 'Musik'}</h1>
      <p className="upload-hint">
        Tempel link ke video/musik yang sudah ada di tempat lain (Google Drive
        yang di-share publik, hosting sendiri, dsb). Tidak perlu upload file.
      </p>

      <div className="upload-type-switch">
        <button
          type="button"
          className={type === 'video' ? 'btn-primary' : 'btn-download small'}
          onClick={() => setType('video')}
        >
          Video
        </button>
        <button
          type="button"
          className={type === 'song' ? 'btn-primary' : 'btn-download small'}
          onClick={() => setType('song')}
        >
          Musik
        </button>
      </div>

      <form onSubmit={handleSubmit} className="upload-form">
        <label>
          Judul
          <input value={title} onChange={(e) => setTitle(e.target.value)} required />
        </label>

        <label>
          {type === 'video' ? 'Deskripsi (opsional)' : 'Artis (opsional)'}
          <input value={extra} onChange={(e) => setExtra(e.target.value)} />
        </label>

        <label>
          Link {type === 'video' ? 'video' : 'musik'} (source URL)
          <input
            type="url"
            placeholder={type === 'song' ? 'https://open.spotify.com/track/...' : 'https://...'}
            value={sourceUrl}
            onChange={(e) => setSourceUrl(e.target.value)}
            required
          />
        </label>

        <label>
          Link {type === 'video' ? 'thumbnail' : 'cover'} (opsional)
          <input
            type="url"
            placeholder="https://..."
            value={imageUrl}
            onChange={(e) => setImageUrl(e.target.value)}
          />
        </label>

        <button type="submit" className="btn-primary" disabled={status === 'loading'}>
          {status === 'loading' ? 'Menyimpan...' : 'Tambahkan'}
        </button>

        {status === 'success' && <p className="upload-success">Berhasil ditambahkan!</p>}
        {status === 'error' && <p className="upload-error">{errorMsg}</p>}
      </form>
    </div>
  )
}