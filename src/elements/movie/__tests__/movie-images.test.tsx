import { render, screen } from '@testing-library/react'

import FeaturedHeroVideo from '@/app/home/components/feature-hero-video'
import { MovieCard } from '@/app/home/components/movie-card'
import MovieHero from '@/elements/movie/movie-hero'

import { MovieItem } from '@/types/movie'

jest.mock('@/hooks', () => ({ useIsMobile: () => false }))

const movie = {
  name: 'Test movie',
  origin_name: 'Original title',
} as MovieItem

describe.each([
  ['MovieHero', MovieHero],
  ['FeaturedHeroVideo', FeaturedHeroVideo],
] as const)('%s images', (_name, Hero) => {
  it.each([null, undefined, ''])('renders the movie without crashing when the thumbnail is %p', (thumb_url) => {
    render(<Hero movie={{ ...movie, thumb_url }} />)

    expect(screen.getByRole('heading', { name: movie.name })).toBeInTheDocument()
    expect(screen.queryByRole('img')).not.toBeInTheDocument()
  })

  it('renders an available thumbnail', () => {
    render(<Hero movie={{ ...movie, thumb_url: 'https://phimimg.com/thumbnail.jpg' }} />)

    expect(screen.getByRole('img', { name: movie.name })).toHaveAttribute('src', expect.stringContaining(encodeURIComponent('https://phimimg.com/thumbnail.jpg')))
  })
})

describe('MovieCard images', () => {
  it.each([null, undefined, ''])('does not request a missing poster (%p)', (poster_url) => {
    render(<MovieCard item={{ ...movie, poster_url }} />)

    expect(screen.getByRole('heading', { name: movie.name })).toBeInTheDocument()
    expect(screen.queryByRole('img')).not.toBeInTheDocument()
  })

  it.each(['poster.jpg', 'https://phimimg.com/poster.jpg'])('renders an available poster (%s)', (poster_url) => {
    render(<MovieCard item={{ ...movie, poster_url }} />)

    expect(screen.getByRole('img', { name: movie.name })).toHaveAttribute('src', expect.stringContaining(encodeURIComponent('https://phimimg.com/poster.jpg')))
  })
})
