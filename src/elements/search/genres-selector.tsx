'use client'
import { Select, Selection, SelectItem, Skeleton } from '@heroui/react'
import { useEffect, useState } from 'react'

export interface Genres {
  id: string
  name: string
  slug: string
}

export default function GenresSelector({ value, onChange }: { value?: Selection; onChange?: (slugs: Selection) => void }) {
  const [genres, setGenres] = useState<Genres[]>([])
  const [loading, setLoading] = useState<boolean>(false)

  useEffect(() => {
    const fetchGenres = async () => {
      setLoading(true)
      const response = await fetch('https://phimapi.com/the-loai')
      const data = await response.json()
      if (Array.isArray(data)) {
        setGenres(data)
      }
      return setLoading(false)
    }
    fetchGenres()
  }, [])

  if (loading) return <Skeleton className='h-10 w-full rounded-lg' />

  if (!Array.isArray(genres) || genres.length === 0) return

  return (
    <Select selectedKeys={value} onSelectionChange={onChange} className='max-w-80' variant='bordered' placeholder='Select genres...' selectionMode='multiple'>
      {genres.map((genres) => (
        <SelectItem key={genres.slug}>{genres.name}</SelectItem>
      ))}
    </Select>
  )
}
