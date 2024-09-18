import { getServerSession } from 'next-auth'
import DoctorLayout from './DoctorLayout'

import authOptions from '@/app/api/auth/[...nextauth]'
import { SettingMenuBarComponent } from '@/app/doctor/settings/MenuBar'
import type { SessionUser } from '@/utils/type'
import { redirect } from 'next/navigation'
export default async function DoctorSettingLayout({
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
    <DoctorLayout>
      <SettingMenuBarComponent session={session} />
      <div className="block w-full lg:px-16">
        <div className="block w-full">{children}</div>
      </div>
    </DoctorLayout>
  )
}
