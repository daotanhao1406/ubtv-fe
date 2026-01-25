import { Card, CardBody } from '@heroui/react'
import Image from 'next/image'

import { MovieItem } from '@/types/movie'

export default function MovieEpisodeInformation({ movie }: { movie: MovieItem | undefined }) {
  return (
    <Card>
      <CardBody className='p-10'>
        <div className='flex items-start gap-8'>
          <div className='w-48 aspect-3/4'>
            <Image src={movie?.poster_url || ''} alt={movie?.name || ''} width={200} height={200} className='rounded-lg object-cover w-full h-auto' />
          </div>
          <div className='flex-1'>
            <div className='lg:text-4xl font-semibold'>{movie?.name}</div>
            <div className='text-white/60 mt-3'>{movie?.content}</div>
          </div>
        </div>
      </CardBody>
    </Card>
  )
}
