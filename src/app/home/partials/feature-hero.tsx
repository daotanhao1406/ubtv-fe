'use client'

import Autoplay from 'embla-carousel-autoplay'
import { useRef } from 'react'

import { Carousel, CarouselContent, CarouselItem } from '@/components/ui/carousel'

import FeaturedHeroVideo from '@/app/home/components/feature-hero-video'

import { MovieItem } from '@/types/movie'
interface FeatureHeroProps {
  movies: MovieItem[]
  loading: boolean
}

export function FeatureHero({ movies, loading }: FeatureHeroProps) {
  const plugin = useRef(Autoplay({ playOnInit: true, delay: 12000 }))

  if (loading) {
    return <div className='h-[80vh] w-full bg-default-50' />
  }

  return (
    <div className='relative'>
      <Carousel
        plugins={[plugin.current]}
        className='w-full'
        opts={{
          align: 'start',
          loop: true,
        }}
      >
        <CarouselContent>
          {movies.map((movie, index) => (
            <CarouselItem key={movie._id}>
              <FeaturedHeroVideo key={index} movie={movie} />
            </CarouselItem>
          ))}
        </CarouselContent>
      </Carousel>
    </div>
  )
}
