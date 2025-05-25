'use client'

import { Card } from '@heroui/react'
import { Star } from 'lucide-react'
import { useState } from 'react'

export function MovieCard({ title, year, genre, imageUrl, videoUrl, rating }: any) {
  const [isHovering, setIsHovering] = useState(false)

  return (
    <Card className='group relative aspect-[2/3] overflow-hidden rounded-lg transition-transform duration-300' onMouseEnter={() => setIsHovering(true)} onMouseLeave={() => setIsHovering(false)}>
      {/* Rating Badge */}
      {rating && (
        <div className='absolute right-2 top-2 z-20 flex items-center gap-1 rounded-full bg-black/80 px-2 py-1 text-sm'>
          <Star className='h-3 w-3 fill-yellow-500 text-yellow-500' />
          <span>{rating.toFixed(1)}</span>
        </div>
      )}

      {/* Video/Image Container */}
      <div className='relative h-full w-full'>
        {/* eslint-disable @next/next/no-img-element */}
        <img src={imageUrl} alt={title} className='h-full w-full object-cover' />

        {/* Video Overlay */}
        {videoUrl && isHovering && <video src={videoUrl} autoPlay muted playsInline className='absolute inset-0 h-full w-full object-cover' />}

        {/* Content Overlay */}
        <div className='absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent'>
          <div className='absolute bottom-4 left-4 right-4'>
            <h3 className='text-lg font-normal'>{title}</h3>
            <div className='mt-1 flex items-center gap-2 text-sm text-white/70'>
              <span>{year}</span>
              <span>•</span>
              <span>{genre}</span>
            </div>
          </div>
        </div>
      </div>
    </Card>
  )
}
