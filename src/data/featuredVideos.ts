export type FeaturedVideo = {
  id: string
  title: string
  source_url: string
  thumbnail_url: string
  views: number
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
]

export const featuredVideos: FeaturedVideo[] = ids.map(([title, id], i) => ({
  id: `yt-${id}`,
  title,
  source_url: `https://www.youtube.com/watch?v=${id}`,
  thumbnail_url: `https://img.youtube.com/vi/${id}/hqdefault.jpg`,
  views: 1000 + i * 17,
}))