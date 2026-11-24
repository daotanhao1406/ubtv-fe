'use client'

import { addToast } from '@heroui/react'
import DOMPurify from 'dompurify'
import { LoaderCircle, PlayIcon, Plus, ThumbsUp } from 'lucide-react'
import Image from 'next/image'
import { usePathname, useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'

import { cn } from '@/lib/utils'
import { useIsMobile } from '@/hooks'

import { Button } from '@/components/ui/button'
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog'

import userLibraryApi from '@/api/user-library'
import { useAuth } from '@/providers/AuthProvider'

import { MovieItem } from '@/types/movie'

interface VideoSlideProps {
  movie: MovieItem
}

export default function MovieHero({ movie }: VideoSlideProps) {
  const isMobile = useIsMobile()
  const { user, isInitializing } = useAuth()
  const router = useRouter()
  const pathname = usePathname()
  const [safeHtml, setSafeHtml] = useState('')
  const [isFavorite, setIsFavorite] = useState(false)
  const [isFavoriteLoading, setIsFavoriteLoading] = useState(true)
  const [isUpdatingFavorite, setIsUpdatingFavorite] = useState(false)
  const [isLoginDialogOpen, setIsLoginDialogOpen] = useState(false)

  useEffect(() => {
    setSafeHtml(
      DOMPurify.sanitize(movie.content || '', {
        ALLOWED_TAGS: ['b', 'i', 'em', 'strong', 'br', 'p'],
        ALLOWED_ATTR: [],
      }),
    )
  }, [movie.content])

  useEffect(() => {
    if (isInitializing) return

    if (!user) {
      setIsFavorite(false)
      setIsFavoriteLoading(false)
      return
    }

    let isCurrentRequest = true
    setIsFavoriteLoading(true)

    const loadFavoriteState = async () => {
      try {
        const favoriteIds = await userLibraryApi.getFavorites()
        if (isCurrentRequest) setIsFavorite(favoriteIds.includes(movie._id))
      } catch (error) {
        if (!isCurrentRequest) return
        addToast({
          title: 'Unable to check favorite status',
          description: error instanceof Error ? error.message : 'Please try again.',
          color: 'danger',
        })
      } finally {
        if (isCurrentRequest) setIsFavoriteLoading(false)
      }
    }

    loadFavoriteState()
    return () => {
      isCurrentRequest = false
    }
  }, [isInitializing, movie._id, user])

  const handleFavoritePress = async () => {
    if (!user) {
      setIsLoginDialogOpen(true)
      return
    }

    if (isFavoriteLoading || isUpdatingFavorite) return

    setIsUpdatingFavorite(true)
    try {
      const response = isFavorite ? await userLibraryApi.removeFavorite(movie._id) : await userLibraryApi.addFavorite(movie._id)
      setIsFavorite(response.data.isFavorite)
    } catch (error) {
      addToast({
        title: 'Unable to update favorite',
        description: error instanceof Error ? error.message : 'Please try again.',
        color: 'danger',
      })
    } finally {
      setIsUpdatingFavorite(false)
    }
  }

  const handleLoginRedirect = () => {
    router.push(`/login?redirectFrom=${encodeURIComponent(pathname)}`)
  }

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
              <Button
                aria-label={isFavorite ? 'Remove from favorites' : 'Add to favorites'}
                aria-pressed={isFavorite}
                className={cn(isFavorite && 'border-primary bg-primary text-primary-foreground hover:bg-primary/90 hover:text-primary-foreground')}
                disabled={isInitializing || isFavoriteLoading || isUpdatingFavorite}
                size='icon'
                variant='outline'
                onClick={handleFavoritePress}
              >
                {isFavoriteLoading || isUpdatingFavorite ? <LoaderCircle aria-hidden='true' className='animate-spin' size={20} /> : <ThumbsUp aria-hidden='true' className={cn(isFavorite && 'fill-current')} size={20} />}
              </Button>
            </div>
          </div>
        </div>
      </div>
      <Dialog open={isLoginDialogOpen} onOpenChange={setIsLoginDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Sign in to add this movie to your favorites</DialogTitle>
            <DialogDescription>Sign in to save this movie to your favorites list.</DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant='outline' onClick={() => setIsLoginDialogOpen(false)}>
              Maybe later
            </Button>
            <Button onClick={handleLoginRedirect}>Sign in</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
