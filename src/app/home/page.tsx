'use client'

import { SiteFooter } from '@/components/layout/SiteFooter'
import SiteHeader from '@/components/layout/SiteHeader'

import { recommendedMovies, trendingMovies } from '@/app/home/data'
import { FeaturedHero } from '@/app/home/feature-hero'
import { MovieSection } from '@/app/home/movie-section'
export default function HomePage() {
  return (
    <>
      <SiteHeader isHome />
      <FeaturedHero title='Demon Slayer' description="Ever since the death of his father, the burden of supporting the family has fallen upon Tanjirou Kamado's shoulders" />
      <div className='relative z-10 -mt-48 pb-16'>
        <MovieSection title='Special For You' movies={recommendedMovies} />

        <MovieSection title='Trending Now' movies={trendingMovies} className='mt-6' />
      </div>
      <SiteFooter />
    </>
  )
}
