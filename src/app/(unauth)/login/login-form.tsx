'use client'

import { zodResolver } from '@hookform/resolvers/zod'
import { Button } from '@nextui-org/react'
import { useRouter } from 'next/navigation'
import { useState } from 'react'
import { useForm } from 'react-hook-form'

import { handleErrorApi } from '@/lib/helper'
import { useToast } from '@/hooks/useToast'

import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form'
import { Input } from '@/components/ui/input'

import authApiRequest from '@/api/auth'
import { LoginBody, LoginBodyType } from '@/schema/auth.schema'

const LoginForm = () => {
  const [loading, setLoading] = useState(false)
  const { toast } = useToast()
  const router = useRouter()
  const form = useForm<LoginBodyType>({
    resolver: zodResolver(LoginBody),
    defaultValues: {
      username: '',
      password: '',
    },
  })

  // 2. Define a submit handler.
  async function onSubmit(values: LoginBodyType) {
    if (loading) return
    setLoading(true)
    try {
      const result = await authApiRequest.login(values)

      await authApiRequest.authToNextServer({
        accessToken: result.payload.accessToken,
        expiresAt: '3600',
      })

      toast({
        description: 'Login success',
        title: 'Login',
      })
      router.push('/')
      router.refresh()
    } catch (error: any) {
      handleErrorApi({
        error,
        setError: form.setError,
      })
    } finally {
      setLoading(false)
    }
  }
  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className='space-y-2 max-w-[600px] flex-shrink-0 w-full' noValidate>
        <FormField
          control={form.control}
          name='username'
          render={({ field }) => (
            <FormItem>
              <FormLabel>Username</FormLabel>
              <FormControl>
                <Input placeholder='shadcn' type='text' {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name='password'
          render={({ field }) => (
            <FormItem>
              <FormLabel>Mật khẩu</FormLabel>
              <FormControl>
                <Input placeholder='shadcn' type='password' {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <Button type='submit' isLoading={loading} className='!mt-8 w-full'>
          Đăng nhập
        </Button>
      </form>
    </Form>
  )
}

export default LoginForm
