import { Card, Skeleton } from '@heroui/react'
import Link from 'next/link'
import { useCallback } from 'react'

import { cn } from '@/lib/utils'

import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from '@/components/ui/carousel'

import { MovieCard } from '@/app/home/components/movie-card'

import { MovieItem } from '@/types/movie'

interface MovieSectionProps {
  title: string
  movies: MovieItem[]
  loading?: boolean
  className?: string
  isCarousel?: boolean
}

export function MovieSection({ title, movies, loading, className, isCarousel }: MovieSectionProps) {
  const renderListMovies = useCallback(() => {
    if (loading) {
      return (
        <div className='grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 xl:grid-cols-8 2xl:grid-cols-9 gap-4'>
          {Array.from({ length: 6 }).map((_, idx) => (
            <Card className='h-[225px] w-full p-4' key={idx}>
              <Skeleton className='rounded-lg'>
                <div className='h-48 rounded-lg' />
              </Skeleton>
            </Card>
          ))}
        </div>
      )
    }
    if (isCarousel) {
      return (
        <Carousel
          opts={{
            align: 'start',
            loop: true,
          }}
          className='w-full'
        >
          <CarouselContent className='-ml-2 md:-ml-4'>
            {movies.map((movie) => (
              <CarouselItem key={movie._id} className='pl-2 md:pl-4 basis-1/2 md:basis-1/4 lg:basis-1/6 xl:basis-[12.5%] 2xl:basis-[11.1%] min-[2560px]:basis-1/12'>
                <Link href={`/movie/${movie.slug}`}>
                  <MovieCard item={movie} />
                </Link>
              </CarouselItem>
            ))}
          </CarouselContent>
          <CarouselPrevious className='-left-4' />
          <CarouselNext className='-right-4' />
        </Carousel>
      )
    }
    return (
      <div className='flex flex-wrap'>
        {movies.map((movie) => (
          <Link key={movie._id} href={`/movie/${movie.slug}`} className='p-2 basis-1/2 md:basis-1/4 lg:basis-1/6 xl:basis-[12.5%] 2xl:basis-[11.1%] min-[2560px]:basis-1/12'>
            <MovieCard item={movie} />
          </Link>
        ))}
      </div>
    )
  }, [loading, isCarousel, movies])

  return (
    <div className={cn('py-8', className)}>
      <div className='px-4 md:px-6'>
        <h2 className='mb-6 text-xl font-bold tracking-tight md:text-3xl'>{title}</h2>

        {renderListMovies()}
      </div>
    </div>
  )
}
