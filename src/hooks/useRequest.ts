import axios, { AxiosInstance, AxiosRequestConfig } from 'axios'

const movieApi = process.env.NEXT_PUBLIC_MOVIE_API

export const useRequest = () => {
  const movieRequest = async (url: string, config?: Omit<AxiosRequestConfig, 'signal'>) => {
    const req: AxiosInstance = axios.create({
      baseURL: movieApi,
      timeout: 120000,
      method: 'get',
    })
    return req(url, config)
      .then((res) => {
        return res.data
      })
      .catch((error) => {
        return Promise.reject(error)
      })
  }
  return { movieRequest }
}
