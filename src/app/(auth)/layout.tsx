import { SiteFooter } from '@/components/layout/SiteFooter'
import SiteHeader from '@/components/layout/SiteHeader'

const AuthLayout = async ({ children }: { children: React.ReactNode }) => {
  // if () {
  //   redirect('/login')
  // }
  return (
    <>
      <SiteHeader />
      <main className='flex-1'>
        <section>{children}</section>
      </main>
      <SiteFooter />
    </>
  )
}
export default AuthLayout
