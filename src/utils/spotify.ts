export type SpotifyKind = 'track' | 'album' | 'playlist' | 'episode' | 'show'

export function parseSpotify(url: string | null | undefined): { kind: SpotifyKind; id: string } | null {
  if (!url) return null
  const uri = url.match(/^spotify:(track|album|playlist|episode|show):([A-Za-z0-9]+)/)
  if (uri) return { kind: uri[1] as SpotifyKind, id: uri[2] }
  const web = url.match(/open\.spotify\.com\/(?:intl-[a-z]+\/)?(track|album|playlist|episode|show)\/([A-Za-z0-9]+)/)
  if (web) return { kind: web[1] as SpotifyKind, id: web[2] }
  return null
}

export function isSpotifyUrl(url: string | null | undefined) {
  return parseSpotify(url) !== null
}

export function getSpotifyEmbedUrl(url: string): string | null {
  const parsed = parseSpotify(url)
  if (!parsed) return null
  return `https://open.spotify.com/embed/${parsed.kind}/${parsed.id}?utm_source=generator`
}
