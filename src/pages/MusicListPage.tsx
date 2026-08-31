import { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import { mediaApi } from '../api/client'
import type { Song } from '../types/media'
import AudioPlayer from '../components/AudioPlayer'
import EngagementBar from '../components/EngagementBar'
import CommentSection from '../components/CommentSection'

export default function MusicDetailPage() {
  const { slug } = useParams<{ slug: string }>()
  const [song, setSong] = useState<Song | null>(null)

  useEffect(() => {
    if (slug) mediaApi.getSong(slug).then(setSong).catch(() => setSong(null))
  }, [slug])

  if (!song || !slug) return <p>Memuat musik...</p>

  return (
    <div>
      <AudioPlayer song={song} />
      <EngagementBar
        type="song"
        targetKey={slug}
        initialViews={song.views ?? song.plays}
        initialLikes={song.likes}
        initialDislikes={song.dislikes}
      />
      <CommentSection type="song" targetKey={slug} />
    </div>
  )
}
