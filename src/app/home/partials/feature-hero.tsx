'use client'

import Autoplay from 'embla-carousel-autoplay'
import { useRef } from 'react'

import { Carousel, CarouselContent, CarouselItem } from '@/components/ui/carousel'

import FeaturedHeroVideo from '@/app/home/components/feature-hero-video'
import { Movie } from '@/app/home/data/movieData'
interface FeatureHeroProps {
  movies: Movie[]
}

export function FeatureHero({ movies }: FeatureHeroProps) {
  const plugin = useRef(Autoplay({ playOnInit: true, delay: 12000 }))

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
            <CarouselItem key={movie.id}>
              <FeaturedHeroVideo key={index} movie={movie} />
            </CarouselItem>
          ))}
        </CarouselContent>
      </Carousel>
    </div>
  )
}
