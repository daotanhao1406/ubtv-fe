'use client'

import DOMPurify from 'dompurify'
import { PlayIcon, Plus, ThumbsUp } from 'lucide-react'
import Image from 'next/image'
import { useEffect, useState } from 'react'

import { useIsMobile } from '@/hooks'

import { Button } from '@/components/ui/button'

import { MovieItem } from '@/types/movie'

interface VideoSlideProps {
  movie: MovieItem
}

export default function MovieHero({ movie }: VideoSlideProps) {
  const isMobile = useIsMobile()
  const [safeHtml, setSafeHtml] = useState('')

  useEffect(() => {
    setSafeHtml(
      DOMPurify.sanitize(movie.content || '', {
        ALLOWED_TAGS: ['b', 'i', 'em', 'strong', 'br', 'p'],
        ALLOWED_ATTR: [],
      }),
    )
  }, [movie.content])
  return (
    <div className='relative flex min-h-[80svh] w-full items-end overflow-hidden pt-24 font-manrope md:pt-28'>
      {/* Background Video */}
      {/* <video src={movie.videoUrl} autoPlay muted className='object-cover absolute inset-0 h-full w-full' /> */}
      {movie.thumb_url ? <Image src={movie.thumb_url} fill sizes='100vw' alt={movie.name} className='object-cover absolute inset-0 h-full w-full' /> : null}

      {/* Overlay */}
      <div className='absolute inset-0 bg-gradient-to-t from-background via-background/40 to-transparent' />
      {/* Content */}
      <div className='relative w-full py-8 md:py-12'>
        <div className='container mx-auto flex flex-col items-center px-4 text-center md:px-6'>
          <div className='min-w-0 max-w-full break-words'>
            <h1 className='text-2xl font-bold tracking-tighter sm:text-3xl xl:text-4xl mb-3'>{movie.name}</h1>
            <div dangerouslySetInnerHTML={{ __html: safeHtml }} className='text-sm leading-relaxed md:text-lg text-white/40 mb-6 md:mb-7' />
            <div className='flex flex-wrap items-center justify-center gap-3 md:gap-4'>
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
