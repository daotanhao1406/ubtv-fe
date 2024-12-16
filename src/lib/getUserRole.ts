import { JWTPayload, jwtVerify } from 'jose'

import envVariables from '@/lib/env'
import { handleErrorApi } from '@/lib/helper'
import { createServerClient } from '@/lib/supabase/server'

// Extend the JWTPayload type to include Supabase-specific metadata
type SupabaseJwtPayload = JWTPayload & {
  app_metadata: {
    role: string
  }
}

export async function getUserRole() {
  // Create a Supabase client for server-side operations
  const supabase = await createServerClient()

  // Retrieve the current session
  const {
    data: { session },
  } = await supabase.auth.getSession()

  let role

  if (session) {
    // Extract the access token from the session
    const token = session.access_token

    try {
      // Encode the JWT secret for verification
      const secret = new TextEncoder().encode(envVariables.NEXT_PUBLIC_SUPABASE_JWT_SECRET)

      // Verify the JWT token and extract the payload
      const { payload } = await jwtVerify<SupabaseJwtPayload>(token, secret)

      // Extract the role from the app_metadata in the payload
      role = payload.app_metadata.role
    } catch (error) {
      handleErrorApi({ error: error as Error })
    }
  }

  return role
}
