'use client'
import { Input } from '@heroui/react'
import { Search as SearchIcon } from 'lucide-react'
import { usePathname, useRouter, useSearchParams } from 'next/navigation'
import { useEffect, useState } from 'react'

import { sanitizeInput } from '@/lib/utils/sanitizeInput'

export default function SearchBar() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const [inputValue, setInputValue] = useState('')
  const pathname = usePathname()

  // 1. useEffect để đồng bộ state với URL
  useEffect(() => {
    // Lấy params 'q' hiện tại từ URL
    const currentQuery = searchParams.get('keyword')

    if (currentQuery) {
      // Decode để hiển thị tiếng Việt đẹp (ví dụ: %20 -> khoảng trắng)
      setInputValue(decodeURIComponent(currentQuery))
    } else {
      // Nếu không có q (về trang chủ), reset input
      setInputValue('')
    }
  }, [searchParams]) // Chạy lại mỗi khi URL thay đổi
  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      e.preventDefault()

      const cleanText = sanitizeInput(inputValue)

      if (!cleanText) {
        return
      }

      router.push(`/search?keyword=${encodeURIComponent(cleanText)}`)
    }
  }
  return pathname !== '/search' ? (
    <div className='flex-1 w-full sm:max-w-96 mr-2 sm:mr-0'>
      <Input
        classNames={{
          base: 'w-full h-10',
          mainWrapper: 'h-full',
          input: 'text-small',
          inputWrapper: 'h-full font-normal text-default-500 bg-default-400/20 dark:bg-default-500/20',
        }}
        placeholder='Search...'
        size='sm'
        className='w-full'
        startContent={<SearchIcon size={18} />}
        type='search'
        value={inputValue}
        onValueChange={setInputValue}
        onKeyDown={handleKeyDown}
      />
    </div>
  ) : null
}

export function SearchSkeleton() {
  return (
    <form className='w-max-[550px] relative w-full lg:w-80 xl:w-full'>
      <input placeholder='Search for products...' className='w-full rounded-lg border bg-white px-4 py-2 text-sm text-black placeholder:text-neutral-500 dark:border-neutral-800 dark:bg-transparent dark:text-white dark:placeholder:text-neutral-400' />
      <div className='absolute right-0 top-0 mr-3 flex h-full items-center'>
        <SearchIcon className='h-4' />
      </div>
    </form>
  )
}
