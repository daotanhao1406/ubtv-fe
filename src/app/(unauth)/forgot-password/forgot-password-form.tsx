'use client'

import { zodResolver } from '@hookform/resolvers/zod'
import { Button as NextButton, Input } from '@nextui-org/react'
import { ArrowLeft } from 'lucide-react'
import { useRouter } from 'next/navigation'
import { useForm } from 'react-hook-form'

import { Button as ShadcnButton } from '@/components/ui/button'
import { Form, FormControl, FormField, FormItem } from '@/components/ui/form'

import { LoginBody, LoginBodyType } from '@/schema/auth.schema'

const ForgotPasswordForm = () => {
  const router = useRouter()
  const form = useForm<LoginBodyType>({
    resolver: zodResolver(LoginBody),
    defaultValues: {
      email: '',
      password: '',
    },
  })
  const usernameState = form.getFieldState('email')

  return (
    <div className='flex flex-col items-center w-3/4 mt-6'>
      <Form {...form}>
        <form className='space-y-6 max-w-md flex-shrink-0 w-full' noValidate>
          <FormField
            control={form.control}
            name='email'
            render={({ field }) => (
              <FormItem>
                <FormControl>
                  <Input variant={usernameState.invalid ? 'bordered' : 'flat'} isInvalid={usernameState.invalid} className='rounded-none' type='text' label='Enter your email' {...field} />
                </FormControl>
              </FormItem>
            )}
          />
          <NextButton color='primary' type='submit' className='w-full h-14 font-bold'>
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
