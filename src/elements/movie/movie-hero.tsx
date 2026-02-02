'use client'

import DOMPurify from 'dompurify'
import { PlayIcon, Plus, ThumbsUp } from 'lucide-react'
import Image from 'next/image'

import { useIsMobile } from '@/hooks'

import { Button } from '@/components/ui/button'

import { MovieItem } from '@/types/movie'

interface VideoSlideProps {
  movie: MovieItem
}

export default function MovieHero({ movie }: VideoSlideProps) {
  const isMobile = useIsMobile()

  const safeHtml = DOMPurify.sanitize(movie.content || '', {
    ALLOWED_TAGS: ['b', 'i', 'em', 'strong', 'br', 'p'],
    ALLOWED_ATTR: [],
  })
  return (
    <div className='relative h-[80vh] w-full overflow-hidden font-manrope'>
      {/* Background Video */}
      {/* <video src={movie.videoUrl} autoPlay muted className='object-cover absolute inset-0 h-full w-full' /> */}
      <Image src={movie?.thumb_url} fill alt={movie.name} className='object-cover absolute inset-0 h-full w-full' />

      {/* Overlay */}
      <div className='absolute inset-0 bg-gradient-to-t from-background via-background/40 to-transparent' />
      {/* Content */}
      <div className='absolute bottom-0 w-full pb-12'>
        <div className='container mx-auto flex flex-col items-center px-4 text-center md:px-6'>
          <div className='max-w-full'>
            <h1 className='text-2xl font-bold tracking-tighter sm:text-xl xl:text-4xl mb-3'>{movie.name}</h1>
            <div dangerouslySetInnerHTML={{ __html: safeHtml }} className='text-sm md:text-lg text-white/40 mb-7' />
            <div className='flex flex-wrap justify-center gap-4'>
              <Button size={isMobile ? 'sm' : 'lg'} className='gap-2 font-semibold'>
                <PlayIcon className='h-4 w-4 fill-black' />
                Play Now
              </Button>
              <Button size='icon' variant='outline'>
                <Plus />
              </Button>
              <Button size='icon' variant='outline'>
                <ThumbsUp size={20} />
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
