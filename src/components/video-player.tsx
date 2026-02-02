// components/VideoPlayer.tsx
'use client' // Bắt buộc cho Next.js App Router
import { MediaPlayer, MediaProvider, Poster } from '@vidstack/react'
import { defaultLayoutIcons, DefaultVideoLayout } from '@vidstack/react/player/layouts/default'

import '@vidstack/react/player/styles/default/theme.css'
import '@vidstack/react/player/styles/default/layouts/audio.css'
import '@vidstack/react/player/styles/default/layouts/video.css'

interface VideoPlayerProps {
  title?: string
  src: string
  poster?: string
}

const VideoPlayer: React.FC<VideoPlayerProps> = ({ src, poster, title }) => {
  return (
    <MediaPlayer src={src} viewType='video' streamType='on-demand' logLevel='warn' crossOrigin playsInline title={title || 'Tên phim'} poster={poster || ''}>
      <MediaProvider>
        <Poster className='vds-poster' />
      </MediaProvider>
      <DefaultVideoLayout
        // thumbnails='https://files.vidstack.io/sprite-fight/thumbnails.vtt'
        icons={defaultLayoutIcons}
      />
    </MediaPlayer>
  )
}

export default VideoPlayer
