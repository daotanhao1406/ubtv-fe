import { SiteFooter } from '@/components/layout/SiteFooter'
import SiteHeader from '@/components/layout/SiteHeader'

export default function MovieLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <SiteHeader isHome />
      <main className='flex-1'>
        <section>{children}</section>
      </main>
      <SiteFooter />
    </>
  )
}
