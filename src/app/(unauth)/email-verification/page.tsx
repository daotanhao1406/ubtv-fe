'use client'
import { Mail } from 'lucide-react'
import { useSearchParams } from 'next/navigation'
import React from 'react'

import EmailVerificationForm from '@/app/(unauth)/email-verification/email-verification-form'
import UnAuthTemplate from '@/app/(unauth)/template'

const EmailVerificationPage = () => {
  const searchParams = useSearchParams()
  const email = searchParams.get('email') || ''
  const type = searchParams.get('type')
  return (
    <UnAuthTemplate
      icon={<Mail />}
      title='Check your email'
      description={
        <>
          We've sent you a {type === 'register' ? 'verification' : 'password reset'} code to <br /> <span className='font-bold'>{email}</span>
        </>
      }
    >
      <EmailVerificationForm />
    </UnAuthTemplate>
  )
}

export default EmailVerificationPage
