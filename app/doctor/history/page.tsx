import authOptions from '@/app/api/auth/[...nextauth]'
import DoctorLayout from '@/components/layout/DoctorLayout'
import { getServerSession } from 'next-auth'
import HistoryList from './HistoryList'

const HistoryScreen: React.FC = async () => {
  const session = await getServerSession(authOptions)
  return (
    <DoctorLayout>
      <HistoryList session={session} />
    </DoctorLayout>
  )
}

export default HistoryScreen
