'use server'

import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'

import { createServerClient } from '@/lib/supabase/server'

import { LoginBodyType } from '@/schema/auth.schema'

export async function loginWithEmail(formData: LoginBodyType) {
  const supabase = await createServerClient()

  // type-casting here for convenience
  // in practice, you should validate your inputs
  const formdata = {
    email: formData.email as string,
    password: formData.password as string,
  }

  const { error, data } = await supabase.auth.signInWithPassword(formdata)

  return { error, data }
}

export async function signup(formData: LoginBodyType) {
  const supabase = await createServerClient()

  // type-casting here for convenience
  // in practice, you should validate your inputs
  const formdata = {
    email: formData.email as string,
    password: formData.password as string,
    options: {
      emailRedirectTo: '/',
    },
  }

  const { error } = await supabase.auth.signUp(formdata)
  if (error) {
    redirect('/error')
  }

  revalidatePath('/', 'layout')
  redirect('/')
}
