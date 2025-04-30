'use client'

import { addToast, Button as HeroButton, Divider, Input, Spinner } from '@heroui/react'
import { zodResolver } from '@hookform/resolvers/zod'
import { ArrowRight, Mail } from 'lucide-react'
import { Eye, EyeOff } from 'lucide-react'
import { useRouter } from 'next/navigation'
import FacebookIcon from 'public/svg/facebook.svg'
import GoogleIcon from 'public/svg/google.svg'
import { useState } from 'react'
import { useForm } from 'react-hook-form'

import { handleErrorApi } from '@/lib/helper'

import { Button as ShadcnButton } from '@/components/ui/button'
import { Form, FormControl, FormField, FormItem } from '@/components/ui/form'

import { useAuth } from '@/providers/AuthProvider'
import { LoginBody, LoginBodyType } from '@/schema/auth.schema'

const LoginForm = () => {
  const [loading, setLoading] = useState(false)
  const [isVisible, setIsVisible] = useState(false)
  const { login } = useAuth()
  const router = useRouter()
  const form = useForm<LoginBodyType>({
    resolver: zodResolver(LoginBody),
    defaultValues: {
      username: '',
      password: '',
    },
  })
  const usernameState = form.getFieldState('username')
  const passwordState = form.getFieldState('password')

  async function signInWithGoogle() {}

  const toggleVisibility = () => setIsVisible(!isVisible)

  const onSubmit = async (values: LoginBodyType) => {
    setLoading(true)
    await login(values)
      .then(() => {
        addToast({
          title: 'Login',
          description: 'Login successfully!',
          timeout: 3000,
          shouldShowTimeoutProgress: true,
          color: 'success',
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
    <div className='flex flex-col items-center w-3/4 mt-10 xl:w-1/2'>
      <div className='flex flex-col-reverse lg:flex-row items-center w-full justify-center lg:justify-between'>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className='space-y-4 max-w-80 flex-shrink-0 w-full' noValidate>
            <FormField
              control={form.control}
              name='username'
              render={({ field }) => (
                <FormItem>
                  <FormControl>
                    <Input variant={usernameState.invalid ? 'bordered' : 'flat'} isInvalid={usernameState.invalid} className='rounded-none' type='text' label='Username' {...field} />
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
                      variant={passwordState.invalid ? 'bordered' : 'flat'}
                      type={isVisible ? 'text' : 'password'}
                      label='Password'
                      isInvalid={passwordState.invalid}
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

            <HeroButton isDisabled={loading} color='primary' type='submit' endContent={loading ? <Spinner size='sm' color='default' /> : <ArrowRight size={20} />} className='w-full h-14 rounded-sm font-bold flex justify-between'>
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
