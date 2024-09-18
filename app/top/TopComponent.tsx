'use client'
import { redirect, useRouter } from 'next/navigation'
import React, { useCallback } from 'react'

import FilledButton from '@/components/FilledButton'
import type { SessionUser } from '@/utils/type'
import type { Session } from 'next-auth'

interface Props {
  session: Session | null
}
const TopComponent: React.FC<Props> = ({ session }) => {
  const router = useRouter()

  const user = session?.user as SessionUser
  if (user) {
    redirect('/home')
  }

  const handleLoginClick = useCallback(
    (role: string) => {
      router.push(`/login?role=${role}`)
    },
    [router],
  )

  const handleRegisterClick = useCallback(() => {
    router.push(`/register?role=patient`)
  }, [router])

  return (
    <>
      <div className="justify-center">
        <FilledButton
          text="管理者でログイン"
          handleClick={() => handleLoginClick('admin')}
          className="mx-auto mt-4 h-16 max-w-52 justify-center"
          buttonClass="bg-primary-admin color-black w-full h-full py-2 px-4 rounded-full focus:outline-none focus:shadow-outline"
        />
        <FilledButton
          text="医師でログイン"
          handleClick={() => handleLoginClick('doctor')}
          className="mx-auto mt-4 h-16 max-w-52 justify-center"
          buttonClass="bg-primary-admin color-black w-full h-full py-2 px-4 rounded-full focus:outline-none focus:shadow-outline"
        />
        <FilledButton
          text="ユーザーでログイン"
          handleClick={() => handleLoginClick('patient')}
          className="mx-auto mt-4 h-16 max-w-52 justify-center"
          buttonClass="bg-primary-client color-black w-full h-full py-2 px-4 rounded-full focus:outline-none focus:shadow-outline"
        />
        <FilledButton
          text="新規登録"
          handleClick={handleRegisterClick}
          className="mx-auto mt-4 h-16 max-w-52 justify-center"
          buttonClass={`border-primary-client bg-white border-2 w-full h-full text-black py-2 px-4 
            rounded-full focus:outline-none focus:shadow-outline`}
        />
      </div>
    </>
  )
}

export default TopComponent
