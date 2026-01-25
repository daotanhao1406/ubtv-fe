'use client'
import { useParams } from 'next/navigation'
import { useEffect, useMemo, useState } from 'react'

import VideoPlayer from '@/components/video-player'

import EpisodesList from '@/elements/movie/episodes-list'
import MovieEpisodeInformation from '@/elements/movie/movie-episode-information'
import { getMovie } from '@/services/movie.service'

import { MovieResponse } from '@/types/movie'

export default function MovieEpisodePage() {
  const params = useParams<{ slug: string; episode: string }>()
  const [movie, setMovie] = useState<MovieResponse>()

  const episodeSource = useMemo(() => {
    if (!Array.isArray(movie?.episodes)) return null
    if (typeof movie?.episodes?.[0] !== 'object') return null
    if (!Array.isArray(movie?.episodes?.[0]?.server_data)) return null

    const episode = movie?.episodes?.[0]?.server_data?.find((episode) => episode.slug === params.episode)

    if (!episode) return null

    return episode?.link_m3u8
  }, [movie, params.episode])

  useEffect(() => {
    const getMovieData = async () => {
      const movie = await getMovie(params.slug)
      setMovie(movie)
    }

    getMovieData()
  }, [params.slug])

  return (
    <div className='px-6'>
      <div className='h-20' />
      {/* <h1 className='text-2xl font-bold mb-4'>{movieData.name}</h1> */}
      <div className='mt-6'>
        <VideoPlayer src={episodeSource || ''} poster={movie?.movie?.thumb_url || ''} />
      </div>
      <div className='mt-6 grid grid-cols-3 gap-12'>
        <div className='col-span-2'>
          <MovieEpisodeInformation movie={movie?.movie} />
        </div>
        <div className='col-span-1'>
          <EpisodesList slug={params?.slug} episodes={movie?.episodes?.[0]?.server_data || []} />
        </div>
      </div>

      <div className='h-20' />
    </div>
  )
}
