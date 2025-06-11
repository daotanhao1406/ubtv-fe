'use client'

import { addToast, Button as HeroButton, Input } from '@heroui/react'
import { zodResolver } from '@hookform/resolvers/zod'
import { ArrowLeft, Eye, EyeOff } from 'lucide-react'
import { useRouter, useSearchParams } from 'next/navigation'
import { useState } from 'react'
import { useForm } from 'react-hook-form'

import { handleErrorApi } from '@/lib/helper'

import { Button as ShadcnButton } from '@/components/ui/button'
import { Form, FormControl, FormField, FormItem } from '@/components/ui/form'

import { useAuth } from '@/providers/AuthProvider'
import { ResetPasswordBody, ResetPasswordBodyType } from '@/schema/auth.schema'

const ResetPasswordForm = () => {
  const router = useRouter()
  const searchParams = useSearchParams()
  const { resetPassword } = useAuth()
  const resetToken = searchParams.get('token')
  const [loading, setLoading] = useState(false)
  const [isVisible, setIsVisible] = useState(false)
  const [isConfirmVisible, setIsConfirmVisible] = useState(false)
  const form = useForm<ResetPasswordBodyType>({
    resolver: zodResolver(ResetPasswordBody),
    defaultValues: {
      resetToken: resetToken || '',
      confirmPassword: '',
      password: '',
    },
  })
  const passwordState = form.getFieldState('password')
  const confirmPasswordState = form.getFieldState('confirmPassword')
  const password = form.watch('password')
  const passwordErrors: string[] = []
  if (password.length < 6) {
    passwordErrors.push('Password must be 6 characters or more.')
  }

  const toggleVisibility = () => setIsVisible(!isVisible)
  const toggleConfirmVisibility = () => setIsConfirmVisible(!isConfirmVisible)
  const onSubmit = async (values: ResetPasswordBodyType) => {
    setLoading(true)
    await resetPassword(values)
      .then(() => {
        addToast({
          title: 'Reset password',
          description: 'Reset password successfully!',
          timeout: 3000,
          shouldShowTimeoutProgress: true,
          color: 'success',
        })
        router.push(`/successful-password-reset`)
        router.refresh()
      })
      .catch((error) => {
        handleErrorApi({ error })
      })
      .finally(() => {
        setLoading(false)
      })
  }

  return (
    <div className='flex flex-col items-center w-3/4 mt-8'>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className='space-y-11 max-w-xs flex-shrink-0 w-full' noValidate>
          <FormField
            control={form.control}
            name='password'
            render={({ field }) => (
              <FormItem>
                <FormControl>
                  <Input
                    errorMessage={() => (
                      <ul>
                        {passwordErrors.map((error, i) => (
                          <li key={i}>{error}</li>
                        ))}
                      </ul>
                    )}
                    label='Password'
                    placeholder='Enter your new password'
                    labelPlacement='outside'
                    variant='bordered'
                    type={isVisible ? 'text' : 'password'}
                    isInvalid={passwordState.invalid}
                    endContent={
                      <button className='focus:outline-none' type='button' onClick={toggleVisibility} aria-label='toggle password visibility'>
                        {isVisible ? <Eye size={18} className='text-default-400 pointer-events-none' /> : <EyeOff size={18} className='text-default-400 pointer-events-none' />}
                      </button>
                    }
                    {...field}
                  />
                </FormControl>
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name='confirmPassword'
            render={({ field }) => (
              <FormItem>
                <FormControl>
                  <Input
                    placeholder='Confirm your password'
                    labelPlacement='outside'
                    errorMessage={confirmPasswordState.error?.message}
                    variant='bordered'
                    type={isConfirmVisible ? 'text' : 'password'}
                    label='Confirm password'
                    isInvalid={confirmPasswordState.invalid}
                    endContent={
                      <button className='focus:outline-none' type='button' onClick={toggleConfirmVisibility} aria-label='toggle confirm password visibility'>
                        {isConfirmVisible ? <Eye size={18} className='text-default-400 pointer-events-none' /> : <EyeOff size={18} className='text-default-400 pointer-events-none' />}
                      </button>
                    }
                    {...field}
                  />
                </FormControl>
              </FormItem>
            )}
          />
          <HeroButton color='primary' type='submit' isLoading={loading} className='w-full h-14 font-bold'>
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

export default ResetPasswordForm
