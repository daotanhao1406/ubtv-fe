'use client'
import { Mail } from 'lucide-react'
import React from 'react'

import EmailVerificationForm from '@/app/(unauth)/email-verification/email-verification-form'
import UnAuthTemplate from '@/app/(unauth)/template'

const EmailVerificationPage = () => {
  return (
    <UnAuthTemplate
      icon={<Mail />}
      title='Check your email'
      description={
        <>
          We've sent you a password reset code to <br /> <span className='font-bold'>abc@gmail.com</span>
        </>
      }
    >
      <EmailVerificationForm />
    </UnAuthTemplate>
  )
}

export default EmailVerificationPage
