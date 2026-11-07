'use client'
import { LockKeyhole } from 'lucide-react'
import { useSearchParams } from 'next/navigation'
import React from 'react'

import ResetPasswordForm from '@/app/(unauth)/reset-password/reset-password-form'
import UnAuthTemplate from '@/app/(unauth)/template'
import { ForgotPasswordInputSchema } from '@/schema/auth-api.schema'

const ForgotPasswordPage = () => {
  const searchParams = useSearchParams()
  const parsedEmail = ForgotPasswordInputSchema.safeParse({ email: searchParams.get('email') || '' })
  const email = parsedEmail.success ? parsedEmail.data.email : ''
  const resetToken = searchParams.get('token') || ''
  return (
    <UnAuthTemplate
      icon={<LockKeyhole />}
      title='Set new password'
      description={
        <>
          Set your new password within 10 minutes. <br /> You will need to log in again after resetting it.
        </>
      }
    >
      <ResetPasswordForm key={`${email}:${resetToken}`} email={email} resetToken={resetToken} />
    </UnAuthTemplate>
  )
}

export default ForgotPasswordPage
