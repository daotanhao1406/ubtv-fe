'use client'

import { Button, Card, CardBody, CardFooter, CardHeader, Chip, Input } from '@heroui/react'

import { useAuth } from '@/providers/AuthProvider'

const ProfilePage = () => {
  const { user, restoreSession } = useAuth()
  if (!user) return null

  return (
    <Card as='section' className='mx-auto my-10 w-full max-w-xl'>
      <CardHeader>
        <h1 className='text-2xl font-bold'>My profile</h1>
      </CardHeader>
      <CardBody className='gap-4'>
        <Input label='Name' value={user.name} isReadOnly />
        <Input label='Email' type='email' value={user.email} isReadOnly />
        <Chip color={user.emailVerified ? 'success' : 'warning'} variant='flat'>
          {user.emailVerified ? 'Email verified' : 'Email not verified'}
        </Chip>
      </CardBody>
      <CardFooter>
        <Button variant='flat' onPress={restoreSession}>
          Refresh profile
        </Button>
      </CardFooter>
    </Card>
  )
}

export default ProfilePage
