'use client'
import { redirect, useRouter, useSearchParams } from 'next/navigation'
import React, { useCallback, useEffect, useState } from 'react'

import CommonModal from '@/components/CommonModal'
import type { Patient } from '@/gen/proto/v1/patient_pb'
import { addLineUser, removeLineUser, userInfo } from '@/server/patient'
import { loginLine } from '@/server/verify'
import type { SessionUser } from '@/utils/type'
import type { Session } from 'next-auth'
import { signOut } from 'next-auth/react'

interface HomeScreenParams {
  session: Session | null
}

const HomeScreenComponent: React.FC<HomeScreenParams> = ({ session }) => {
  const router = useRouter()
  const user = session?.user as SessionUser
  const role = user.role ?? 'patient'
  const [errorMessage, setErrorMessage] = useState('')
  const [modalIsOpen, setModalIsOpen] = useState(false)

  const params = useSearchParams()
  const lineCode = params.get('code') ?? ''
  const lineState = params.get('state') ?? ''

  const [patient, setPatient] = useState<Patient>()

  const removeLine = useCallback(async () => {
    try {
      const p = await removeLineUser()
      setPatient(p)
      setErrorMessage('LINEを解除できました。')
      setModalIsOpen(true)
    } catch (e) {
      setErrorMessage('LINEを解除できません。')
      setModalIsOpen(true)
    }
  }, [setModalIsOpen, setErrorMessage, setPatient])

  const closeModal = useCallback(() => {
    setModalIsOpen(false)
    setErrorMessage('')
  }, [setModalIsOpen, setErrorMessage])

  const signOutHandle = useCallback(async () => {
    await signOut({ redirect: false })
    router.push(`/top?role=${role}`)
  }, [router, role])

  const showReceptionList = useCallback(async () => {
    router.push(`/patient/reception`)
  }, [router])

  if (user.role == 'admin' || user.role == 'doctor') {
    redirect(`/doctor/reception?role=${user.role}`)
  }

  const fetchInfo = useCallback(async () => {
    const patient = await userInfo()
    setPatient(patient)
  }, [setPatient])

  useEffect(() => {
    fetchInfo()
  }, [fetchInfo])

  const updateLineCode = useCallback(async () => {
    if (!patient?.lineId && lineCode && lineState) {
      try {
        await addLineUser(lineCode, lineState)
        setErrorMessage('LINE連携できました。')
        setModalIsOpen(true)
      } catch (e) {
        setErrorMessage('LINE連携できませんでした。')
        setModalIsOpen(true)
      }
      router.push('/home')
    }
  }, [patient, lineCode, lineState, router])

  useEffect(() => {
    updateLineCode()
  }, [updateLineCode])

  const addLine = useCallback(async () => {
    const url = await loginLine()
    window.location.href = url
  }, [])
  return (
    session && (
      <div className="justify-center">
        <div>Welcome {`${session?.user?.email}`}</div>
        {patient && patient.lineId && (
          <button
            onClick={removeLine}
            className="focus:shadow-outline m-4 size-full rounded-full border-2 bg-white px-4 py-2 text-black focus:outline-none"
          >
            LINE解除
          </button>
        )}
        {patient && !patient.lineId && (
          <button
            onClick={addLine}
            className="focus:shadow-outline m-4 size-full rounded-full border-2 bg-white px-4 py-2 text-black focus:outline-none"
          >
            LINE連携
          </button>
        )}

        <button
          onClick={signOutHandle}
          className="focus:shadow-outline m-4 size-full rounded-full border-2 bg-white px-4 py-2 text-black focus:outline-none"
        >
          ログアウト
        </button>

        <button
          onClick={showReceptionList}
          className="focus:shadow-outline m-4 size-full rounded-full border-2 bg-white px-4 py-2 text-black focus:outline-none"
        >
          診療一覧
        </button>

        <CommonModal isOpen={modalIsOpen} onClose={closeModal}>
          <div>{errorMessage}</div>
        </CommonModal>
      </div>
    )
  )
}

export default HomeScreenComponent
