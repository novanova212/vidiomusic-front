import { Route, Routes, useLocation } from 'react-router-dom'
import HomePage from './pages/HomePage'
import VideoListPage from './pages/VideoListPage'
import VideoDetailPage from './pages/VideoDetailPage'
import MusicListPage from './pages/MusicListPage'
import MusicDetailPage from './pages/MusicDetailPage'
import UploadPage from './pages/UploadPage'
import WatchPage from './pages/WatchPage'
import ListenPage from './pages/ListenPage'
import TopBar from './components/TopBar'
import SiteFooter from './components/SiteFooter'
import './styles/index.css'

export default function App() {
  const location = useLocation()

  return (
    <div className="app-shell">
      <TopBar />
      <main className="content">
        <div key={location.pathname} className="page-fade">
          <Routes location={location}>
            <Route path="/" element={<HomePage />} />
            <Route path="/videos" element={<VideoListPage />} />
            <Route path="/videos/:slug" element={<VideoDetailPage />} />
            <Route path="/music" element={<MusicListPage />} />
            <Route path="/music/:slug" element={<MusicDetailPage />} />
            <Route path="/upload" element={<UploadPage />} />
            <Route path="/watch/:id" element={<WatchPage />} />
            <Route path="/listen/:id" element={<ListenPage />} />
          </Routes>
        </div>
      </main>
      <SiteFooter />
    </div>
  )
}