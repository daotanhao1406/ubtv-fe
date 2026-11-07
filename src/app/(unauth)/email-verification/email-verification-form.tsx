'use client'

import { addToast, InputOtp } from '@heroui/react'
import { ArrowLeft } from 'lucide-react'
import { useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'

import { AuthHttpError } from '@/lib/auth-http'

import { Button as ShadcnButton } from '@/components/ui/button'
import { Spinner } from '@/components/ui/spinner'

import ubtvAuthApi from '@/api/ubtv-auth'
import { ResendVerificationInputSchema, VerifyEmailInputSchema, VerifyResetPasswordInputSchema } from '@/schema/auth-api.schema'

const retryDelay = (value: string | null) => {
  if (!value) return 60
  const seconds = Number(value)
  if (Number.isFinite(seconds)) return Math.max(60, Math.ceil(seconds))
  const delay = Math.ceil((Date.parse(value) - Date.now()) / 1000)
  return Number.isFinite(delay) ? Math.max(60, delay) : 60
}

type EmailVerificationFormProps = {
  email: string
  type: 'register' | 'resetpassword'
  initialResendCooldown?: number
}

const EmailVerificationForm = ({ email, type, initialResendCooldown = 0 }: EmailVerificationFormProps) => {
  const router = useRouter()
  const [code, setCode] = useState('')
  const [invalidCode, setInvalidCode] = useState<boolean>(false)
  const [pending, setPending] = useState(false)
  const [isResending, setIsResending] = useState(false)
  const [resendCooldown, setResendCooldown] = useState(initialResendCooldown)
  const [retryWait, setRetryWait] = useState(0)
  const countingDown = resendCooldown > 0 || retryWait > 0

  useEffect(() => {
    if (!countingDown) return
    const timer = window.setInterval(() => {
      setResendCooldown((seconds) => Math.max(0, seconds - 1))
      setRetryWait((seconds) => Math.max(0, seconds - 1))
    }, 1000)
    return () => window.clearInterval(timer)
  }, [countingDown])

  const showError = (error: unknown) => {
    setInvalidCode(error instanceof AuthHttpError && [400, 401, 403, 410, 422].includes(error.status))
    addToast({
      title: 'Verification failed',
      description: error instanceof AuthHttpError ? error.message : typeof error === 'string' ? error : 'Unable to connect. Please try again.',
      color: 'danger',
      timeout: 5000,
      shouldShowTimeoutProgress: true,
    })
    if (error instanceof AuthHttpError && error.status === 429) setRetryWait(retryDelay(error.retryAfter))
  }

  const onInputOTPChange = async (value: string) => {
    setCode(value)
    setInvalidCode(false)
    if (value.length !== 6 || pending || retryWait > 0) return
    if (!email) {
      showError('Email is missing or invalid. Please restart from login or request a new reset code.')
      return
    }
    if (type === 'register') {
      const input = VerifyEmailInputSchema.safeParse({ email, code: value })
      if (!input.success) {
        showError(input.error.issues[0].message)
        return
      }
      setPending(true)
      await ubtvAuthApi
        .verifyEmail(input.data)
        .then(() => {
          addToast({
            title: 'Email verified',
            description: 'Your email has been verified. Please log in.',
            timeout: 3000,
            shouldShowTimeoutProgress: true,
            color: 'success',
          })
          router.push(`/successful-email-verification?${new URLSearchParams({ email: input.data.email })}`)
          router.refresh()
        })
        .catch(showError)
        .finally(() => setPending(false))
    } else {
      const input = VerifyResetPasswordInputSchema.safeParse({ email, code: value })
      if (!input.success) {
        showError(input.error.issues[0].message)
        return
      }
      setPending(true)
      await ubtvAuthApi
        .verifyResetPassword(input.data)
        .then(({ data }) => {
          if (!data.resetToken) throw new Error('Invalid response from authentication API')
          addToast({
            title: 'OTP',
            description: 'Confirm reset password OTP successfully!',
            timeout: 3000,
            shouldShowTimeoutProgress: true,
            color: 'success',
          })
          router.replace(`/reset-password?${new URLSearchParams({ email: input.data.email, token: data.resetToken })}`)
          router.refresh()
        })
        .catch(showError)
        .finally(() => setPending(false))
    }
  }

  const resend = async () => {
    if (pending || resendCooldown > 0 || retryWait > 0) return
    const input = ResendVerificationInputSchema.safeParse({ email })
    if (!input.success) {
      showError(input.error.issues[0].message)
      return
    }
    setPending(true)
    setIsResending(true)
    setInvalidCode(false)
    try {
      if (type === 'register') {
        await ubtvAuthApi.resendVerification(input.data)
      } else {
        await ubtvAuthApi.forgotPassword(input.data)
        setCode('')
      }
      setResendCooldown(60)
      addToast({
        title: type === 'register' ? 'Verification request received' : 'Password reset request received',
        description: type === 'register' ? 'If your account is eligible, a verification email may be sent. Please check your inbox and spam folder.' : 'If your account is eligible, a reset code may be sent. Please check your inbox and spam folder.',
        color: 'default',
      })
    } catch (error) {
      showError(error)
    } finally {
      setPending(false)
      setIsResending(false)
    }
  }

  return (
    <div className='flex flex-col items-center w-full mt-6'>
      {type === 'resetpassword' && <p className='mb-6 text-sm text-muted-foreground text-center'>The code expires after 10 minutes. You have up to 5 incorrect attempts.</p>}
      <InputOtp
        as='label'
        aria-label='Verification code'
        autoFocus
        length={6}
        inputMode='numeric'
        autoComplete='one-time-code'
        variant='flat'
        validationBehavior='aria'
        errorMessage={() => null}
        isDisabled={pending || retryWait > 0}
        isInvalid={invalidCode}
        value={code}
        onValueChange={onInputOTPChange}
        size='lg'
      />
      {retryWait > 0 && (
        <p role='status' className='mt-2 text-sm text-muted-foreground'>
          Try again in {retryWait}s.
        </p>
      )}
      <p className='text-muted-foreground mt-6'>
        Didn't receive the email?{' '}
        <ShadcnButton className='p-0' variant='link' disabled={pending || resendCooldown > 0 || retryWait > 0 || !email} aria-busy={isResending} onClick={resend}>
          {resendCooldown > 0 ? `Resend in ${resendCooldown}s` : 'Click to resend'}
          {isResending && <Spinner className='ml-2' aria-hidden='true' />}
        </ShadcnButton>
      </p>
      {type === 'resetpassword' && (
        <ShadcnButton onClick={() => router.replace('/forgot-password')} variant='link' className='mt-2' disabled={pending}>
          Use a different email or restart
        </ShadcnButton>
      )}
      <ShadcnButton onClick={() => router.push('/login')} variant='linkHover2' className='mt-2'>
        <ArrowLeft size={16} style={{ marginRight: 8 }} />
        Back to Login
      </ShadcnButton>
    </div>
  )
}

export default EmailVerificationForm
