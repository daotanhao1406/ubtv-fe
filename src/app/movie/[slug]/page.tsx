import EpisodesList from '@/elements/movie/episodes-list'
import MovieHero from '@/elements/movie/movie-hero'
import MovieInformation from '@/elements/movie/movie-information'
import { getMovie } from '@/services/movie.service'

export default async function MovieDetailsPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params

  const movie = await getMovie(slug)

  return (
    <div className='relative font-manrope'>
      <MovieHero movie={movie?.movie} />
      <div className='grid grid-cols-1 gap-6 px-4 pt-6 md:px-6 md:pt-10 lg:grid-cols-3 lg:gap-12'>
        <div className='min-w-0 lg:col-span-2'>
          <EpisodesList slug={slug} episodes={movie?.episodes?.[0]?.server_data} />
        </div>
        <div className='min-w-0'>
          <MovieInformation movie={movie?.movie} />
        </div>
      </div>

      <div className='h-12 md:h-20' />
    </div>
  )
}
