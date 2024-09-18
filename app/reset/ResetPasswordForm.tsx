'use client'
import { zodResolver } from '@hookform/resolvers/zod'
import { useCallback, useEffect, useState } from 'react'
import type { SubmitHandler } from 'react-hook-form'
import { useForm } from 'react-hook-form'

import { confirmThePasswordResetFirebase } from '@/server/login'

import { z } from 'zod'

import { getCsrfToken } from 'next-auth/react'

import type { SessionUser } from '@/utils/type'
import type { Session } from 'next-auth'
import { redirect, useRouter, useSearchParams } from 'next/navigation'

const basicFormSchema = z.object({
  password: z.string(),
})

export interface Inputs {
  password: string
}

interface Props {
  session: Session | null
}

const ResetPasswordForm: React.FC<Props> = ({ session }) => {
  const user = session?.user as SessionUser
  if (user) {
    redirect('/home')
  }
  const { handleSubmit, register } = useForm<Inputs>({
    resolver: zodResolver(basicFormSchema),
  })

  const [csrfToken, setCsrfToken] = useState('')
  const [errorMessage, setErrorMessage] = useState('')

  const router = useRouter()
  const params = useSearchParams()
  const role = params.get('role') ?? 'admin'

  useEffect(() => {
    // Fetch the CSRF token asynchronously on component mount
    getCsrfToken().then((token) => {
      setCsrfToken(token || '')
    })
  }, [])

  useEffect(() => {
    if (session) {
      if (role == 'admin') {
        router.push(`/doctor/reception?role=${role}`)
      } else {
        router.push(`/home?role=${role}`)
      }
    }
  }, [session, role, router])

  const onSubmit: SubmitHandler<Inputs> = async (data: Inputs) => {
    try {
      const _res = await confirmThePasswordResetFirebase(
        params.get('code') || '',
        data.password,
      )

      router.push(`/top?role=${role}`)
    } catch (err) {
      // Handle errors, such as displaying a login failure message
      setErrorMessage('エラーが発生しました。')
    }
  }

  const handleBackTop = useCallback(() => {
    router.push(`/top?role=${role}`)
  }, [role, router])

  return (
    <div
      className={`block ${role == 'admin' ? 'bg-primary-admin' : 'bg-primary-client'} rounded-3xl p-8`}
    >
      <h1 className="w-full text-center text-2xl font-bold">
        パスワード再設定
      </h1>
      <form onSubmit={handleSubmit(onSubmit)} className="mt-8 font-black">
        <input name="csrfToken" type="hidden" defaultValue={csrfToken} />
        {errorMessage && (
          <div className="w-full text-red-500">{errorMessage}</div>
        )}
        {/* <label>Mã xác nhận</label>
        <input
          {...register('oobCode')}
          className="mb-4 mt-2 block h-12 w-full rounded-xl border border-black p-4 "
        /> */}
        <label>新しいパスワード</label>
        <input
          {...register('password')}
          type="password"
          className="mb-4 mt-2 block h-12 w-full rounded-xl border border-black p-4"
        />
        <div>
          <button
            type="button"
            onClick={handleBackTop}
            className={`focus:shadow-outline
            h-full w-32 rounded-full border-2 border-black bg-white px-4 
            py-2 text-black focus:outline-none`}
          >
            戻る
          </button>
          <button
            type="submit"
            className={`${role == 'admin' ? 'bg-primary-admin' : 'bg-primary-client'} 
            focus:shadow-outline ml-14 h-full w-32 rounded-full border-2 border-black px-4
            py-2 text-black focus:outline-none`}
          >
            設定
          </button>
        </div>
      </form>
      {/* <p>{token}</p> */}
    </div>
  )
}

export default ResetPasswordForm
