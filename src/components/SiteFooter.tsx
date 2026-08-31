import { Link } from 'react-router-dom'

export default function SiteFooter() {
  return (
    <footer className="site-footer">
      <div className="footer-inner">
        <div>
          <div className="logo footer-logo">
            <span className="logo-mark">VM</span>
            <span className="logo-text">Vidio Music</span>
          </div>
          <p>Putar video dan musik. Komentar, suka, dan jumlah ditonton tersimpan di akun pengunjung ini.</p>
        </div>
        <div className="footer-links">
          <Link to="/">Beranda</Link>
          <Link to="/videos">Video</Link>
          <Link to="/music">Musik</Link>
          <Link to="/upload">Tambah konten</Link>
        </div>
      </div>
      <p className="footer-copy">© {new Date().getFullYear()} Vidio Music</p>
    </footer>
  )
}
