import authOptions from '@/app/api/auth/[...nextauth]'
import DoctorLayout from '@/components/layout/DoctorLayout'
import { getServerSession } from 'next-auth'
import 'server-only'
import CalendarList from './CalendarList'

const CalendarScreen: React.FC = async () => {
  const session = await getServerSession(authOptions)
  return (
    <DoctorLayout>
      <CalendarList session={session} />
    </DoctorLayout>
  )
}

export default CalendarScreen
