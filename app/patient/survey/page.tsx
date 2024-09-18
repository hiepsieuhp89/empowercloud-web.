import authOptions from '@/app/api/auth/[...nextauth]'
import { getServerSession } from 'next-auth/next'
import 'server-only'
import SurveyComponent from './SurveyComponent'

const SurveyScreen: React.FC = async () => {
  const session = await getServerSession(authOptions)
  return (
    <>
      <SurveyComponent session={session} />
    </>
  )
}

export default SurveyScreen
