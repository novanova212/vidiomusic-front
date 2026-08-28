import type { DiscoverItem } from '../types/media'

interface Props {
  item: DiscoverItem
  onClick: (item: DiscoverItem) => void
}

// Kartu untuk video/musik yang diambil OTOMATIS dari YouTube (bukan
// dari database kita). Klik kartu ini akan memutar video-nya inline
// di halaman yang sama (lihat HomePage.tsx).
export default function DiscoverCard({ item, onClick }: Props) {
  return (
    <button type="button" className="media-card discover-card" onClick={() => onClick(item)}>
      {item.thumbnail_url ? (
        <img src={item.thumbnail_url} alt={item.title} />
      ) : (
        <div className="media-card-placeholder" />
      )}
      <h3>{item.title}</h3>
      <p>{item.channel_title}</p>
    </button>
  )
}