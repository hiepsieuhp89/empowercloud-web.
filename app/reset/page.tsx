import ResetPasswordForm from '@/app/reset/ResetPasswordForm'
import MainLayout from '@/components/layout/MainLayout'
import { getServerSession } from 'next-auth/next'
import authOptions from '../api/auth/[...nextauth]'

const ResetPassword: React.FC = async () => {
  const session = await getServerSession(authOptions)
  return (
    <MainLayout>
      <ResetPasswordForm session={session} />
    </MainLayout>
  )
}

export default ResetPassword
