'use client'
import { useEffect, useState } from 'react'

import { useRequest } from '@/hooks/useRequest'

import { SiteFooter } from '@/components/layout/SiteFooter'
import SiteHeader from '@/components/layout/SiteHeader'

import { FeatureHero } from '@/app/home/partials/feature-hero'
import { MovieSection } from '@/app/home/partials/movie-section'

import { MovieItem } from '@/types/movie'

export default function HomePage() {
  const { movieRequest } = useRequest()
  const [movies, setMovies] = useState<MovieItem[]>([])
  const [trendingMovies, setTrendingMovies] = useState<MovieItem[]>([])
  const [mostPopularMovies, setMostPopularMovies] = useState<MovieItem[]>([])
  const [loading, setLoading] = useState<boolean>(true)

  useEffect(() => {
    const fetchApi = async () => {
      setLoading(true)
      await movieRequest('/danh-sach/phim-moi-cap-nhat?page=1')
        .then((data) => {
          if (Array.isArray(data?.items)) {
            setMovies(data?.items)
          }
        })
        .finally(() => {
          setLoading(false)
        })
    }

    const fetchTrendingApi = async () => {
      setLoading(true)
      await movieRequest('/danh-sach/phim-moi-cap-nhat?page=2')
        .then((data) => {
          if (Array.isArray(data?.items)) {
            setTrendingMovies(data?.items)
          }
        })
        .finally(() => {
          setLoading(false)
        })
    }

    const fetchMostPopularApi = async () => {
      setLoading(true)
      await movieRequest('/danh-sach/phim-moi-cap-nhat-v2?page=2&limit=30')
        .then((data) => {
          if (Array.isArray(data?.items)) {
            setMostPopularMovies(data?.items)
          }
        })
        .finally(() => {
          setLoading(false)
        })
    }

    fetchApi()
    fetchTrendingApi()
    fetchMostPopularApi()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  return (
    <>
      <SiteHeader isHome />
      <FeatureHero movies={movies} loading={loading} />
      <div className='relative z-10 -mt-48 pb-16'>
        <MovieSection title='Special For You' movies={movies} loading={loading} isCarousel />

        <MovieSection title='Trending Now' className='mt-6' movies={trendingMovies} loading={loading} isCarousel />

        <MovieSection title='Most Popular' className='mt-6' movies={mostPopularMovies} loading={loading} />
      </div>
      <SiteFooter />
    </>
  )
}
