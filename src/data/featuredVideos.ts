export type FeaturedVideo = {
  id: string
  title: string
  source_url: string
  thumbnail_url: string
}

const ids: [string, string][] = [
  ['Baby Shark', 'XqZsoesa55w'],
  ['Let It Go', 'L0MK7qz13bU'],
  ['Happy', 'ZbZSe6N_BXs'],
  ['What Does the Fox Say', 'jofNR_WkoCE'],
  ['Gangnam Style', '9bZkp7q19f0'],
  ['Never Gonna Give You Up', 'dQw4w9WgXcQ'],
  ['Shape of You', 'JGwWNGJdvx8'],
  ['Counting Stars', 'hT_nvWreIhg'],
  ['Uptown Funk', 'OPf0YbXqDm0'],
  ['See You Again', 'RgKAFK5djSk'],
  ['Shake It Off', 'nfWlot6h_JM'],
  ['Roar', 'CevxZvSJLk8'],
  ['Despacito', 'kJQP7kiw5Fk'],
  ['Perfect', '2Vv-BfVoq4g'],
  ['Bohemian Rhapsody', 'fJ9rUzIMcZQ'],
  ['Sugar', '09R8_2nJtjg'],
  ['Senorita', 'Pkh8UtuejGw'],
  ['Waka Waka', 'pRpeEdMmmQ0'],
  ['Thunder', 'fKopy74weus'],
  ['Believer', '7wtfhZwyrcc'],
  ['Something Just Like This', 'FM7MFYoylVs'],
  ['Faded', '60ItHLz5WEA'],
  ['Cheap Thrills', 'nYh-n7EOtMA'],
  ['Lean On', 'YqeW9_5kURI'],
  ['Hello', 'YQHsXMglC9A'],
  ['All of Me', '450p7goxZqg'],
  ['Photograph', 'nFfuSGE7t8I'],
  ['Thinking Out Loud', 'lp-EO5I60KA'],
  ['Love Story', '8xg3vE8Ie_E'],
  ['Blank Space', 'e-ORhEE9VVg'],
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