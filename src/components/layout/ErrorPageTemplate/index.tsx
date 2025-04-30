'use client'

import { Home } from 'lucide-react'

import { Button } from '@/components/ui/button'

interface ErrorPageProps {
  code: string
  title: string
  description: string
}

export function ErrorPageTemplate({ code, title, description }: ErrorPageProps) {
  return (
    <main className='flex-grow flex flex-col items-center justify-center text-center px-4'>
      <div className='flex flex-col justify-center items-center'>
        <h1 className='text-8xl font-bold leading-none tracking-tight'>{code}</h1>
        <h2 className='text-4xl font-bold mt-4'>{title}</h2>
        <p className='mt-8'>{description}</p>
        <Button className='gap-2 mt-6'>
          <Home size={16} />
          Return Home
        </Button>
      </div>
    </main>
  )
}
