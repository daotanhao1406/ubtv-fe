'use client'

import { addToast, Button as HeroButton, Divider, Input, Spinner } from '@heroui/react'
import { zodResolver } from '@hookform/resolvers/zod'
import { ArrowRight, LogIn, Mail } from 'lucide-react'
import { Eye, EyeOff } from 'lucide-react'
import { useRouter } from 'next/navigation'
import FacebookIcon from 'public/svg/facebook.svg'
import GoogleIcon from 'public/svg/google.svg'
import { useState } from 'react'
import { useForm } from 'react-hook-form'

import { AuthHttpError } from '@/lib/auth-http'

import { Button as ShadcnButton } from '@/components/ui/button'
import { Form, FormControl, FormField, FormItem } from '@/components/ui/form'

import { useAuth } from '@/providers/AuthProvider'
import { LoginInput, LoginInputSchema } from '@/schema/auth-api.schema'

type LoginFormProps = { email: string; redirectTo: string }

const LoginForm = ({ email, redirectTo }: LoginFormProps) => {
  const [loading, setLoading] = useState(false)
  const [isVisible, setIsVisible] = useState(false)
  const { login, isInitializing, isLoggingOut } = useAuth()
  const router = useRouter()
  const form = useForm<LoginInput>({
    resolver: zodResolver(LoginInputSchema),
    defaultValues: {
      email,
      password: '',
    },
  })
  const { errors } = form.formState
  const disabled = loading || isInitializing || isLoggingOut

  const signInWithGoogle = async () => {}

  const toggleVisibility = () => setIsVisible(!isVisible)

  const onSubmit = async (values: LoginInput) => {
    if (disabled) return
    setLoading(true)
    try {
      await login(values)
      addToast({
        title: 'Login',
        description: 'Login successfully!',
        timeout: 3000,
        shouldShowTimeoutProgress: true,
        color: 'success',
        icon: <LogIn />,
      })
      router.replace(redirectTo)
    } catch (error) {
      if (error instanceof AuthHttpError && error.status === 403 && error.payload.code === 'EMAIL_NOT_VERIFIED') {
        router.push(`/email-verification?type=register&email=${encodeURIComponent(values.email)}`)
      } else {
        addToast({
          title: 'Login failed',
          description: error instanceof AuthHttpError && error.status === 401 ? 'Invalid email or password.' : error instanceof Error ? error.message : 'Unable to log in. Please try again.',
          color: 'danger',
          timeout: 5000,
          shouldShowTimeoutProgress: true,
        })
      }
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className='flex flex-col items-center w-3/4 mt-10 xl:w-1/2 2xl:w-2/5'>
      <div className='flex flex-col-reverse lg:flex-row items-center w-full justify-center lg:justify-between'>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className='space-y-4 max-w-80 flex-shrink-0 w-full' noValidate>
            <FormField
              control={form.control}
              name='email'
              render={({ field }) => (
                <FormItem>
                  <FormControl>
                    <Input variant={errors.email ? 'bordered' : 'flat'} isInvalid={!!errors.email} errorMessage={errors.email?.message} className='rounded-none' type='email' label='Email' autoComplete='email' {...field} />
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
                      variant={errors.password ? 'bordered' : 'flat'}
                      type={isVisible ? 'text' : 'password'}
                      label='Password'
                      isInvalid={!!errors.password}
                      errorMessage={errors.password?.message}
                      autoComplete='current-password'
                      endContent={
                        <button className='focus:outline-none' type='button' onClick={toggleVisibility} aria-label='toggle password visibility'>
                          {isVisible ? <Eye className='text-2xl text-default-400 pointer-events-none' /> : <EyeOff className='text-2xl text-default-400 pointer-events-none' />}
                        </button>
                      }
                      {...field}
                    />
                  </FormControl>
                </FormItem>
              )}
            />

            <HeroButton isDisabled={disabled} color='primary' type='submit' endContent={loading ? <Spinner size='sm' color='default' /> : <ArrowRight size={20} />} className='w-full h-14 rounded-sm font-bold flex justify-between'>
              Login to Your Account
            </HeroButton>
          </form>
        </Form>
        <div className='hidden lg:block'>/</div>
        <div className='flex w-full items-center justify-between my-10 md:w-1/2 lg:hidden'>
          <Divider className='w-1/3' />
          <p className='mx-1'>or</p>
          <Divider className='w-1/3' />
        </div>
        <div className='flex lg:flex flex-col space-y-4 max-w-80 flex-shrink-0 w-full'>
          <HeroButton isDisabled={loading} onClick={signInWithGoogle} startContent={<GoogleIcon className='w-6 mr-2' />} variant='bordered' className='font-semibold h-14 flex justify-start'>
            Sign in with Google
          </HeroButton>
          <HeroButton isDisabled={loading} startContent={<FacebookIcon className='w-6 mr-2' />} variant='bordered' className='font-semibold h-14 flex justify-start'>
            Sign in with Facebook
          </HeroButton>
          <HeroButton isDisabled={loading} startContent={<Mail className='w-6 mr-2' />} variant='bordered' className='font-semibold h-14 flex justify-start'>
            Sign in with Email
          </HeroButton>
        </div>
      </div>
      <ShadcnButton onClick={() => router.push('/signup')} variant='linkHover1' className='font-semibold mt-10'>
        Don't have an account? Create one here
      </ShadcnButton>
      <ShadcnButton onClick={() => router.push('/forgot-password')} variant='linkHover1' className='font-semibold'>
        Forgot Password?
      </ShadcnButton>
    </div>
  )
}

export default LoginForm
