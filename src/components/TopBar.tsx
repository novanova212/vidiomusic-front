import { FormEvent, useEffect, useRef, useState } from 'react'
import { Link, NavLink } from 'react-router-dom'
import { getGuestId, getSavedName, saveName } from '../api/client'

export default function TopBar() {
  const [open, setOpen] = useState(false)
  const [name, setName] = useState(getSavedName)
  const [draft, setDraft] = useState(name)
  const box = useRef<HTMLDivElement>(null)
  const guest = getGuestId()
  const shortId = guest.slice(0, 8)
  const initials = (name.trim() || 'Tamu').slice(0, 2).toUpperCase()

  useEffect(() => {
    function onDoc(e: MouseEvent) {
      if (box.current && !box.current.contains(e.target as Node)) setOpen(false)
    }
    document.addEventListener('mousedown', onDoc)
    return () => document.removeEventListener('mousedown', onDoc)
  }, [])

  function saveProfile(e: FormEvent) {
    e.preventDefault()
    const next = draft.trim().slice(0, 40)
    setName(next)
    saveName(next)
  }

  return (
    <header className="topbar">
      <Link to="/" className="logo" aria-label="Vidio Music">
        <span className="logo-mark">VM</span>
        <span className="logo-text">Vidio Music</span>
      </Link>

      <div className="topbar-right">
        <nav className="top-nav">
          <NavLink to="/" end>Beranda</NavLink>
          <NavLink to="/videos">Video</NavLink>
          <NavLink to="/music">Musik</NavLink>
          <NavLink to="/upload">Tambah konten</NavLink>
        </nav>

        <div className="user-menu" ref={box}>
          <button type="button" className="user-chip" onClick={() => setOpen((v) => !v)}>
            <span className="avatar">{initials}</span>
            <span className="user-chip-meta">
              <strong>{name.trim() || 'Tamu'}</strong>
              <small>Menu profil</small>
            </span>
          </button>

          {open && (
            <div className="user-dropdown">
              <p className="dropdown-label">Data pengguna</p>
              <div className="user-data">
                <span>Nama</span>
                <b>{name.trim() || 'Belum diisi'}</b>
                <span>ID</span>
                <b>{shortId}</b>
                <span>Status</span>
                <b>Pengunjung</b>
              </div>
              <form className="profile-edit" onSubmit={saveProfile}>
                <input
                  value={draft}
                  onChange={(e) => setDraft(e.target.value)}
                  placeholder="Ubah nama tampilan"
                  maxLength={40}
                />
                <button type="submit" className="btn-primary small">Simpan</button>
              </form>
            </div>
          )}
        </div>
      </div>
    </header>
  )
}
