import { Card, CardBody } from '@heroui/react'
import Image from 'next/image'

import { MovieItem } from '@/types/movie'

export default function MovieEpisodeInformation({ movie }: { movie: MovieItem | undefined }) {
  return (
    <Card>
      <CardBody className='p-4 sm:p-6 lg:p-10'>
        <div className='flex flex-col items-start gap-4 sm:flex-row sm:gap-6 lg:gap-8'>
          <div className='relative w-32 shrink-0 self-center aspect-[2/3] sm:w-40 sm:self-start lg:w-48'>
            {movie?.poster_url && <Image src={movie.poster_url} alt={movie.name} fill sizes='(min-width: 1024px) 192px, (min-width: 640px) 160px, 128px' className='rounded-lg object-cover' />}
          </div>
          <div className='min-w-0 flex-1 break-words'>
            <div className='text-xl sm:text-2xl xl:text-4xl font-semibold'>{movie?.name}</div>
            <div className='text-sm leading-relaxed md:text-base text-white/60 mt-3'>{movie?.content}</div>
          </div>
        </div>
      </CardBody>
    </Card>
  )
}
