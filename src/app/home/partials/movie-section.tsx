'use client'

import { cn } from '@/lib/utils'

import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from '@/components/ui/carousel'

import { MovieCard } from '@/app/home/components/movie-card'

interface MovieSectionProps {
  title: string
  movies: any[]
  className?: string
}

export function MovieSection({ title, movies, className }: MovieSectionProps) {
  return (
    <div className={cn('py-8', className)}>
      <div className='px-4 md:px-6'>
        <h2 className='mb-6 text-xl font-bold tracking-tight md:text-3xl'>{title}</h2>

        <Carousel
          opts={{
            align: 'start',
            loop: true,
          }}
          className='w-full'
        >
          <CarouselContent className='-ml-2 md:-ml-4'>
            {movies.map((movie) => (
              <CarouselItem key={movie.id} className='pl-2 md:pl-4 basis-1/2 md:basis-1/4 lg:basis-1/6 xl:basis-[12.5%] 2xl:basis-[11.1%] min-[2560px]:basis-1/12'>
                <MovieCard title={movie.title} year={movie.year} genre={movie.genre} imageUrl={movie.imageUrl} videoUrl={movie.videoUrl} rating={movie.rating} />
              </CarouselItem>
            ))}
          </CarouselContent>
          <CarouselPrevious className='-left-4' />
          <CarouselNext className='-right-4' />
        </Carousel>
      </div>
    </div>
  )
}
