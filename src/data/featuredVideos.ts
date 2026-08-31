export type FeaturedVideo = {
  id: string
  title: string
  source_url: string
  thumbnail_url: string
}

const ids: [string, string][] = [
  ['Faded', '60ItHLz5WEA'],
  ['Wake Me Up', 'IcrbM1l_BoI'],
  ['The Nights', 'UtF6Jej8yb4'],
  ['Levels', '_ovdm2yX4MA'],
  ['Animals', 'gCYcHz2k5x0'],
  ['Lean On', 'YqeW9_5kURI'],
  ['Summer', 'ebXbLfLACGM'],
  ['Alone', 'ptnYBctoexk'],
  ['Happier', 'm7Bc3pLyij0'],
  ['Closer', 'PT2_F-1esPk'],
  ['Something Just Like This', 'FM7MFYoylVs'],
  ['Believer', '7wtfhZwyrcc'],
  ['Thunder', 'fKopy74weus'],
  ['Counting Stars', 'hT_nvWreIhg'],
  ['Shape of You', 'JGwWNGJdvx8'],
  ['See You Again', 'RgKAFK5djSk'],
  ['Perfect', '2Vv-BfVoq4g'],
  ['Bohemian Rhapsody', 'fJ9rUzIMcZQ'],
  ['Senorita', 'Pkh8UtuejGw'],
  ['Blank Space', 'e-ORhEE9VVg'],
  ['JavaScript in 100 Seconds', 'DHjqpvDnNGE'],
  ['Python in 100 Seconds', 'x7X9w_GIm1s'],
]

export const featuredVideos: FeaturedVideo[] = ids.map(([title, id]) => ({
  id: `yt-${id}`,
  title,
  source_url: `https://www.youtube.com/watch?v=${id}`,
  thumbnail_url: `https://img.youtube.com/vi/${id}/hqdefault.jpg`,
}))

export function pickRandomVideos(count = 12): FeaturedVideo[] {
  const copy = [...featuredVideos]
  for (let i = copy.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1))
    const tmp = copy[i]
    copy[i] = copy[j]
    copy[j] = tmp
  }
  return copy.slice(0, count)
}
