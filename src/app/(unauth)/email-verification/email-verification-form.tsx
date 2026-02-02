'use client'

import { addToast, InputOtp } from '@heroui/react'
import { ArrowLeft } from 'lucide-react'
import { useRouter, useSearchParams } from 'next/navigation'
import { useState } from 'react'

import { Button as ShadcnButton } from '@/components/ui/button'

import { useAuth } from '@/providers/AuthProvider'

const EmailVerificationForm = () => {
  const router = useRouter()
  const searchParams = useSearchParams()
  const username = searchParams.get('username')
  const email = searchParams.get('email')
  const type = searchParams.get('type')
  const { confirmResgisterOtp, confirmResetPasswordOtp } = useAuth()
  const [code, setCode] = useState('')
  const [invalidCode, setInvalidCode] = useState<boolean>(false)

  const onInputOTPChange = async (value: string) => {
    setCode(value)
    setInvalidCode(false)
    if (type === 'register') {
      if (value.length === 4 && username) {
        await confirmResgisterOtp({ otp: value, username })
          .then(() => {
            addToast({
              title: 'Sign up',
              description: 'Sign up successfully!',
              timeout: 3000,
              shouldShowTimeoutProgress: true,
              color: 'success',
            })
            router.push('/successful-email-verification')
            router.refresh()
          })
          .catch(() => setInvalidCode(true))
      }
    } else {
      if (value.length === 4 && email) {
        await confirmResetPasswordOtp({ otp: value, email })
          .then((res: any) => {
            addToast({
              title: 'OTP',
              description: 'Confirm reset password OTP successfully!',
              timeout: 3000,
              shouldShowTimeoutProgress: true,
              color: 'success',
            })
            router.push(`/reset-password?token=${res.payload.data.token}`)
            router.refresh()
          })
          .catch(() => setInvalidCode(true))
      }
    }
  }

  return (
    <div className='flex flex-col items-center w-full mt-6'>
      <InputOtp autoFocus length={4} variant='flat' isInvalid={invalidCode} errorMessage='Invalid OTP code' value={code} onValueChange={onInputOTPChange} />
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
