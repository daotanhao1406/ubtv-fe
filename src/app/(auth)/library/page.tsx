'use client'

import { Avatar, Tab, Tabs } from '@heroui/react'
import { Bookmark, Eye } from 'lucide-react'
import { useState } from 'react'

import { MovieSection } from '@/app/home/partials/movie-section'
import { useAuth } from '@/providers/AuthProvider'

import { favoriteMovies, watchedMovieItems } from './data'

type LibraryTab = 'watched' | 'favorites'

const LibraryPage = () => {
  const { user } = useAuth()
  const [selectedTab, setSelectedTab] = useState<LibraryTab>('watched')

  if (!user) return null

  const displayName = user.name.trim() || 'User'

  return (
    <div className='flex-1 bg-[#101010]'>
      <section aria-label='Library profile' className='bg-[#18181b]'>
        <div className='flex items-center gap-6 px-4 py-6 md:px-6 md:py-8'>
          <Avatar aria-label={`${displayName} avatar`} className='h-20 w-20 shrink-0 text-2xl md:h-24 md:w-24 md:text-3xl' color='secondary' name={displayName} />
          <h1 className='text-2xl font-bold md:text-3xl'>{displayName}</h1>
        </div>
      </section>

      <section aria-label='Movie library' className='px-4 pb-10 pt-4 md:pl-6 md:pt-5'>
        <Tabs
          aria-label='Movie library lists'
          className='w-full'
          classNames={{
            base: 'w-full',
            tabList: 'w-full max-w-[560px] justify-start gap-6 rounded-none border-b border-white/10 bg-transparent p-0',
            tab: 'h-12 px-3',
            cursor: 'w-full bg-white',
            panel: 'px-0 py-5',
          }}
          selectedKey={selectedTab}
          onSelectionChange={(key) => setSelectedTab(String(key) as LibraryTab)}
          variant='underlined'
        >
          <Tab
            key='watched'
            title={
              <span className='flex items-center gap-2 text-sm'>
                <Eye aria-hidden='true' className='h-4 w-4' />
                <span>Watched</span>
                <span className='text-foreground/70'>{watchedMovieItems.length}</span>
              </span>
            }
          >
            <MovieSection className='px-0 py-3 md:px-0' linkMovies={false} loading={false} movies={watchedMovieItems} title='' />
          </Tab>
          <Tab
            key='favorites'
            title={
              <span className='flex items-center gap-2 text-sm'>
                <Bookmark aria-hidden='true' className='h-4 w-4' />
                <span>Favorites</span>
                <span className='text-foreground/70'>{favoriteMovies.length}</span>
              </span>
            }
          >
            <MovieSection className='px-0 py-3 md:px-0' linkMovies={false} loading={false} movies={favoriteMovies} title='' />
          </Tab>
        </Tabs>
      </section>
    </div>
  )
}

export default LibraryPage
