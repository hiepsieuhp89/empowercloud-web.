import MainLayout from '@/components/layout/MainLayout'
import React from 'react'
import 'server-only'
import HomeScreenComponent from './HomeScreen'

import authOptions from '@/app/api/auth/[...nextauth]'
import type { SessionUser } from '@/utils/type'
import { getServerSession } from 'next-auth/next'
import { redirect } from 'next/navigation'

const HomeScreen: React.FC = async () => {
  const session = await getServerSession(authOptions)
  const user = session?.user as SessionUser
  if (!user) {
    redirect('/top?role=doctor')
  }
  return (
    <MainLayout>
      <HomeScreenComponent session={session} />
    </MainLayout>
  )
}

export default HomeScreen
