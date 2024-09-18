import { AdminFooter } from '@/app/doctor/Menu/AdminFooter'
import AdminHeader from '@/app/doctor/Menu/AdminHeader'

import authOptions from '@/app/api/auth/[...nextauth]'
import { getServerSession } from 'next-auth/next'
import { redirect } from 'next/navigation'

import '@/app/globals.css'
import type { SessionUser } from '@/utils/type'

export default async function DoctorLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  const session = await getServerSession(authOptions)
  const user = session?.user as SessionUser
  if (!user) {
    redirect('/top?role=doctor')
  }
  if (user.role !== 'admin' && user.role !== 'doctor') {
    redirect('/home')
  }
  return (
    <div className="min-h-screen w-full min-w-[1024px]">
      <>
        <AdminHeader session={session} />
        <div className="overflow-auto">
          <div className="w-full">{children}</div>
        </div>
        <AdminFooter />
      </>
    </div>
  )
}
