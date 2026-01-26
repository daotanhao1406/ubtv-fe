import { MovieSection } from '@/app/home/partials/movie-section'
import FilterSidebar from '@/elements/search/filter-sidebar'

interface SearchPageProps {
  searchParams: {
    q?: string
    category?: string
    page?: string
  }
}

async function getSearchResults(query: string) {
  const res = await fetch(`https://phimapi.com/v1/api/tim-kiem?keyword=${query}`, {
    // Cache: 'no-store' giúp data luôn mới mỗi lần search (Dynamic Rendering)
    cache: 'no-store',
  })

  if (!res.ok) throw new Error('Failed to fetch data')
  return res.json()
}

export default async function SearchPage({ searchParams }: SearchPageProps) {
  const query = searchParams.q || ''

  if (!query) {
    return <div className='p-10 text-center'>Vui lòng nhập từ khóa để tìm kiếm...</div>
  }

  const data = await getSearchResults(query)

  return (
    <div className='pl-6 pr-4'>
      {/* Header */}
      <div className='mt-8'>
        <div className='text-2xl'>
          Search result for <strong>{query}</strong>
        </div>
      </div>

      {/* Search result */}
      <div className='flex mt-8'>
        <div className='w-52'>
          <FilterSidebar />
        </div>
        <div className='flex-1'>
          <MovieSection className='py-0 !px-0 !pl-3' movies={data?.data?.items} title='' />
        </div>
      </div>

      <div className='h-20' />
    </div>
  )
}
