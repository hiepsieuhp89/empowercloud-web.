import authOptions from '@/app/api/auth/[...nextauth]'
import LoginForm from '@/app/login/LoginForm'
import MainLayout from '@/components/layout/MainLayout'
import { getServerSession } from 'next-auth/next'

const Login: React.FC = async () => {
  const session = await getServerSession(authOptions)
  return (
    <MainLayout>
      <LoginForm session={session} />
    </MainLayout>
  )
}

export default Login
