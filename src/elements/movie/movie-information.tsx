import { Avatar, Card, CardBody } from '@heroui/react'
import { Calendar, Languages, LayoutGrid, Star, UserRound } from 'lucide-react'

import { Button } from '@/components/ui/button'
import { Rating } from '@/components/ui/rating'

import { MovieItem } from '@/types/movie'

export default function MovieInformation({ movie }: { movie: MovieItem }) {
  return (
    <Card shadow='none'>
      <CardBody className='space-y-6 py-10 px-8'>
        <div className='space-y-3'>
          <div className='flex items-center gap-2 text-white/60'>
            <Calendar size={18} />
            Released Year
          </div>
          <div>{movie?.year}</div>
        </div>

        <div className='space-y-3'>
          <div className='flex items-center gap-2 text-white/60'>
            <Languages size={18} />
            Countries
          </div>
          <div className='flex flex-wrap gap-2'>
            {movie?.country.map((country, key) => (
              <Button key={key} size='sm' variant='outline'>
                {country.name}
              </Button>
            ))}
          </div>
        </div>

        <div className='space-y-3'>
          <div className='flex items-center gap-2 text-white/60'>
            <Star size={18} />
            Ratings
          </div>
          <div className='flex flex-wrap gap-2'>
            {movie?.tmdb && (
              <div className='flex flex-col bg-[#121212] border-[#27272a] border-1 rounded-md p-3'>
                <div>IMDb</div>
                <div className='flex gap-2 items-center my-1'>
                  <Rating value={Number((movie?.tmdb?.vote_average / 2).toFixed(1))} precision={0.1} /> {Number(movie?.tmdb?.vote_average / 2).toFixed(1)}
                </div>
              </div>
            )}
          </div>
        </div>

        <div className='space-y-3'>
          <div className='flex items-center gap-2 text-white/60'>
            <LayoutGrid size={18} />
            Genres
          </div>
          <div className='flex flex-wrap gap-2'>
            {movie?.category.map((category, key) => (
              <Button key={key} size='sm' variant='outline'>
                {category.name}
              </Button>
            ))}
          </div>
        </div>

        <div className='space-y-3'>
          <div className='flex items-center gap-2 text-white/60'>
            <UserRound size={18} />
            Director
          </div>
          <div className='flex w-full gap-2'>
            {movie?.tmdb && (
              <div className='flex w-full gap-3 bg-[#121212] border-[#27272a] border-1 rounded-md p-3'>
                <Avatar radius='sm' className='w-14 h-14 text-large' src='https://i.pravatar.cc/150?u=a04258114e29026708c' />
                <div className='flex flex-col justify-center'>
                  <div>{movie?.director?.[0]}</div>
                  <div className='text-white/60'>From Japan</div>
                </div>
              </div>
            )}
          </div>
        </div>
      </CardBody>
    </Card>
  )
}
