'use client'

import type { Patient } from '@/gen/proto/v1/patient_pb'
import { storePatient } from '@/server/patient'
import type { PatientInput } from '@/utils/type'
import { zodResolver } from '@hookform/resolvers/zod'
import React, { useState } from 'react'
import type { SubmitHandler } from 'react-hook-form'
import { useForm } from 'react-hook-form'
import Modal from 'react-modal'
import { z } from 'zod'

interface Props {
  setOpenDialog: React.Dispatch<React.SetStateAction<boolean>>
  openDialog: boolean
  patient?: Patient
}

const patientFormSchema = z.object({
  // id: z.union([z.number(), z.null(), z.string(), z.string().length(0)]),
  firstName: z.string().min(1, 'Name is required'),
  lastName: z.string().min(1, 'Name is required'),
  firstNameFurigana: z.string().min(1, 'Name is required'),
  lastNameFurigana: z.string().min(1, 'Name is required'),
  birthYear: z.string().refine((val) => !isNaN(Date.parse(val)), {
    message: 'Invalid date',
  }),
  phone: z.string().min(1, 'Name is required'),
  email: z.string().min(1, 'Name is required'),
  gender: z.string().min(1, 'Name is required'),
})

const AddPatientDialog: React.FC<Props> = ({
  setOpenDialog,
  openDialog,
  patient,
}) => {
  const [isLoading, setIsLoading] = useState(false)
  const { handleSubmit, register, reset } = useForm<PatientInput>({
    resolver: zodResolver(patientFormSchema),
  })

  const onClickFunction = () => {
    setOpenDialog(false)
  }

  const onSubmit: SubmitHandler<PatientInput> = async (data: PatientInput) => {
    try {
      data.id = patient?.id
      data.gender = Number(data.gender)
      setIsLoading(true)
      await storePatient(data)
      setOpenDialog(false)
      reset()
    } catch (err) {}
    setIsLoading(false)
  }

  return (
    <Modal
      isOpen={openDialog}
      onRequestClose={onClickFunction}
      contentLabel="Example Modal"
      overlayClassName="fixed inset-0 z-50 flex items-center justify-center "
      className="elative rounded-2xl bg-white shadow-lg"
    >
      <div
        className={`z-50 rounded-lg p-8 text-black ${patient ? 'bg-white' : 'bg-main-200'} min-w-[500px]`}
      >
        <div className="flex justify-end">
          <button
            onClick={onClickFunction}
            className="text-gray-500 hover:text-gray-700"
          >
            <svg
              className="size-6"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </button>
        </div>
        <form onSubmit={handleSubmit(onSubmit)} className="block">
          {isLoading && (
            <div className="absolute left-0 top-0 z-40 flex size-full items-center justify-center bg-gray-900/50">
              <div className="size-20 animate-spin rounded-full border-y-2 border-white"></div>
            </div>
          )}
          {/* <input
            type="hidden"
            {...register('id')}
            value={patient?.id ? Number(patient?.id) : 0}
          /> */}
          <div className="flex w-full px-16">
            <h1 className="mx-auto pb-2 text-xl font-bold">
              {' '}
              {patient?.id ? '患者編集' : '新規患者'}
            </h1>
          </div>
          <div className="mt-2  flex  w-full px-16">
            <div className="mt-2 block w-1/2  pr-16">
              <label className="w-full py-2">姓</label>
              <input
                className="w-full rounded p-2"
                {...register('firstName')}
                value={patient?.firstName}
              />
            </div>
            <div className="mt-2 block w-1/2  pl-16">
              <label className="w-full py-2">名</label>
              <input
                className="w-full rounded p-2"
                {...register('lastName')}
                value={patient?.lastName}
              />
            </div>
          </div>
          <div className="mt-2 flex  w-full px-16">
            <div className="mt-2 block w-1/2  pr-16">
              <label className="w-full py-2">セイ</label>
              <input
                className="w-full rounded p-2"
                {...register('firstNameFurigana')}
                value={patient?.firstNameFurigana}
              />
            </div>
            <div className="mt-2 block w-1/2  pl-16">
              <label className="w-full py-2">メイ</label>
              <input
                className="w-full rounded p-2"
                {...register('lastNameFurigana')}
                value={patient?.lastNameFurigana}
              />
            </div>
          </div>
          <div className="mt-2 flex  w-full px-16">
            <div className="block w-1/2 pr-16">
              <label className="w-full py-2">生年月日</label>
              <input
                className="w-full rounded p-2"
                type="date"
                {...register('birthYear')}
                value={patient?.birthYear}
              />
            </div>
            <div className="mt-2 flex w-1/2  pl-16">
              <label className="w-48 py-2">性別</label>
              <select
                className="w-full rounded p-2"
                {...register('gender')}
                value={patient?.gender || 0}
              >
                <option value={0}>その他</option>
                <option value={1}>男性</option>
                <option value={2}>女性</option>
              </select>
            </div>
          </div>

          <div className="mt-2 flex  w-full px-16">
            <div className="block w-1/2 pr-16">
              <label className="w-full py-2">Email</label>
              <input
                className="w-full rounded p-2"
                type="email"
                {...register('email')}
                value={patient?.email}
              />
            </div>
            <div className="mt-2 block w-1/2  pl-16">
              <label className="w-full py-2">電話番号</label>
              <input
                className="w-full rounded p-2"
                {...register('phone')}
                value={patient?.phone}
              />
            </div>
          </div>

          <div className="mt-4 flex w-full px-16">
            <button
              className="mr-8 w-32  rounded border-2 border-main-500 bg-white p-2 hover:bg-gray-400 hover:text-white"
              onClick={() => setOpenDialog(false)}
              type="button"
            >
              戻る
            </button>
            <button
              className="ml-8 w-32  rounded border-2 border-main-500 bg-main-400 p-2 hover:bg-blue-500 hover:text-white"
              type="submit"
            >
              確認
            </button>
          </div>
        </form>
      </div>
    </Modal>
  )
}

export { AddPatientDialog }
