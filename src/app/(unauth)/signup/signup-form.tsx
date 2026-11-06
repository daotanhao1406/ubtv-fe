'use client'

import { addToast, Button, Form as HeroForm, Input, Spinner } from '@heroui/react'
import { zodResolver } from '@hookform/resolvers/zod'
import { Eye, EyeOff } from 'lucide-react'
import { useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'
import { useForm } from 'react-hook-form'

import { AuthHttpError } from '@/lib/auth-http'

import { Form, FormControl, FormField, FormItem } from '@/components/ui/form'

import { useAuth } from '@/providers/AuthProvider'
import { SignUpBody, SignUpBodyType } from '@/schema/auth.schema'

const retryDelay = (value: string | null) => {
  if (!value) return 60
  const seconds = Number(value)
  if (Number.isFinite(seconds)) return Math.max(60, Math.ceil(seconds))
  const delay = Math.ceil((Date.parse(value) - Date.now()) / 1000)
  return Number.isFinite(delay) ? Math.max(60, delay) : 60
}

const SignUpForm = () => {
  const [loading, setLoading] = useState(false)
  const [retryWait, setRetryWait] = useState(0)
  const [isVisible, setIsVisible] = useState(false)
  const [isConfirmVisible, setIsConfirmVisible] = useState(false)
  const { register } = useAuth()
  const router = useRouter()
  const form = useForm<SignUpBodyType>({
    resolver: zodResolver(SignUpBody),
    defaultValues: {
      username: '',
      email: '',
      password: '',
      confirmPassword: '',
    },
  })
  const { errors } = form.formState
  const countingDown = retryWait > 0

  useEffect(() => {
    if (!countingDown) return
    const timer = window.setInterval(() => setRetryWait((seconds) => Math.max(0, seconds - 1)), 1000)
    return () => window.clearInterval(timer)
  }, [countingDown])

  const toggleVisibility = () => setIsVisible(!isVisible)
  const toggleConfirmVisibility = () => setIsConfirmVisible(!isConfirmVisible)
  const onSubmit = async (values: SignUpBodyType) => {
    if (loading || retryWait > 0) return
    setLoading(true)
    try {
      const { data } = await register({ name: values.username, email: values.email, password: values.password })
      addToast({
        title: 'Account created',
        description: data.verificationEmailSent ? 'Check your inbox and spam folder for a verification code.' : 'Your account was created, but the verification email could not be sent. Wait 60 seconds, then choose Click to resend.',
        color: data.verificationEmailSent ? 'success' : 'warning',
        timeout: data.verificationEmailSent ? 5000 : 10000,
        shouldShowTimeoutProgress: true,
      })
      router.push(`/email-verification?${new URLSearchParams({ type: 'register', email: data.email, registered: 'true' })}`)
    } catch (error) {
      const emailExists = error instanceof AuthHttpError && error.status === 409
      if (error instanceof AuthHttpError && error.status === 429) setRetryWait(retryDelay(error.retryAfter))
      addToast({
        title: emailExists ? 'Email already registered' : 'Registration failed',
        description: emailExists ? 'Log in or verify your email to continue.' : error instanceof Error ? error.message : 'Unable to register. Please try again.',
        color: 'danger',
        timeout: emailExists ? 10000 : 5000,
        shouldShowTimeoutProgress: true,
        endContent: emailExists ? (
          <Button size='sm' variant='flat' onPress={() => router.push(`/email-verification?${new URLSearchParams({ type: 'register', email: values.email })}`)}>
            Verify email
          </Button>
        ) : undefined,
      })
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className='flex flex-col mt-10'>
      <div className='flex w-full'>
        <Form {...form}>
          <HeroForm onSubmit={form.handleSubmit(onSubmit)} className='block space-y-4 w-[440px]' validationBehavior='aria'>
            <FormField
              control={form.control}
              name='username'
              render={({ field }) => (
                <FormItem>
                  <FormControl>
                    <Input errorMessage={errors.username?.message} variant={errors.username ? 'bordered' : 'flat'} isInvalid={!!errors.username} className='rounded-none' type='text' label='Username' autoComplete='name' {...field} />
                  </FormControl>
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name='email'
              render={({ field }) => (
                <FormItem>
                  <FormControl>
                    <Input errorMessage={errors.email?.message} variant={errors.email ? 'bordered' : 'flat'} isInvalid={!!errors.email} className='rounded-none' type='email' label='Email' autoComplete='email' {...field} />
                  </FormControl>
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name='password'
              render={({ field }) => (
                <FormItem>
                  <FormControl>
                    <Input
                      errorMessage={errors.password?.message}
                      variant={errors.password ? 'bordered' : 'flat'}
                      type={isVisible ? 'text' : 'password'}
                      label='Password'
                      isInvalid={!!errors.password}
                      autoComplete='new-password'
                      endContent={
                        <Button isIconOnly variant='light' size='sm' className='h-auto w-auto min-w-0 p-0' type='button' onPress={toggleVisibility} aria-label='toggle password visibility'>
                          {isVisible ? <Eye className='text-2xl text-default-400 pointer-events-none' /> : <EyeOff className='text-2xl text-default-400 pointer-events-none' />}
                        </Button>
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
                      errorMessage={errors.confirmPassword?.message}
                      variant={errors.confirmPassword ? 'bordered' : 'flat'}
                      type={isConfirmVisible ? 'text' : 'password'}
                      label='Confirm Password'
                      isInvalid={!!errors.confirmPassword}
                      autoComplete='new-password'
                      endContent={
                        <Button isIconOnly variant='light' size='sm' className='h-auto w-auto min-w-0 p-0' type='button' onPress={toggleConfirmVisibility} aria-label='toggle confirm password visibility'>
                          {isConfirmVisible ? <Eye className='text-2xl text-default-400 pointer-events-none' /> : <EyeOff className='text-2xl text-default-400 pointer-events-none' />}
                        </Button>
                      }
                      {...field}
                    />
                  </FormControl>
                </FormItem>
              )}
            />
            <Button isDisabled={loading || retryWait > 0} color='primary' type='submit' endContent={loading && <Spinner size='sm' color='default' />} className='w-full h-14 rounded-sm font-bold'>
              {retryWait > 0 ? `Try again in ${retryWait}s` : 'Get started'}
            </Button>
            <p className='text-xs text-muted-foreground'>By proceeding, I agree to UB's Terms of Use and acknowledge that I have read the Privacy Policy.</p>
          </HeroForm>
        </Form>
      </div>
    </div>
  )
}

export default SignUpForm
