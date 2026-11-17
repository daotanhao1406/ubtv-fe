import { getAuthSession } from '@/lib/auth-session'
import http, { HttpError } from '@/lib/http'

export interface UserLibraryPage {
  movieIds: string[]
  page: number
  pageSize: number
  total: number
  totalPages: number
}

const getPage = async (list: 'favorites' | 'watched', page: number, pageSize: number) => {
  const path = `/users/me/library/${list}?page=${page}&pageSize=${pageSize}`
  const session = getAuthSession()

  try {
    return await http.get<UserLibraryPage>(path)
  } catch (error) {
    if (!(error instanceof HttpError) || error.status !== 401) throw error
    await session.refresh()
    return http.get<UserLibraryPage>(path)
  }
}

const getAllMovieIds = async (list: 'favorites' | 'watched') => {
  const pageSize = 100
  const firstPage = await getPage(list, 1, pageSize)
  const remainingPages = await Promise.all(Array.from({ length: Math.max(0, firstPage.data.totalPages - 1) }, (_, index) => getPage(list, index + 2, pageSize)))

  return [firstPage, ...remainingPages].flatMap(({ data }) => data.movieIds)
}

const userLibraryApi = {
  getFavorites: () => getAllMovieIds('favorites'),
  getWatched: () => getAllMovieIds('watched'),
}

export default userLibraryApi
