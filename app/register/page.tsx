import RegisterForm from '@/app/register/RegisterForm'
import MainLayout from '@/components/layout/MainLayout'
import { getServerSession } from 'next-auth/next'
import authOptions from '../api/auth/[...nextauth]'

const Register: React.FC = async () => {
  const session = await getServerSession(authOptions)
  return (
    <MainLayout>
      <RegisterForm session={session} />
    </MainLayout>
  )
}

export default Register
