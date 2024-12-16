import { createServerClient as createServerSupabaseClient } from '@supabase/ssr'
import { cookies } from 'next/headers'

import envVariables from '@/lib/env'

export async function createServerClient() {
  const cookieStore = await cookies()

  return createServerSupabaseClient(envVariables.NEXT_PUBLIC_SUPABASE_URL!, envVariables.NEXT_PUBLIC_SUPABASE_ANON_KEY!, {
    cookies: {
      getAll() {
        return cookieStore.getAll()
      },
      setAll(cookiesToSet) {
        try {
          cookiesToSet.forEach(({ name, value, options }) => cookieStore.set(name, value, options))
        } catch {
          // The `setAll` method was called from a Server Component.
          // This can be ignored if you have middleware refreshing
          // user sessions.
        }
      },
    },
  })
}
