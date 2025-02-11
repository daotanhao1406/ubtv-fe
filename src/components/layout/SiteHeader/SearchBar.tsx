import { Button, ButtonProps, Kbd } from '@heroui/react'
import { Search as SearchIcon } from 'lucide-react'

export default function SearchBar({ onClick }: ButtonProps) {
  return (
    <>
      <div className='sm:hidden'>
        <button className='transition-opacity p-1 hover:opacity-80 rounded-full cursor-pointer outline-none' onClick={onClick}>
          <SearchIcon className='mt-px text-default-600 dark:text-default-500' size={20} />
        </button>
      </div>
      <div className='hidden sm:flex'>
        <Button
          aria-label='Search anime'
          className='text-sm font-normal text-default-500 bg-default-400/20 dark:bg-default-500/20'
          endContent={
            <Kbd className='hidden py-0.5 px-2 lg:inline-block' keys='command'>
              K
            </Kbd>
          }
          startContent={<SearchIcon className='text-base text-default-400 pointer-events-none flex-shrink-0' size={18} strokeWidth={2} />}
          onClick={onClick}
        >
          Search Anime...
        </Button>
      </div>
    </>
  )
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
