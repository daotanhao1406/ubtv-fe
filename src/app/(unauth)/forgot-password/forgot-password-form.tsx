'use client'

import { zodResolver } from '@hookform/resolvers/zod'
import { Button as NextButton, Input, Spinner } from '@nextui-org/react'
import { ArrowLeft } from 'lucide-react'
import { useRouter } from 'next/navigation'
import { useState } from 'react'
import { useForm } from 'react-hook-form'

import { handleErrorApi } from '@/lib/helper'
import { useToast } from '@/hooks/useToast'

import { Button as ShadcnButton } from '@/components/ui/button'
import { Form, FormControl, FormField, FormItem } from '@/components/ui/form'

import { useAuth } from '@/providers/AuthProvider'
import { LoginBody, LoginBodyType } from '@/schema/auth.schema'

const ForgotPasswordForm = () => {
  const [loading, setLoading] = useState(false)
  const { toast } = useToast()
  const router = useRouter()
  const { login } = useAuth()
  const form = useForm<LoginBodyType>({
    resolver: zodResolver(LoginBody),
    defaultValues: {
      username: '',
      password: '',
    },
  })
  const usernameState = form.getFieldState('username')

  // 2. Define a submit handler.
  async function onSubmit(values: LoginBodyType) {
    setLoading(true)
    await login(values)
      .then(() => {
        toast({
          description: 'Login success',
          title: 'Login',
          duration: 3000,
        })
        router.push('/')
        router.refresh()
      })
      .catch((error) => handleErrorApi({ error }))
      .finally(() => {
        setLoading(false)
      })
  }
  return (
    <div className='flex flex-col items-center w-3/4 mt-6'>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className='space-y-6 max-w-md flex-shrink-0 w-full' noValidate>
          <FormField
            control={form.control}
            name='username'
            render={({ field }) => (
              <FormItem>
                <FormControl>
                  <Input variant={usernameState.invalid ? 'bordered' : 'flat'} isInvalid={usernameState.invalid} className='rounded-none' type='text' label='Enter your email' {...field} />
                </FormControl>
              </FormItem>
            )}
          />
          <NextButton isDisabled={loading} color='primary' type='submit' endContent={loading && <Spinner size='sm' color='default' />} className='w-full h-14 font-bold'>
            Reset Password
          </NextButton>
        </form>
      </Form>
      <ShadcnButton onClick={() => router.push('/login')} variant='linkHover2' className='mt-4'>
        <ArrowLeft size={16} style={{ marginRight: 8 }} />
        Back to Login
      </ShadcnButton>
    </div>
  )
}

export default ForgotPasswordForm
