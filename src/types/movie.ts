import { EpisodeReponse } from '@/types/episode'

export interface TmdbInfo {
  type: 'tv' | 'movie'
  id: string
  season: number
  vote_average: number
  vote_count: number
}

export interface ImdbInfo {
  id: string | null
}

export interface TimeInfo {
  time: string // ISO date string
}

export interface Category {
  id: string
  name: string
  slug: string
}

export interface Country {
  id: string
  name: string
  slug: string
}

export interface MovieItem {
  _id: string

  name: string
  slug: string
  origin_name: string

  type: string
  year: number

  content?: string

  director?: string[]
  actor?: string[]

  poster_url: string
  thumb_url: string

  sub_docquyen: boolean
  chieurap: boolean

  time: string // "24 phút/tập"
  episode_current: string
  quality: string // FHD, HD, ...
  lang: string // Vietsub, Thuyet Minh...

  tmdb: TmdbInfo
  imdb: ImdbInfo

  created: TimeInfo
  modified: TimeInfo

  category: Category[]
  country: Country[]
}

export interface MovieResponse {
  status: boolean
  msg: string
  movie: MovieItem
  episodes: EpisodeReponse[]
}
