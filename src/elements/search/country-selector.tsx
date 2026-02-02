'use client'
import { Select, Selection, SelectItem, Skeleton } from '@heroui/react'
import { useEffect, useState } from 'react'

export interface Country {
  id: string
  name: string
  slug: string
}

export default function CountrySelector({ value, onChange }: { value?: Selection; onChange?: (slugs: Selection) => void }) {
  const [Country, setCountry] = useState<Country[]>([])
  const [loading, setLoading] = useState<boolean>(false)

  useEffect(() => {
    const fetchCountry = async () => {
      setLoading(true)
      const response = await fetch('https://phimapi.com/quoc-gia')
      const data = await response.json()
      if (Array.isArray(data)) {
        setCountry(data)
      }
      return setLoading(false)
    }
    fetchCountry()
  }, [])

  if (loading) return <Skeleton className='h-10 w-full rounded-lg' />

  if (!Array.isArray(Country) || Country.length === 0) return

  return (
    <Select className='max-w-80' variant='bordered' onSelectionChange={onChange} selectedKeys={value} placeholder='Select countries...' selectionMode='multiple'>
      {Country.map((Country) => (
        <SelectItem key={Country.slug}>{Country.name}</SelectItem>
      ))}
    </Select>
  )
}
