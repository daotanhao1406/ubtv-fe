'use client'

import { Button, Input, Spinner } from '@heroui/react'
import { zodResolver } from '@hookform/resolvers/zod'
import { Eye, EyeOff } from 'lucide-react'
import { useRouter } from 'next/navigation'
import { useState } from 'react'
import { useForm } from 'react-hook-form'

import { toast } from '@/hooks/useToast'

import { Form, FormControl, FormField, FormItem } from '@/components/ui/form'

import { SignUpBody, SignUpBodyType } from '@/schema/auth.schema'

const SignUpForm = () => {
  const [loading, setLoading] = useState(false)
  const [isVisible, setIsVisible] = useState(false)
  const [isConfirmVisible, setIsConfirmVisible] = useState(false)
  const router = useRouter()
  const form = useForm<SignUpBodyType>({
    resolver: zodResolver(SignUpBody),
    defaultValues: {
      name: '',
      email: '',
      password: '',
      confirmPassword: '',
    },
  })
  const nameState = form.getFieldState('name')
  const emailState = form.getFieldState('email')
  const passwordState = form.getFieldState('password')
  const confirmPasswordState = form.getFieldState('confirmPassword')
  const password = form.watch('password')
  const passwordErrors: string[] = []

  if (password.length < 6) {
    passwordErrors.push('Password must be 6 characters or more.')
  }
  if ((password.match(/[A-Z]/g) || []).length < 1) {
    passwordErrors.push('Password must include at least 1 upper case letter')
  }
  if ((password.match(/[^a-z0-9]/gi) || []).length < 1) {
    passwordErrors.push('Password must include at least 1 symbol.')
  }
  const toggleVisibility = () => setIsVisible(!isVisible)
  const toggleConfirmVisibility = () => setIsConfirmVisible(!isConfirmVisible)

  const onSubmit = async () => {
    setLoading(true)
    // const { error } = await supabase.auth
    //   .signInWithPassword({
    //     email: values.email,
    //     password: values.password,
    //     name: values.name,
    //   })
    //   .finally(() => setLoading(false))

    // if (error) {
    //   return handleErrorApi({ error })
    // }
    toast({
      description: 'SignUp success',
      title: 'SignUp',
      duration: 3000,
    })
    router.push('/')
    router.refresh()
  }

  return (
    <div className='flex flex-col mt-10'>
      <div className='flex w-full'>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className='space-y-4 w-[440px]' noValidate>
            <FormField
              control={form.control}
              name='name'
              render={({ field }) => (
                <FormItem>
                  <FormControl>
                    <Input errorMessage={nameState.error?.message} variant={nameState.invalid ? 'bordered' : 'flat'} isInvalid={nameState.invalid} className='rounded-none' type='text' label='Full Name' {...field} />
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
                    <Input errorMessage={emailState.error?.message} variant={emailState.invalid ? 'bordered' : 'flat'} isInvalid={emailState.invalid} className='rounded-none' type='text' label='Email' {...field} />
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
                      errorMessage={() => (
                        <ul>
                          {passwordErrors.map((error, i) => (
                            <li key={i}>{error}</li>
                          ))}
                        </ul>
                      )}
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
            <FormField
              control={form.control}
              name='confirmPassword'
              render={({ field }) => (
                <FormItem>
                  <FormControl>
                    <Input
                      errorMessage={confirmPasswordState.error?.message}
                      variant={confirmPasswordState.invalid ? 'bordered' : 'flat'}
                      type={isConfirmVisible ? 'text' : 'password'}
                      label='Confirm Password'
                      isInvalid={confirmPasswordState.invalid}
                      endContent={
                        <button className='focus:outline-none' type='button' onClick={toggleConfirmVisibility} aria-label='toggle confirm password visibility'>
                          {isConfirmVisible ? <Eye className='text-2xl text-default-400 pointer-events-none' /> : <EyeOff className='text-2xl text-default-400 pointer-events-none' />}
                        </button>
                      }
                      {...field}
                    />
                  </FormControl>
                </FormItem>
              )}
            />
            <Button isDisabled={loading} color='primary' type='submit' endContent={loading && <Spinner size='sm' color='default' />} className='w-full h-14 rounded-sm font-bold'>
              Sign Up
            </Button>
            <p className='text-xs text-muted-foreground'>By proceeding, I agree to UB's Terms of Use and acknowledge that I have read the Privacy Policy.</p>
          </form>
        </Form>
      </div>
    </div>
  )
}

export default SignUpForm
