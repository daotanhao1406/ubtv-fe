'use client'
import { LockKeyhole } from 'lucide-react'
import React from 'react'

import ResetPasswordForm from '@/app/(unauth)/reset-password/reset-password-form'
import UnAuthTemplate from '@/app/(unauth)/template'

const ForgotPasswordPage = () => {
  return (
    <UnAuthTemplate
      icon={<LockKeyhole />}
      title='Set new password'
      description={
        <>
          Your new password must be different to <br /> previously used passwords
        </>
      }
    >
      <ResetPasswordForm />
    </UnAuthTemplate>
  )
}

export default ForgotPasswordPage
