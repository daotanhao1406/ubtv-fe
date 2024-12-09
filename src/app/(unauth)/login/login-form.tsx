'use client'

import { zodResolver } from '@hookform/resolvers/zod'
import { Button as NextButton, Divider, Input, Spinner } from '@nextui-org/react'
import { ArrowRight, Mail } from 'lucide-react'
import { Eye, EyeOff } from 'lucide-react'
import { useRouter } from 'next/navigation'
import FacebookIcon from 'public/svg/facebook.svg'
import GoogleIcon from 'public/svg/google.svg'
import { useState } from 'react'
import { useForm } from 'react-hook-form'

import { handleErrorApi } from '@/lib/helper'
import { useToast } from '@/hooks/useToast'

import { Button as ShadcnButton } from '@/components/ui/button'
import { Form, FormControl, FormField, FormItem } from '@/components/ui/form'

import { useAuth } from '@/providers/AuthProvider'
import { LoginBody, LoginBodyType } from '@/schema/auth.schema'

const LoginForm = () => {
  const [loading, setLoading] = useState(false)
  const [isVisible, setIsVisible] = useState(false)
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
  const passwordState = form.getFieldState('password')

  const toggleVisibility = () => setIsVisible(!isVisible)
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

            <NextButton isDisabled={loading} color='primary' type='submit' endContent={loading ? <Spinner size='sm' color='default' /> : <ArrowRight size={20} />} className='w-full h-14 rounded-sm font-bold flex justify-between'>
              Login to Your Account
            </NextButton>
          </form>
        </Form>
        <div className='hidden lg:block'>/</div>
        <div className='flex w-full items-center justify-between my-10 md:w-1/2 lg:hidden'>
          <Divider className='w-1/3' />
          <p className='mx-1'>or</p>
          <Divider className='w-1/3' />
        </div>
        <div className='flex lg:flex flex-col space-y-4 max-w-80 flex-shrink-0 w-full'>
          <NextButton startContent={<GoogleIcon className='w-6 mr-2' />} variant='bordered' className='font-semibold h-14 flex justify-start'>
            Sign in with Google
          </NextButton>
          <NextButton startContent={<FacebookIcon className='w-6 mr-2' />} variant='bordered' className='font-semibold h-14 flex justify-start'>
            Sign in with Facebook
          </NextButton>
          <NextButton startContent={<Mail className='w-6 mr-2' />} variant='bordered' className='font-semibold h-14 flex justify-start'>
            Sign in with Email
          </NextButton>
        </div>
      </div>
      <div>
        <ShadcnButton variant='linkHover1' className='mt-10 font-semibold'>
          Forgot Password?
        </ShadcnButton>
      </div>
    </div>
  )
}

export default LoginForm
