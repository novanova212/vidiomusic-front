import type { Video } from '../types/media'
import { getYouTubeEmbedUrl, isYouTubeUrl } from '../utils/youtube'

interface Props {
  video: Video
}

// Kalau source_url-nya link YouTube: tampilkan jendela pemutar YouTube
// resmi (embed) untuk nonton. Tombol download TIDAK mengunduh apa pun
// dari web kita — cuma mengarahkan ke halaman YouTube aslinya, supaya
// orang bisa mengunduh sendiri lewat caranya masing-masing (di luar
// tanggung jawab aplikasi ini).
//
// Kalau source_url-nya link file video langsung (.mp4 dsb): tampilkan
// pemutar <video> biasa, dan tombol download beneran mengunduh file asli.
export default function VideoPlayer({ video }: Props) {
  const youtube = isYouTubeUrl(video.source_url)
  const embedUrl = youtube ? getYouTubeEmbedUrl(video.source_url) : null

  return (
    <div className="player-card">
      {youtube && embedUrl ? (
        <div className="youtube-embed-wrap">
          <iframe
            src={embedUrl}
            title={video.title}
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
          />
        </div>
      ) : (
        <video
          controls
          preload="metadata"
          poster={video.thumbnail_url ?? undefined}
          style={{ width: '100%', borderRadius: 8, background: '#000' }}
        >
          <source src={video.stream_url} type={video.mime_type ?? undefined} />
          Browser Anda tidak mendukung tag video.
        </video>
      )}

      <div className="player-info">
        <h2>{video.title}</h2>
        {video.description && <p>{video.description}</p>}

        {youtube ? (
          <a className="btn-download" href={video.download_url} target="_blank" rel="noopener noreferrer">
            Buka di YouTube (unduh sendiri di sana)
          </a>
        ) : (
          <a className="btn-download" href={video.download_url} download>
            Unduh video (sumber asli)
          </a>
        )}
      </div>
    </div>
  )
}