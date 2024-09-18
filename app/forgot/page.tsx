import ForgotPasswordForm from '@/app/forgot/ForgotPasswordForm'
import MainLayout from '@/components/layout/MainLayout'
import { getServerSession } from 'next-auth/next'
import authOptions from '../api/auth/[...nextauth]'

const ForgotPassword: React.FC = async () => {
  const session = await getServerSession(authOptions)
  return (
    <MainLayout>
      <ForgotPasswordForm session={session} />
    </MainLayout>
  )
}

export default ForgotPassword
