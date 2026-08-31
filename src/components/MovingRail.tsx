import { useEffect, useRef } from 'react'
import type { DiscoverItem } from '../types/media'

interface Props {
  title: string
  items: DiscoverItem[]
  onSelect: (item: DiscoverItem) => void
}

export default function MovingRail({ title, items, onSelect }: Props) {
  const scroller = useRef<HTMLDivElement>(null)
  const paused = useRef(false)
  const loopItems = items.length ? [...items, ...items] : []

  useEffect(() => {
    const el = scroller.current
    if (!el || items.length === 0) return

    let frame = 0
    const tick = () => {
      if (!paused.current) {
        el.scrollLeft += 0.22
        const half = el.scrollWidth / 2
        if (half > 0 && el.scrollLeft >= half) el.scrollLeft -= half
      }
      frame = requestAnimationFrame(tick)
    }
    frame = requestAnimationFrame(tick)
    return () => cancelAnimationFrame(frame)
  }, [items])

  function nudge(dir: number) {
    const el = scroller.current
    if (!el) return
    paused.current = true
    el.scrollBy({ left: dir * 280, behavior: 'smooth' })
    window.setTimeout(() => {
      paused.current = false
    }, 1200)
  }

  return (
    <section className="rail-section">
      <div className="rail-head">
        <h2>{title}</h2>
        <div className="rail-nav">
          <button type="button" onClick={() => nudge(-1)} aria-label="Geser kiri">‹</button>
          <button type="button" onClick={() => nudge(1)} aria-label="Geser kanan">›</button>
        </div>
      </div>
      <div
        className="rail-scroller"
        ref={scroller}
        onMouseEnter={() => {
          paused.current = true
        }}
        onMouseLeave={() => {
          paused.current = false
        }}
        onPointerDown={() => {
          paused.current = true
        }}
        onPointerUp={() => {
          paused.current = false
        }}
        onWheel={() => {
          paused.current = true
        }}
      >
        {loopItems.map((item, i) => (
          <button
            type="button"
            className="rail-card"
            key={`${item.youtube_id}-${i}`}
            onClick={() => onSelect(item)}
          >
            {item.thumbnail_url ? (
              <img src={item.thumbnail_url} alt="" />
            ) : (
              <div className="media-card-placeholder" />
            )}
            <span className="rail-card-title">{item.title}</span>
            <span className="rail-card-sub">{item.channel_title}</span>
          </button>
        ))}
      </div>
    </section>
  )
}
