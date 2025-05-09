'use client'
import { Button as HeroButton } from '@heroui/react'
import { ArrowLeft, CircleCheckBig } from 'lucide-react'
import { useRouter } from 'next/navigation'
import React from 'react'

import { Button as ShadcnButton } from '@/components/ui/button'

import UnAuthTemplate from '@/app/(unauth)/template'

const SuccessfulEmailVerificationPage = () => {
  const router = useRouter()

  return (
    <UnAuthTemplate
      icon={<CircleCheckBig />}
      title='Email verified'
      description={
        <>
          Your account has been successfully verified. <br /> Click below to login magically.
        </>
      }
    >
      <div className='flex flex-col items-center max-w-sm w-full mt-6'>
        <HeroButton color='primary' type='submit' className='w-full h-12 font-bold'>
          Continue
        </HeroButton>
        <ShadcnButton onClick={() => router.push('/login')} variant='linkHover2' className='mt-2'>
          <ArrowLeft size={16} style={{ marginRight: 8 }} />
          Back to Login
        </ShadcnButton>
      </div>
    </UnAuthTemplate>
  )
}

export default SuccessfulEmailVerificationPage
