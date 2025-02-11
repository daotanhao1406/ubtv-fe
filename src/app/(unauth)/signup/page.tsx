'use client'
import React from 'react'

import SignUpForm from '@/app/(unauth)/signup/signup-form'
import UnAuthTemplate from '@/app/(unauth)/template'

const SignUpPage = () => {
  return (
    <UnAuthTemplate title='Create an Account' description="Let's get started with a new account in Utopia Bros">
      <SignUpForm />
    </UnAuthTemplate>
  )
}

export default SignUpPage
