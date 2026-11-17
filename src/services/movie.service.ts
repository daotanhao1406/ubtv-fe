import envVariables from '@/lib/env'

import type { MovieResponse } from '@/types/movie'

const getMovie = async (path: string): Promise<MovieResponse> => {
  const res = await fetch(`${envVariables.NEXT_PUBLIC_MOVIE_API}${path}`)
  if (!res.ok) throw new Error(`Unable to load movie (${res.status})`)
  return res.json()
}

export const getMovieBySlug = (slug: string) => getMovie(`/phim/${encodeURIComponent(slug)}`)

export const getMovieById = (id: string) => getMovie(`/phim/id/${encodeURIComponent(id)}`)
