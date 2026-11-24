'use client'
import { addToast } from '@heroui/react'
import { useParams } from 'next/navigation'
import { useEffect, useMemo, useState } from 'react'

import VideoPlayer from '@/components/video-player'

import userLibraryApi from '@/api/user-library'
import EpisodesList from '@/elements/movie/episodes-list'
import MovieEpisodeInformation from '@/elements/movie/movie-episode-information'
import { useAuth } from '@/providers/AuthProvider'
import { getMovieBySlug } from '@/services/movie.service'

import { MovieResponse } from '@/types/movie'

export default function MovieEpisodePage() {
  const params = useParams<{ slug: string; episode: string }>()
  const { user } = useAuth()
  const [movie, setMovie] = useState<MovieResponse>()
  // Prevents recording watch history again after this movie episode was successfully recorded.
  const [recordedPlaybackKey, setRecordedPlaybackKey] = useState('')
  // Prevents duplicate watch-history requests while one for this movie episode is in flight.
  const [pendingPlaybackKey, setPendingPlaybackKey] = useState('')

  const episodeSource = useMemo(() => {
    if (!Array.isArray(movie?.episodes)) return null
    if (typeof movie?.episodes?.[0] !== 'object') return null
    if (!Array.isArray(movie?.episodes?.[0]?.server_data)) return null

    const episode = movie?.episodes?.[0]?.server_data?.find((episode) => episode.slug === params.episode)

    if (!episode) return null

    return episode?.link_m3u8
  }, [movie, params.episode])

  const handlePlaybackStarted = async () => {
    const movieId = movie?.movie?._id
    if (!user || !movieId) return

    const playbackKey = `${movieId}:${params.episode}`
    if (playbackKey === recordedPlaybackKey || playbackKey === pendingPlaybackKey) return

    setPendingPlaybackKey(playbackKey)
    try {
      await userLibraryApi.addWatched(movieId)
      setRecordedPlaybackKey(playbackKey)
    } catch (error) {
      addToast({
        title: 'Unable to update watch history',
        description: error instanceof Error ? error.message : 'Please try again.',
        color: 'danger',
      })
    } finally {
      setPendingPlaybackKey((currentKey) => (currentKey === playbackKey ? '' : currentKey))
    }
  }

  useEffect(() => {
    const getMovieData = async () => {
      const movie = await getMovieBySlug(params.slug)
      setMovie(movie)
    }

    getMovieData()
  }, [params.slug])

  return (
    <div className='px-4 md:px-6 max-w-[1560px] mx-auto'>
      <div className='h-20' />
      {/* <h1 className='text-2xl font-bold mb-4'>{movieData.name}</h1> */}
      <div className='mt-4 md:mt-6'>
        <VideoPlayer title={movie?.movie?.name || ''} src={episodeSource || ''} poster={movie?.movie?.thumb_url || ''} onPlaybackStarted={handlePlaybackStarted} />
      </div>
      <div className='mt-6 grid grid-cols-1 gap-6 lg:grid-cols-3 lg:gap-12'>
        <div className='order-2 min-w-0 lg:order-1 lg:col-span-2'>
          <MovieEpisodeInformation movie={movie?.movie} />
        </div>
        <div className='order-1 min-w-0 lg:order-2'>
          <EpisodesList selectedEpisodeSlug={params.episode} slug={params?.slug} episodes={movie?.episodes?.[0]?.server_data || []} />
        </div>
      </div>

      <div className='h-12 md:h-20' />
    </div>
  )
}
