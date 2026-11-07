'use client'
import { Mail } from 'lucide-react'
import { useSearchParams } from 'next/navigation'
import React from 'react'

import EmailVerificationForm from '@/app/(unauth)/email-verification/email-verification-form'
import UnAuthTemplate from '@/app/(unauth)/template'
import { ForgotPasswordInputSchema } from '@/schema/auth-api.schema'

const EmailVerificationPage = () => {
  const searchParams = useSearchParams()
  const parsedEmail = ForgotPasswordInputSchema.safeParse({ email: searchParams.get('email') || '' })
  const email = parsedEmail.success ? parsedEmail.data.email : ''
  const type = searchParams.get('type') === 'register' ? 'register' : 'resetpassword'
  const initialResendCooldown = (type === 'register' && searchParams.get('registered') === 'true') || (type === 'resetpassword' && searchParams.get('sent') === 'true') ? 60 : 0
  return (
    <UnAuthTemplate
      icon={<Mail />}
      title='Check your email'
      description={
        <>
          {type === 'register' ? 'Enter the verification code for' : "We've sent you a password reset code to"} <br /> <span className='font-bold'>{email}</span>
        </>
      }
    >
      <EmailVerificationForm key={`${type}:${email}:${initialResendCooldown}`} email={email} type={type} initialResendCooldown={initialResendCooldown} />
    </UnAuthTemplate>
  )
}

export default EmailVerificationPage
