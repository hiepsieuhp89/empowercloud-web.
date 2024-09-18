import authOptions from '@/app/api/auth/[...nextauth]'
import DoctorSettingLayout from '@/components/layout/DoctorSettingLayout'
import type { SessionUser } from '@/utils/type'
import { getServerSession } from 'next-auth'
import { redirect } from 'next/navigation'
import InfoDetail from './InfoDetail'

const InfoScreen: React.FC = async () => {
  const session = await getServerSession(authOptions)
  const user = session?.user as SessionUser
  if (!user) {
    redirect('/top?role=doctor')
  }
  return (
    <DoctorSettingLayout>
      <InfoDetail session={session} />
    </DoctorSettingLayout>
  )
}

export default InfoScreen
