import type { Song } from '../types/media'
import { getSpotifyEmbedUrl, isSpotifyUrl, parseSpotify } from '../utils/spotify'

interface Props {
  song: Song
}

export default function AudioPlayer({ song }: Props) {
  const spotify = isSpotifyUrl(song.source_url)
  const embed = spotify ? getSpotifyEmbedUrl(song.source_url) : null
  const kind = parseSpotify(song.source_url)?.kind
  const tall = kind === 'album' || kind === 'playlist' || kind === 'show'

  return (
    <div className="player-card">
      {song.cover_url && !spotify && (
        <img src={song.cover_url} alt={song.title} className="cover-art" />
      )}

      {embed ? (
        <iframe
          className={tall ? 'spotify-embed tall' : 'spotify-embed'}
          src={embed}
          title={song.title}
          allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture"
          loading="lazy"
        />
      ) : (
        <audio controls preload="metadata" style={{ width: '100%' }}>
          <source src={song.stream_url || song.source_url} type={song.mime_type ?? undefined} />
          Browser Anda tidak mendukung tag audio.
        </audio>
      )}

      <div className="player-info">
        <h2>{song.title}</h2>
        {song.artist && <p>{song.artist}{song.album ? ` — ${song.album}` : ''}</p>}
        {spotify ? (
          <a className="btn-download" href={song.source_url} target="_blank" rel="noreferrer">
            Buka di Spotify
          </a>
        ) : (
          <a className="btn-download" href={song.download_url} download>
            Unduh musik (sumber asli)
          </a>
        )}
      </div>
    </div>
  )
}
