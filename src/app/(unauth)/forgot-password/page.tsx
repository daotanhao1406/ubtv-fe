'use client'
import { KeyRoundIcon } from 'lucide-react'
import React from 'react'

import ForgotPasswordForm from '@/app/(unauth)/forgot-password/forgot-password-form'
import UnAuthTemplate from '@/app/(unauth)/template'

const ForgotPasswordPage = () => {
  return (
    <UnAuthTemplate icon={<KeyRoundIcon />} title='Forgot Password?' description='No worries, we’ll send you reset instructions.'>
      <ForgotPasswordForm />
    </UnAuthTemplate>
  )
}

export default ForgotPasswordPage
