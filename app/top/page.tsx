import React from 'react'

import MainLayout from '@/components/layout/MainLayout'
import { getServerSession } from 'next-auth/next'
import authOptions from '../api/auth/[...nextauth]'
import TopComponent from './TopComponent'

const TopScreen: React.FC = async () => {
  const session = await getServerSession(authOptions)
  return (
    <MainLayout>
      <TopComponent session={session} />
    </MainLayout>
  )
}

export default TopScreen
