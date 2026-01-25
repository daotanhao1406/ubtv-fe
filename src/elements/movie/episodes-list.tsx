import { Card, CardBody } from '@heroui/react'
import Link from 'next/link'

import { Button } from '@/components/ui/button'

import { EpisodeItem } from '@/types/episode'

function getEpisodeNumber(slug: string) {
  if (typeof slug !== 'string') return null
  if (slug === 'full') return 'Full'
  const num = Number(slug.split('-')[1])
  return Number.isNaN(num) ? null : String(num)
}

export default function EpisodesList({ slug, episodes }: { slug: string; episodes: EpisodeItem[] }) {
  return (
    <div className='font-manrope'>
      <Card shadow='none'>
        <CardBody className='p-10'>
          <div className='text-white/60'>Episodes</div>

          <div className='flex flex-wrap gap-2.5 mt-6'>
            {/* {episodes.map((episode) => (
              <Button key={episode.slug} variant='ghost' radius='sm' isIconOnly className='text-sm border-1' size='sm'>
                {getEpisodeNumber(episode.slug)}
              </Button>
            ))} */}
            {episodes.map((episode) => (
              <Link key={episode.slug} href={`/movie/${slug}/${episode.slug}`}>
                <Button variant='outline' className='text-sm border-1 bg-transparent h-9 w-9' size='icon'>
                  {getEpisodeNumber(episode.slug)}
                </Button>
              </Link>
            ))}
          </div>
        </CardBody>
      </Card>
    </div>
  )
}
