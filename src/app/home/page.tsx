import { SiteFooter } from '@/components/layout/SiteFooter'
import SiteHeader from '@/components/layout/SiteHeader'

import { recommendedMovies } from '@/app/home/data/movieData'
import { FeatureHero } from '@/app/home/partials/feature-hero'
import { MovieSection } from '@/app/home/partials/movie-section'
export default async function HomePage() {
  return (
    <>
      <SiteHeader isHome />
      <FeatureHero movies={recommendedMovies} />
      <div className='relative z-10 -mt-48 pb-16'>
        <MovieSection title='Special For You' movies={recommendedMovies} />

        <MovieSection title='Trending Now' movies={recommendedMovies} className='mt-6' />
      </div>
      <SiteFooter />
    </>
  )
}
