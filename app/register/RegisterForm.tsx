'use client'
import { zodResolver } from '@hookform/resolvers/zod'
import { useCallback, useEffect, useState } from 'react'
import type { SubmitHandler } from 'react-hook-form'
import { useForm } from 'react-hook-form'

import { registerFirebase } from '@/server/login'

import { z } from 'zod'

import { getCsrfToken } from 'next-auth/react'

import { Patient } from '@/gen/proto/v1/patient_pb'
import type { SessionUser } from '@/utils/type'
import type { Session } from 'next-auth'
import { redirect, useRouter } from 'next/navigation'

const basicFormSchema = z.object({
  first_name: z.string().min(1, 'Name is required'),
  last_name: z.string().min(1, 'Name is required'),
  first_name_furigana: z.string().min(1, 'Name is required'),
  last_name_furigana: z.string().min(1, 'Name is required'),
  birth_day: z.string().refine((val) => !isNaN(Date.parse(val)), {
    message: 'Invalid date',
  }),
  phone: z.string().min(1, 'Name is required'),
  email: z.string().min(1, 'Name is required'),
  password: z.string().min(1, 'Name is required'),
  confirm_password: z.string().min(1, 'Name is required'),
  gender: z.string().min(1, 'Name is required'),
})

export interface Inputs {
  first_name: string
  last_name: string
  first_name_furigana: string
  last_name_furigana: string
  birth_day: string
  phone: string
  email: string
  password: string
  confirm_password: string
  gender: string
}

interface Props {
  session: Session | null
}

const RegisterForm: React.FC<Props> = ({ session }) => {
  const { handleSubmit, register } = useForm<Inputs>({
    resolver: zodResolver(basicFormSchema),
  })

  const user = session?.user as SessionUser
  if (user) {
    redirect('/home')
  }

  const [csrfToken, setCsrfToken] = useState('')
  const [errorMessage, setErrorMessage] = useState('')

  const router = useRouter()
  const role = 'patient'

  useEffect(() => {
    // Fetch the CSRF token asynchronously on component mount
    getCsrfToken().then((token) => {
      setCsrfToken(token || '')
    })
  }, [])

  const onSubmit: SubmitHandler<Inputs> = async (data: Inputs) => {
    try {
      await registerFirebase(
        new Patient({
          email: data.email,
          firstName: data.first_name,
          gender: Number(data.gender),
          birthYear: data.birth_day,
          lastName: data.last_name,
          firstNameFurigana: data.first_name,
          lastNameFurigana: data.last_name_furigana,
          phone: data.phone,
        }),
        data.password,
      )
      router.push(`/top?role=${role}`)
    } catch (err) {
      // Handle errors, such as displaying a login failure message
      setErrorMessage('Something wrong! Please try again')
    }
  }

  const handleBackTop = useCallback(() => {
    router.push(`/top?role=${role}`)
  }, [role, router])

  return (
    <div className="block rounded-3xl bg-primary-admin px-8">
      <form onSubmit={handleSubmit(onSubmit)} className="font-black">
        <div className="flex w-full px-16 py-2">
          <h1 className="mx-auto pb-2 text-xl font-bold">新規予約</h1>
        </div>

        <input name="csrfToken" type="hidden" defaultValue={csrfToken} />
        {errorMessage && (
          <div className="w-full text-red-500">{errorMessage}</div>
        )}

        <div className="mt-2  flex  w-full px-16">
          <div className="mt-2 flex  w-1/2 pr-16">
            <label className="w-48 py-2 ">姓</label>
            <input className="w-full rounded p-2" {...register('first_name')} />
          </div>
          <div className="mt-2 flex w-1/2  pl-16">
            <label className="w-48 py-2">名</label>
            <input className="w-full rounded p-2" {...register('last_name')} />
          </div>
        </div>
        <div className="mt-2 flex w-full px-16">
          <div className="mt-2 flex w-1/2  pr-16">
            <label className="w-48 py-2">セイ</label>
            <input
              className="w-full rounded p-2"
              {...register('first_name_furigana')}
            />
          </div>
          <div className="mt-2 flex w-1/2  pl-16">
            <label className="w-48 py-2">メイ</label>
            <input
              className="w-full rounded p-2"
              {...register('last_name_furigana')}
            />
          </div>
        </div>
        <div className="mt-2 flex w-full  px-16">
          <div className="mt-2 flex w-1/2  pr-16">
            <label className="w-48 py-2">生年月日</label>
            <input
              className="w-full rounded p-2"
              type="date"
              {...register('birth_day')}
            />
          </div>
          <div className="mt-2 flex w-1/2  pl-16">
            <label className="w-48 py-2">性別</label>
            <select className="w-full rounded p-2" {...register('gender')}>
              <option value={0}>その他</option>
              <option value={1}>男性</option>
              <option value={2}>女性</option>
            </select>
          </div>
        </div>

        <div className="mt-2 flex w-full  px-16">
          <div className="mt-2 flex w-1/2  pr-16">
            <label className="w-48 py-2">電話番号</label>
            <input className="w-full rounded p-2" {...register('phone')} />
          </div>
          <div className="mt-2 flex w-1/2  pl-16">
            <label className="w-48 py-2">Email</label>
            <input {...register('email')} className="w-full rounded p-2" />
          </div>
        </div>

        <div className="mt-2 flex w-full  px-16">
          <div className="mt-2 flex w-1/2  pr-16">
            <label className="w-48 py-2">パスワード</label>
            <input
              {...register('password')}
              type="password"
              className="w-full rounded p-2"
            />
          </div>
          <div className="mt-2 flex w-1/2  pl-16">
            <label className="w-48 py-2">パスワード確認</label>
            <input
              {...register('confirm_password')}
              type="password"
              className="w-full rounded p-2"
            />
          </div>
        </div>
        <div className="p-4 px-16 text-center">
          <button
            type="button"
            onClick={handleBackTop}
            className="mr-8 w-48  rounded border-2 border-main-500 bg-white p-2 hover:bg-gray-400 hover:text-white"
          >
            戻る
          </button>
          <button
            type="submit"
            className="ml-8 w-48  rounded border-2 border-main-500 bg-main-400 p-2 hover:bg-blue-500 hover:text-white"
          >
            登録
          </button>
        </div>
      </form>
      {/* <p>{token}</p> */}
    </div>
  )
}

export default RegisterForm
