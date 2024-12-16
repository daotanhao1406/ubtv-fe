import { redirect } from 'next/navigation'

import { createServerClient } from '@/lib/supabase/server'

const AuthLayout = async ({ children }: { children: React.ReactNode }) => {
  const supabase = await createServerClient()

  const { data, error } = await supabase.auth.getUser()
  if (error || !data?.user) {
    redirect('/login')
  }
  return <section>{children}</section>
}
export default AuthLayout
