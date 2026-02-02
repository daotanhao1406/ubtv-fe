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
      <div className='grid grid-cols-3 gap-12 px-6 pt-10'>
        <div className='col-span-2'>
          <EpisodesList slug={slug} episodes={movie?.episodes?.[0]?.server_data} />
        </div>
        <div className='col-span-1'>
          <MovieInformation movie={movie?.movie} />
        </div>
      </div>

      <div className='h-20' />
    </div>
  )
}
