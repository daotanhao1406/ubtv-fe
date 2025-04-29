'use client'

import { Button as NextButton, Input } from '@heroui/react'
import { zodResolver } from '@hookform/resolvers/zod'
import { ArrowLeft } from 'lucide-react'
import { useRouter } from 'next/navigation'
import { useForm } from 'react-hook-form'

import { Button as ShadcnButton } from '@/components/ui/button'
import { Form, FormControl, FormField, FormItem } from '@/components/ui/form'

import { ForgotPasswordBody, ForgotPasswordBodyType } from '@/schema/auth.schema'

const ForgotPasswordForm = () => {
  const router = useRouter()
  const form = useForm<ForgotPasswordBodyType>({
    resolver: zodResolver(ForgotPasswordBody),
    defaultValues: {
      email: '',
    },
  })
  const emailState = form.getFieldState('email')

  const onSubmit = async () => {}

  return (
    <div className='flex flex-col items-center w-3/4 mt-6'>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className='space-y-6 max-w-md flex-shrink-0 w-full' noValidate>
          <FormField
            control={form.control}
            name='email'
            render={({ field }) => (
              <FormItem>
                <FormControl>
                  <Input variant={emailState.invalid ? 'bordered' : 'flat'} isInvalid={emailState.invalid} className='rounded-none' type='text' label='Enter your email' {...field} />
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
