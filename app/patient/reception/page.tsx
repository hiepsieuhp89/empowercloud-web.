import authOptions from '@/app/api/auth/[...nextauth]'
import PatientLayout from '@/components/layout/PatientLayout'
import { getServerSession } from 'next-auth/next'
import 'server-only'
import ReceptionList from './ReceptionList'

const ReceptionScreen: React.FC = async () => {
  const session = await getServerSession(authOptions)
  return (
    <PatientLayout>
      <ReceptionList session={session} />
    </PatientLayout>
  )
}

export default ReceptionScreen
