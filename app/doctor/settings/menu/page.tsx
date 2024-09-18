import authOptions from '@/app/api/auth/[...nextauth]'
import DoctorSettingLayout from '@/components/layout/DoctorSettingLayout'
import { getServerSession } from 'next-auth'
import MenuList from './MenuList'

const InfoScreen: React.FC = async () => {
  const session = await getServerSession(authOptions)
  return (
    <DoctorSettingLayout>
      <MenuList session={session} />
    </DoctorSettingLayout>
  )
}

export default InfoScreen
