'use client'

import { addToast, Button as HeroButton, Input } from '@heroui/react'
import { zodResolver } from '@hookform/resolvers/zod'
import { ArrowLeft, Eye, EyeOff } from 'lucide-react'
import { useRouter } from 'next/navigation'
import { useState } from 'react'
import { useForm } from 'react-hook-form'

import { AuthHttpError } from '@/lib/auth-http'

import { Button as ShadcnButton } from '@/components/ui/button'
import { Form, FormControl, FormField, FormItem } from '@/components/ui/form'

import { useAuth } from '@/providers/AuthProvider'
import { ResetPasswordFormInput, ResetPasswordFormSchema } from '@/schema/auth.schema'

type ResetPasswordFormProps = { email: string; resetToken: string }

const ResetPasswordForm = ({ email, resetToken }: ResetPasswordFormProps) => {
  const router = useRouter()
  const { completePasswordReset } = useAuth()
  const [loading, setLoading] = useState(false)
  const [isVisible, setIsVisible] = useState(false)
  const [isConfirmVisible, setIsConfirmVisible] = useState(false)
  const [errorMessage, setErrorMessage] = useState('')
  const form = useForm<ResetPasswordFormInput>({
    resolver: zodResolver(ResetPasswordFormSchema),
    defaultValues: {
      email,
      resetToken,
      confirmPassword: '',
      password: '',
    },
  })
  const { errors } = form.formState
  const missingResetDetails = !email || !resetToken

  const toggleVisibility = () => setIsVisible(!isVisible)
  const toggleConfirmVisibility = () => setIsConfirmVisible(!isConfirmVisible)
  const onSubmit = async (values: ResetPasswordFormInput) => {
    if (loading || missingResetDetails) return
    setLoading(true)
    setErrorMessage('')
    await completePasswordReset(values)
      .then(() => {
        addToast({
          title: 'Reset password',
          description: 'Your password has been reset. Please log in again.',
          timeout: 3000,
          shouldShowTimeoutProgress: true,
          color: 'success',
        })
        router.replace('/successful-password-reset')
        router.refresh()
      })
      .catch((error) => {
        setErrorMessage(error instanceof AuthHttpError ? error.message : 'Unable to connect. Please try again.')
      })
      .finally(() => {
        setLoading(false)
      })
  }

  return (
    <div className='flex flex-col items-center w-3/4 mt-8'>
      {(missingResetDetails || errorMessage) && (
        <p role='alert' className='mb-4 text-sm text-danger whitespace-pre-line'>
          {missingResetDetails ? 'Reset details are missing or invalid. Please request a new code.' : errorMessage}
        </p>
      )}
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className='space-y-11 max-w-xs flex-shrink-0 w-full' noValidate>
          <FormField
            control={form.control}
            name='password'
            render={({ field }) => (
              <FormItem>
                <FormControl>
                  <Input
                    errorMessage={errors.password?.message}
                    label='Password'
                    placeholder='Enter your new password'
                    labelPlacement='outside'
                    variant='bordered'
                    type={isVisible ? 'text' : 'password'}
                    autoComplete='new-password'
                    isInvalid={!!errors.password}
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
                    errorMessage={errors.confirmPassword?.message}
                    variant='bordered'
                    type={isConfirmVisible ? 'text' : 'password'}
                    autoComplete='new-password'
                    label='Confirm password'
                    isInvalid={!!errors.confirmPassword}
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
          <HeroButton color='primary' type='submit' isLoading={loading} isDisabled={loading || missingResetDetails} className='w-full h-14 font-bold'>
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
