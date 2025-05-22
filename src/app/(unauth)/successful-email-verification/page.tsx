'use client'
import { Button as HeroButton } from '@heroui/react'
import { CircleCheckBig } from 'lucide-react'
import { useRouter } from 'next/navigation'
import React from 'react'

import UnAuthTemplate from '@/app/(unauth)/template'

const SuccessfulEmailVerificationPage = () => {
  const router = useRouter()
  return (
    <UnAuthTemplate
      icon={<CircleCheckBig />}
      title='Email verified'
      description={
        <>
          Your account has been successfully verified. <br /> Click below to enjoy your cinematic experience.
        </>
      }
    >
      <div className='flex flex-col items-center max-w-sm w-full mt-6'>
        <HeroButton
          onPress={() => {
            router.push('/')
            router.refresh()
          }}
          color='primary'
          type='submit'
          className='w-full h-12 font-bold'
        >
          Start to explore
        </HeroButton>
      </div>
    </UnAuthTemplate>
  )
}

export default SuccessfulEmailVerificationPage
