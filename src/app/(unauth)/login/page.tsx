'use client'
import React from 'react'

import LoginForm from '@/app/(unauth)/login/login-form'
import UnAuthTemplate from '@/app/(unauth)/template'

const LoginPage = () => {
  return (
    <UnAuthTemplate title='Login to Your Account' description='Log in to enjoy unlimited entertainment. Your cinematic world at your fingertips.'>
      <LoginForm />
    </UnAuthTemplate>
  )
}

export default LoginPage
