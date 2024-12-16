import { createBrowserClient as createBrowserSupabaseClient } from '@supabase/ssr'

import envVariables from '@/lib/env'

export const createBrowserClient = () => createBrowserSupabaseClient(envVariables.NEXT_PUBLIC_SUPABASE_URL!, envVariables.NEXT_PUBLIC_SUPABASE_ANON_KEY!)
