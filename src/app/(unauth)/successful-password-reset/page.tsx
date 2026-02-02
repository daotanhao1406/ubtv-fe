'use client'
import { Button as HeroButton } from '@heroui/react'
import { ArrowLeft, CircleCheck } from 'lucide-react'
import { useRouter } from 'next/navigation'
import React from 'react'

import UnAuthTemplate from '@/app/(unauth)/template'

const SuccessfulPasswordResetPage = () => {
  const router = useRouter()
  return (
    <UnAuthTemplate
      icon={<CircleCheck />}
      title='Password reset'
      description={
        <>
          Your password has been successfully reset. <br /> Click below to log in magically.
        </>
      }
    >
      <div className='flex flex-col items-center max-w-sm w-full mt-6'>
        <HeroButton
          onPress={() => {
            router.push('/login')
            router.refresh()
          }}
          color='primary'
          type='submit'
          className='w-full h-12 font-bold flex items-center justify-center'
        >
          <ArrowLeft size={16} />
          Back to Login
        </HeroButton>
      </div>
    </UnAuthTemplate>
  )
}

export default SuccessfulPasswordResetPage
