import authOptions from '@/app/api/auth/[...nextauth]'
import '@/app/globals.css'
import type { SessionUser } from '@/utils/type'
import { getServerSession } from 'next-auth/next'
import { redirect } from 'next/navigation'
import React from 'react'
import 'server-only'
import PreparationView from './PreparationView'

const CalendarScreen: React.FC = async () => {
  const session = await getServerSession(authOptions)
  const user = session?.user as SessionUser
  if (!user) {
    redirect('/top?role=client')
  }

  return (
    <main>
      <PreparationView session={session} />
    </main>
  )
}

export default CalendarScreen
