import { createServerClient } from '@/lib/supabase/server'

export default async function ProfilePage() {
  const supabase = await createServerClient()

  const { data } = await supabase.auth.getUser()

  return <div>Profile Page: {data.user?.email}</div>
}
