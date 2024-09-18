'use client'
import { zodResolver } from '@hookform/resolvers/zod'
import React, { useCallback, useEffect, useState } from 'react'
import type { SubmitHandler } from 'react-hook-form'
import { useForm } from 'react-hook-form'

import { z } from 'zod'

import { getCsrfToken, signIn } from 'next-auth/react'

import type { Session } from 'next-auth'
import { redirect, useRouter, useSearchParams } from 'next/navigation'

import type { SessionUser } from '@/utils/type'
import Image from 'next/image'
import lineButton from '../../public/line/btn_login_base.png'

const basicFormSchema = z.object({
  email: z.string().email('Invalid email address'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
})

export interface Inputs {
  email: string
  password: string
}

interface LoginFormParams {
  session: Session | null
}

const LoginForm: React.FC<LoginFormParams> = ({ session }) => {
  const { handleSubmit, register } = useForm<Inputs>({
    resolver: zodResolver(basicFormSchema),
  })

  const user = session?.user as SessionUser
  if (user) {
    redirect('/home')
  }

  const [csrfToken, setCsrfToken] = useState('')
  const [errorMessage, setErrorMessage] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [isLoading, setIsLoading] = useState(false)

  const router = useRouter()
  const params = useSearchParams()
  const role = params.get('role') ?? 'admin'

  useEffect(() => {
    getCsrfToken().then((token) => {
      setCsrfToken(token || '')
    })
  }, [])

  const onSubmit: SubmitHandler<Inputs> = async (data: Inputs) => {
    setErrorMessage('')
    setIsLoading(true)
    try {
      const res = await signIn('credentials', {
        redirect: false,
        email: data.email,
        password: data.password,
        role,
      })

      setIsLoading(false)

      if (res?.status == 200) {
        if (role == 'admin') {
          router.push(`/doctor/reception?role=${role}`)
        } else {
          router.push(`/home?role=${role}`)
        }
      } else if (res?.error) {
        if (res.status == 401) {
          setErrorMessage('メールとパスワードが違います。')
        } else {
          setErrorMessage(res?.error)
        }
      } else {
        setErrorMessage('Something wrong! Please try again')
      }
    } catch (err) {
      setIsLoading(false)
      // Handle errors, such as displaying a login failure message
      setErrorMessage('Something wrong! Please try again')
    }
  }

  const handleFogotPassword = useCallback(() => {
    router.push(`/forgot?role=${role}`)
  }, [role, router])

  const handleBackTop = useCallback(() => {
    router.push(`/top?role=${role}`)
  }, [role, router])

  const loginLine = useCallback(async () => {
    void signIn('line', {
      callbackUrl: '/home',
    })
  }, [])

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword)
  }

  return (
    <div
      className={`block ${role == 'admin' ? 'bg-background-white' : 'bg-primary-client'} rounded-3xl border p-8 shadow-md`}
    >
      {isLoading && (
        <div className="absolute left-0 top-0 z-40 flex size-full items-center justify-center bg-gray-900/50">
          <div className="size-20 animate-spin rounded-full border-y-2 border-white"></div>
        </div>
      )}

      <form onSubmit={handleSubmit(onSubmit)} className="mt-8 font-normal">
        <input name="csrfToken" type="hidden" defaultValue={csrfToken} />
        {errorMessage && (
          <div className="w-full text-red-500">{errorMessage}</div>
        )}
        <label className="font-bold">ユーザー名</label>
        <input
          {...register('email')}
          className="mb-4 mt-2 block h-12 w-full rounded-xl border border-background-gray p-4"
        />
        <label className="font-bold">パスワード</label>
        <div className="relative mb-4 mt-2">
          <input
            {...register('password')}
            type={showPassword ? 'text' : 'password'}
            className="block h-12 w-full rounded-xl border border-background-gray p-4"
          />
          <button
            type="button"
            onClick={togglePasswordVisibility}
            className="absolute inset-y-0 right-0 px-3 py-2 text-gray-500"
          >
            {showPassword ? (
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                fill="currentColor"
                className="size-6"
              >
                <path d="M12 15a3 3 0 1 0 0-6 3 3 0 0 0 0 6Z" />
                <path
                  fillRule="evenodd"
                  d="M1.323 11.447C2.811 6.976 7.028 3.75 12.001 3.75c4.97 0 9.185 3.223 10.675 7.69.12.362.12.752 0 1.113-1.487 4.471-5.705 7.697-10.677 7.697-4.97 0-9.186-3.223-10.675-7.69a1.762 1.762 0 0 1 0-1.113ZM17.25 12a5.25 5.25 0 1 1-10.5 0 5.25 5.25 0 0 1 10.5 0Z"
                  clipRule="evenodd"
                />
              </svg>
            ) : (
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                fill="currentColor"
                className="size-6"
              >
                <path d="M12 15a3 3 0 1 0 0-6 3 3 0 0 0 0 6Z" />
                <path
                  fillRule="evenodd"
                  d="M1.323 11.447C2.811 6.976 7.028 3.75 12.001 3.75c4.97 0 9.185 3.223 10.675 7.69.12.362.12.752 0 1.113-1.487 4.471-5.705 7.697-10.677 7.697-4.97 0-9.186-3.223-10.675-7.69a1.762 1.762 0 0 1 0-1.113ZM17.25 12a5.25 5.25 0 1 1-10.5 0 5.25 5.25 0 0 1 10.5 0Z"
                  clipRule="evenodd"
                />
              </svg>
            )}
          </button>
        </div>
        <div className="m-4 h-6 text-center">
          <button
            className="mx-auto text-center text-sm text-background-bold"
            type="button"
            onClick={handleFogotPassword}
          >
            パスワードを忘れた場合
          </button>
        </div>
        <div>
          <button
            type="button"
            onClick={handleBackTop}
            className={`focus:shadow-outline
            h-full w-32 rounded-xl border-2 border-primary-admin bg-white px-4 
            py-2 text-black focus:outline-none`}
          >
            戻る
          </button>
          <button
            type="submit"
            className={`${role == 'admin' ? 'bg-background-bold' : 'bg-background-bold'} 
            focus:shadow-outline border-background-blue ml-14 h-full w-32 rounded-xl border-2 px-4
            py-2 text-white focus:outline-none`}
          >
            ログイン
          </button>
        </div>
      </form>
      <div className="mt-6 border-t-2">
        <div className="pt-6 text-center">
          <button
            onClick={loginLine}
            className="mx-auto text-center text-sm text-background-bold"
          >
            <Image src={lineButton} alt="" className="size-full" />
          </button>
        </div>
      </div>
    </div>
  )
}

export default LoginForm
