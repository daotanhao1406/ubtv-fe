import type { MovieItem } from '@/types/movie'

export interface LibraryMovie {
  id: string
  title: string
  year: number
  genre: string
  imageUrl: string
}

export const watchedMovies: LibraryMovie[] = [
  {
    id: 'demon-slayer',
    title: 'Demon Slayer',
    year: 2019,
    genre: 'Adventure',
    imageUrl: 'https://cdn.myanimelist.net/images/anime/1286/99889.jpg',
  },
  {
    id: 'chainsaw-man',
    title: 'Chainsaw Man',
    year: 2022,
    genre: 'Fantasy',
    imageUrl: 'https://cdn.myanimelist.net/images/anime/1806/126216.jpg',
  },
  {
    id: 'jujutsu-kaisen',
    title: 'Jujutsu Kaisen',
    year: 2020,
    genre: 'Supernatural',
    imageUrl: 'https://cdn.myanimelist.net/images/anime/1171/109222.jpg',
  },
  {
    id: 'attack-on-titan',
    title: 'Attack on Titan',
    year: 2013,
    genre: 'Action',
    imageUrl: 'https://cdn.myanimelist.net/images/anime/10/47347.jpg',
  },
  {
    id: 'horimiya',
    title: 'Horimiya',
    year: 2021,
    genre: 'Romance',
    imageUrl: 'https://cdn.myanimelist.net/images/anime/1695/111486.jpg',
  },
  {
    id: 'call-of-the-night',
    title: 'Call of the Night',
    year: 2022,
    genre: 'Supernatural',
    imageUrl: 'https://cdn.myanimelist.net/images/anime/1045/123711.jpg',
  },
  {
    id: 'blue-lock',
    title: 'Blue Lock',
    year: 2022,
    genre: 'Sports',
    imageUrl: 'https://cdn.myanimelist.net/images/anime/1258/126929.jpg',
  },
  {
    id: 'darling-in-the-franxx',
    title: 'Darling in the Franxx',
    year: 2018,
    genre: 'Sci-Fi',
    imageUrl: 'https://cdn.myanimelist.net/images/anime/1614/90408.jpg',
  },
  {
    id: 'charlotte',
    title: 'Charlotte',
    year: 2015,
    genre: 'Supernatural',
    imageUrl: 'https://cdn.myanimelist.net/images/anime/1826/147276.jpg',
  },
  {
    id: 'tokyo-ghoul',
    title: 'Tokyo Ghoul',
    year: 2014,
    genre: 'Horror',
    imageUrl: 'https://cdn.myanimelist.net/images/anime/1498/134443.jpg',
  },
  {
    id: 'frieren',
    title: 'Frieren: Beyond Journey’s End',
    year: 2023,
    genre: 'Adventure',
    imageUrl: 'https://cdn.myanimelist.net/images/anime/1015/138006.jpg',
  },
  {
    id: 'spy-family',
    title: 'SPY x FAMILY',
    year: 2022,
    genre: 'Comedy',
    imageUrl: 'https://cdn.myanimelist.net/images/anime/1441/122795.jpg',
  },
]

const toMovieItem = (movie: LibraryMovie): MovieItem => ({
  _id: movie.id,
  name: movie.title,
  slug: movie.id,
  origin_name: movie.title,
  type: 'hoathinh',
  year: movie.year,
  sub_docquyen: false,
  chieurap: false,
  time: '24 phút/tập',
  episode_current: 'Full',
  quality: 'HD',
  lang: 'Vietsub',
  tmdb: { type: 'tv', id: movie.id, season: 1, vote_average: 8.5, vote_count: 1000 },
  imdb: { id: null },
  created: { time: '2024-01-01T00:00:00.000Z' },
  modified: { time: '2024-01-01T00:00:00.000Z' },
  poster_url: movie.imageUrl,
  thumb_url: movie.imageUrl,
  category: [{ id: movie.genre.toLowerCase(), name: movie.genre, slug: movie.genre.toLowerCase() }],
  country: [{ id: 'japan', name: 'Japan', slug: 'japan' }],
})

export const watchedMovieItems = watchedMovies.map(toMovieItem)

const favoriteMovieIds = new Set(['demon-slayer', 'chainsaw-man', 'jujutsu-kaisen', 'attack-on-titan', 'blue-lock', 'frieren'])

export const favoriteMovies = watchedMovies.filter((movie) => favoriteMovieIds.has(movie.id)).map(toMovieItem)
