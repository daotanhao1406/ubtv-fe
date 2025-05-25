'use client'

import { motion } from 'framer-motion'
import { PlayIcon } from 'lucide-react'

import { Button } from '@/components/ui/button'

interface FeaturedHeroProps {
  title: string
  description: string
}

export function FeaturedHero({ title, description }: FeaturedHeroProps) {
  return (
    <div className='relative h-[80vh] w-full overflow-hidden'>
      {/* Background Image */}
      <video src='https://raw.githubusercontent.com/daotanhao1406/anime-video/master/demon-slayer.mp4' autoPlay muted loop className='object-cover absolute inset-0 h-full w-full'></video>
      <div className='absolute inset-0 bg-gradient-to-r from-black/80 via-black/50 to-transparent' />

      {/* Content */}
      <div className='absolute inset-0 flex items-center'>
        <div className='container px-4 md:px-6'>
          <div className='max-w-xl space-y-6'>
            <motion.h1 className='text-4xl font-bold tracking-tighter sm:text-5xl xl:text-6xl' initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}>
              {title}
            </motion.h1>
            <motion.p className='text-md md:text-lg' initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, delay: 0.2 }}>
              {description}
            </motion.p>
            <motion.div className='flex flex-wrap gap-4' initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, delay: 0.4 }}>
              <Button size='lg' className='gap-2 bg-white text-black hover:bg-white/90'>
                Learn More
              </Button>
              <Button size='lg' variant='outline' className='gap-2 hover:bg-white/10'>
                <PlayIcon className='h-4 w-4' />
                To Watch
              </Button>
            </motion.div>
          </div>
        </div>
      </div>
    </div>
  )
}
