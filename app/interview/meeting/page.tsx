import '@/app/globals.css'
import { getServerSession } from 'next-auth/next'
import React from 'react'
import 'server-only'

import authOptions from '@/app/api/auth/[...nextauth]'
import type { SessionUser } from '@/utils/type'
import { redirect } from 'next/navigation'
import MeetingView from './MeetingView'
const CalendarScreen: React.FC = async () => {
  const session = await getServerSession(authOptions)
  const user = session?.user as SessionUser
  if (!user) {
    redirect('/top?role=client')
  }
  return (
    <main className="h-screen">
      <MeetingView session={session} />
    </main>
  )
}

export default CalendarScreen
