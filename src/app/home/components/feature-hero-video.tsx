'use client'

import { PlayIcon } from 'lucide-react'
import Image from 'next/image'

import { useIsMobile } from '@/hooks'

import { Button } from '@/components/ui/button'

import { MovieItem } from '@/types/movie'

interface VideoSlideProps {
  movie: MovieItem
}

export default function FeaturedHeroVideo({ movie }: VideoSlideProps) {
  const isMobile = useIsMobile()

  return (
    <div className='relative h-[80vh] w-full overflow-hidden'>
      {/* Background Video */}
      {/* <video src={movie.videoUrl} autoPlay muted className='object-cover absolute inset-0 h-full w-full' /> */}
      <Image src={movie?.thumb_url} fill alt={movie.name} className='object-cover absolute inset-0 h-full w-full' />

      {/* Overlay */}
      <div className='absolute inset-0 bg-gradient-to-r from-black/80 via-black/50 to-transparent' />

      {/* Content */}
      <div className='absolute inset-0 flex items-center'>
        <div className='container px-4 md:px-6'>
          <div className='max-w-xl space-y-6'>
            <h1 className='text-2xl font-bold tracking-tighter sm:text-xl xl:text-6xl'>{movie.name}</h1>
            <p className='text-sm md:text-lg'>{movie.origin_name}</p>
            <div className='flex flex-wrap gap-4'>
              {}
              <Button size={isMobile ? 'sm' : 'lg'} className='gap-2'>
                Learn More
              </Button>
              <Button size={isMobile ? 'sm' : 'lg'} variant='outline' className='gap-2'>
                <PlayIcon className='h-4 w-4' />
                Watch Now
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
