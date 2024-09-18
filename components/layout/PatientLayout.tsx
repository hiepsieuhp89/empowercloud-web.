import authOptions from '@/app/api/auth/[...nextauth]'
import { getServerSession } from 'next-auth/next'
import { redirect } from 'next/navigation'

import '@/app/globals.css'
import { PatientFooter } from '@/app/patient/Menu/PatientFooter'
import PatientHeader from '@/app/patient/Menu/PatientHeader'
import type { SessionUser } from '@/utils/type'

export default async function PatientLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  const session = await getServerSession(authOptions)
  const user = session?.user as SessionUser
  if (!user) {
    redirect('/login?role=patient')
  }
  return (
    <div className="min-h-screen w-full min-w-[1024px]">
      <>
        <PatientHeader session={session} />
        <div className="overflow-auto">
          <div className="w-full">{children}</div>
        </div>
        <PatientFooter />
      </>
    </div>
  )
}
