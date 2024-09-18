import authOptions from '@/app/api/auth/[...nextauth]'
import DoctorLayout from '@/components/layout/DoctorLayout'
import { getServerSession } from 'next-auth'
import ShiftDetail from './ShiftDetail'

const ShiftScreen: React.FC = async () => {
  const session = await getServerSession(authOptions)
  return (
    <DoctorLayout>
      <ShiftDetail session={session} />
    </DoctorLayout>
  )
}

export default ShiftScreen
