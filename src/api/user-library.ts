import http from '@/lib/http'

export interface UserLibraryPage {
  movieIds: string[]
  page: number
  pageSize: number
  total: number
  totalPages: number
}

export interface FavoriteMutationData {
  movieId: string
  isFavorite: boolean
}

const getPage = (list: 'favorites' | 'watched', page: number, pageSize: number) => http.auth.get<UserLibraryPage>(`/users/me/library/${list}?page=${page}&pageSize=${pageSize}`)

const getAllMovieIds = async (list: 'favorites' | 'watched') => {
  const pageSize = 100
  const firstPage = await getPage(list, 1, pageSize)
  const remainingPages = await Promise.all(Array.from({ length: Math.max(0, firstPage.data.totalPages - 1) }, (_, index) => getPage(list, index + 2, pageSize)))

  return [firstPage, ...remainingPages].flatMap(({ data }) => data.movieIds)
}

const userLibraryApi = {
  getFavorites: () => getAllMovieIds('favorites'),
  getWatched: () => getAllMovieIds('watched'),
  addFavorite: (movieId: string) => http.auth.post<FavoriteMutationData>('/users/me/library/favorites', { movieId }),
  removeFavorite: (movieId: string) => http.auth.delete<FavoriteMutationData>(`/users/me/library/favorites?movieId=${encodeURIComponent(movieId)}`),
}

export default userLibraryApi
