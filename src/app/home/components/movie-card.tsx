import { Card } from '@heroui/react'
import { Star } from 'lucide-react'
import Image from 'next/image'

import { MovieItem } from '@/types/movie'

export function MovieCard({ item }: { item: MovieItem }) {
  return (
    <Card
      className='group relative aspect-[2/3] overflow-hidden rounded-lg transition-transform duration-300 cursor-pointer'
      // onMouseEnter={() => setIsHovering(true)}
      // onMouseLeave={() => setIsHovering(false)}
    >
      {/* Rating Badge */}
      {/* {item?.tmdb?.vote_average && ( */}
      <div className='absolute right-2 top-2 z-20 flex items-center gap-1 rounded-full bg-black/80 px-2 py-1 text-sm'>
        <Star className='h-3 w-3 fill-yellow-500 text-yellow-500' />
        <span>{Number.isInteger(item?.tmdb?.vote_average) ? item?.tmdb?.vote_average : item?.tmdb?.vote_average?.toFixed(1)}</span>
      </div>
      {/* )} */}

      {/* Video/Image Container */}
      <div className='relative h-full w-full'>
        <Image src={item?.poster_url} alt={item?.name} fill className='h-full w-full object-cover' />

        {/* Video Overlay */}
        {/* {videoUrl && isHovering && <video src={videoUrl} autoPlay muted playsInline className='absolute inset-0 h-full w-full object-cover' />} */}

        {/* Content Overlay */}
        <div className='absolute inset-0 bg-gradient-to-t from-black/80 via-black/50 to-transparent'>
          <div className='absolute bottom-4 left-4 right-4'>
            <h3 className='text-sm font-medium'>{item?.name}</h3>
            <div className='mt-1 flex items-center gap-2 text-xs text-white/60'>
              <span>
                {item?.year}, {item?.category?.[0]?.name}
              </span>
            </div>
          </div>
        </div>
      </div>
    </Card>
  )
}
