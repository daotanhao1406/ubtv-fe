'use client'

import { InputOtp } from '@heroui/react'
import { ArrowLeft } from 'lucide-react'
import { useRouter } from 'next/navigation'
import { useForm } from 'react-hook-form'

import { Button as ShadcnButton } from '@/components/ui/button'
import { Form, FormControl, FormField, FormItem } from '@/components/ui/form'

const EmailVerificationForm = () => {
  const router = useRouter()
  const form = useForm<any>({
    defaultValues: {
      code: '',
    },
  })
  const codeState = form.getFieldState('code')

  const onSubmit = async () => {}

  return (
    <div className='flex flex-col items-center w-full mt-6'>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className='space-y-6 flex flex-col max-w-md items-center w-full' noValidate>
          <FormField
            control={form.control}
            name='code'
            render={({ field }) => (
              <FormItem>
                <FormControl>
                  <InputOtp autoFocus length={4} variant='flat' isInvalid={codeState.invalid} {...field} />
                </FormControl>
              </FormItem>
            )}
          />
        </form>
      </Form>
      <p className='text-muted-foreground mt-6'>
        Didn't receive the email?{' '}
        <ShadcnButton className='p-0' variant='link'>
          Click to resend
        </ShadcnButton>
      </p>
      <ShadcnButton onClick={() => router.push('/login')} variant='linkHover2' className='mt-2'>
        <ArrowLeft size={16} style={{ marginRight: 8 }} />
        Back to Login
      </ShadcnButton>
    </div>
  )
}

export default EmailVerificationForm
