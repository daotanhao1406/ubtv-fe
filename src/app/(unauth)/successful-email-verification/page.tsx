'use client'
import { Button as HeroButton } from '@heroui/react'
import { CircleCheck } from 'lucide-react'
import { useRouter, useSearchParams } from 'next/navigation'
import React from 'react'

import UnAuthTemplate from '@/app/(unauth)/template'

const SuccessfulEmailVerificationPage = () => {
  const router = useRouter()
  const email = useSearchParams().get('email')
  return (
    <UnAuthTemplate
      icon={<CircleCheck />}
      title='Email verified'
      description={
        <>
          Your account has been successfully verified. <br /> Log in to continue.
        </>
      }
    >
      <div className='flex flex-col items-center max-w-sm w-full mt-6'>
        <HeroButton
          onPress={() => {
            router.push(email ? `/login?${new URLSearchParams({ email })}` : '/login')
            router.refresh()
          }}
          color='primary'
          type='submit'
          className='w-full h-12 font-bold'
        >
          Continue to Login
        </HeroButton>
      </div>
    </UnAuthTemplate>
  )
}

export default SuccessfulEmailVerificationPage
