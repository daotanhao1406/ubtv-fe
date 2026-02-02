'use client'

import { addToast, Input, Pagination } from '@heroui/react'
import { SearchIcon } from 'lucide-react'
import { usePathname, useRouter, useSearchParams } from 'next/navigation' // Thêm useRouter, usePathname
import { useCallback, useEffect, useState } from 'react'

import { sanitizeInput } from '@/lib/utils/sanitizeInput'

import { MovieSection } from '@/app/home/partials/movie-section'
import FilterSidebar, { FilterValues } from '@/elements/search/filter-sidebar'

interface SearchParams extends FilterValues {
  keyword?: string
  page?: string
  limit?: string
}

export default function SearchPage() {
  const router = useRouter()
  const pathname = usePathname()
  const searchParams = useSearchParams()

  const [data, setData] = useState<any>()
  const [loading, setLoading] = useState<boolean>()

  const [inputValue, setInputValue] = useState<string>(searchParams.get('keyword') || '')

  // 1. Hàm này chịu trách nhiệm GỌI API dựa trên URL hiện tại
  const fetchMovies = useCallback(async () => {
    setLoading(true)
    const currentKeyword = searchParams.get('keyword') || ''

    if (!currentKeyword) return

    const apiParams = new URLSearchParams({
      page: searchParams.get('page') || '1',
      limit: searchParams.get('limit') || '20',
      keyword: currentKeyword,
      sort_lang: searchParams.get('language') || '',
      category: searchParams.get('genres') || '',
      country: searchParams.get('countries') || '',
      year: searchParams.get('year') || '',
    })

    try {
      const res = await fetch(`https://phimapi.com/v1/api/tim-kiem?${apiParams.toString()}`)
      if (!res.ok) throw new Error('Failed to fetch data')
      const result = await res.json()
      setData(result)
    } catch (error) {
      addToast({
        title: 'Fetch movies failed',
        description: (error as Error)?.message || '',
        color: 'danger',
      })
    } finally {
      setLoading(false)
    }
  }, [searchParams])

  // 2. useEffect: Lắng nghe sự thay đổi của URL để gọi API
  useEffect(() => {
    fetchMovies()
  }, [fetchMovies])

  // 3. Hàm này chịu trách nhiệm UPDATE URL (không gọi API trực tiếp)
  const handleUpdateParams = (updates: SearchParams) => {
    const params = new URLSearchParams(searchParams.toString())

    if (updates.keyword) params.set('keyword', updates.keyword)
    else if (updates.keyword === '') params.delete('keyword')

    if (updates.language) params.set('language', updates.language)
    else if (updates.language === '') params.delete('language')

    if (updates.genres) params.set('genres', updates.genres)
    else if (updates.genres === '') params.delete('genres')

    if (updates.countries) params.set('countries', updates.countries)
    else if (updates.countries === '') params.delete('countries')

    if (updates.year) params.set('year', updates.year)
    else if (updates.year === '') params.delete('year')

    if (updates.page) params.set('page', updates.page)

    // Reset về trang 1 khi filter thay đổi (tuỳ logic)
    // params.set('page', '1')

    router.push(`${pathname}?${params.toString()}`)
  }

  const onFilterChange = (values: FilterValues) => {
    handleUpdateParams({
      ...values,
      keyword: inputValue || searchParams.get('keyword') || '',
    })
  }

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      e.preventDefault()
      const cleanText = sanitizeInput(inputValue)
      if (!cleanText) return

      handleUpdateParams({ keyword: cleanText, page: '1' })
    }
  }

  return (
    <div className='pl-6 pr-4'>
      {/* Header */}
      <div className='mt-8'>
        <Input
          classNames={{
            base: 'max-w-96 h-10 bg-transparent',
            mainWrapper: 'h-full',
            inputWrapper: 'h-full font-normal text-default-500 bg-default-400/20 dark:bg-default-500/20',
          }}
          placeholder='Type to search...'
          size='lg'
          className='w-96'
          startContent={<SearchIcon size={18} />}
          type='search'
          value={inputValue}
          onValueChange={setInputValue}
          onKeyDown={handleKeyDown}
          errorMessage='Please enter a keyword to search'
          isInvalid={!inputValue}
        />
      </div>

      {/* Search result */}
      <div className='flex mt-4'>
        <div className='w-52'>
          {/* Bạn nên truyền defaultValues vào Sidebar để khi reload nó tích đúng ô */}
          <FilterSidebar
            loading={loading}
            onFilter={onFilterChange}
            values={{
              language: searchParams.get('language') || '',
              genres: searchParams.get('genres') || '',
              countries: searchParams.get('countries') || '',
              year: searchParams.get('year') || '',
            }}
          />
        </div>
        <div className='flex-1'>
          <MovieSection loading={loading} className='py-3 !px-0 !pl-5' movies={data?.data?.items} title='' />
          <Pagination
            className='justify-items-end pr-6'
            variant='light'
            showControls
            page={data?.data?.params?.pagination?.currentPage}
            total={data?.data?.params?.pagination?.totalPages}
            onChange={(currentPage) => handleUpdateParams({ page: String(currentPage) })}
          />
        </div>
      </div>

      <div className='h-20' />
    </div>
  )
}
