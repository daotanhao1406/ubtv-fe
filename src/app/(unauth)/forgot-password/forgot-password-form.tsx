'use client'

import { addToast, Button as HeroButton, Input } from '@heroui/react'
import { zodResolver } from '@hookform/resolvers/zod'
import { ArrowLeft } from 'lucide-react'
import { useRouter } from 'next/navigation'
import { useState } from 'react'
import { useForm } from 'react-hook-form'

import { AuthHttpError } from '@/lib/auth-http'

import { Button as ShadcnButton } from '@/components/ui/button'
import { Form, FormControl, FormField, FormItem } from '@/components/ui/form'

import ubtvAuthApi from '@/api/ubtv-auth'
import { ForgotPasswordInput, ForgotPasswordInputSchema } from '@/schema/auth-api.schema'

const ForgotPasswordForm = () => {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const form = useForm<ForgotPasswordInput>({
    resolver: zodResolver(ForgotPasswordInputSchema),
    defaultValues: {
      email: '',
    },
  })
  const { errors } = form.formState

  const onSubmit = async (values: ForgotPasswordInput) => {
    if (loading) return
    setLoading(true)
    await ubtvAuthApi
      .forgotPassword(values)
      .then(() => {
        router.push(`/email-verification?${new URLSearchParams({ type: 'resetpassword', email: values.email, sent: 'true' })}`)
        router.refresh()
      })
      .catch((error) => {
        addToast({ title: 'Unable to request a reset code', description: error instanceof AuthHttpError ? error.message : 'Unable to connect. Please try again.', color: 'danger' })
      })
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
            name='email'
            render={({ field }) => (
              <FormItem>
                <FormControl>
                  <Input errorMessage={errors.email?.message} variant={errors.email ? 'bordered' : 'flat'} isInvalid={!!errors.email} className='rounded-none' type='email' autoComplete='email' label='Enter your email' {...field} />
                </FormControl>
              </FormItem>
            )}
          />
          <HeroButton isLoading={loading} isDisabled={loading} color='primary' type='submit' className='w-full h-14 font-bold'>
            Reset password
          </HeroButton>
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
