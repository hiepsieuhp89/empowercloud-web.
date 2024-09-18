import authOptions from '@/app/api/auth/[...nextauth]'
import DoctorLayout from '@/components/layout/DoctorLayout'
import { getServerSession } from 'next-auth/next'
import 'server-only'
import ReceptionList from './ReceptionList'

const ReceptionScreen: React.FC = async () => {
  const session = await getServerSession(authOptions)
  return (
    <DoctorLayout>
      <ReceptionList session={session} />
    </DoctorLayout>
  )
}

export default ReceptionScreen
