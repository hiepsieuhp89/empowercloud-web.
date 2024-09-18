'use client'
import React, { useCallback, useEffect, useState } from 'react'

import CheckoutList from '@/components/CheckList'
import CommonModal from '@/components/CommonModal'
import type { Questionaire } from '@/gen/proto/v1/questionaire_pb'
import { detailQuestionaire } from '@/server/questionaire'
import { receptionDetail } from '@/server/reception'
import type { SessionUser } from '@/utils/type'
import type { Session } from 'next-auth'
import { useRouter, useSearchParams } from 'next/navigation'

interface Props {
  session: Session | null
}

const PreparationView: React.FC<Props> = ({ session }) => {
  const router = useRouter()
  const params = useSearchParams()

  const currentUser = session?.user as SessionUser

  const role = currentUser.role ?? 'patient'

  const roomId = params.get('iv') ?? '1'
  const [questionaire, setQuestionaire] = useState<Questionaire>()
  const [showQuestion, setShowQuestion] = useState(false)
  const [patientId, setPatientId] = useState<number>(0)
  const [receptionId, setReceptionId] = useState<number>(0)
  const [clinicId, setClinicId] = useState<number>(0)

  const handleStartMeeting = useCallback(() => {
    if (role == 'patient' && !questionaire) {
      setShowQuestion(true)
    } else {
      router.push(`/interview/meeting?role=${role}&iv=${roomId}`)
    }
  }, [role, router, roomId, questionaire, setShowQuestion])

  useEffect(() => {
    // Function to fetch data
    const fetchData = async () => {
      try {
        const _res = await detailQuestionaire(Number(roomId))
        console.log(_res)
        setQuestionaire(_res.questionaire)
      } catch (error) {
        console.error('Error fetching data:', error)
      }
    }

    // Call fetchData when component mounts
    fetchData()
  }, [roomId, showQuestion])

  useEffect(() => {
    // Function to fetch data
    const fetchData = async () => {
      try {
        const _reception = await receptionDetail(Number(roomId))
        console.log(_reception)
        setPatientId(Number(_reception?.patient?.id))
        setReceptionId(Number(_reception?.id))
        setClinicId(Number(_reception?.clinicId))
      } catch (error) {
        console.error('Error fetching data:', error)
      }
    }

    // Call fetchData when component mounts
    fetchData()
  }, [roomId])

  return (
    <>
      <div className="flex items-center justify-center bg-main-150">
        <div className="mx-auto flex h-screen items-center justify-center">
          <img
            src={
              role == 'patient'
                ? '/interview_client.png'
                : '/interview_admin.jpeg'
            }
            className="inset-0 flex h-3/5 items-center justify-center"
            alt=""
          />
          <div className="absolute inset-0 flex size-full items-center justify-center">
            <div className="block rounded-3xl bg-white/50 p-8">
              <div className="mx-auto block items-center justify-center text-center text-3xl font-bold text-gray-700">
                接続準備ができました。診察を開始してください。
              </div>
              <div className="flex w-full text-4xl">
                <button
                  className="mx-auto mt-8 w-96 rounded-xl bg-main-500 p-4 text-white"
                  onClick={handleStartMeeting}
                >
                  {role == 'patient' && !questionaire
                    ? '問診票入力'
                    : '診察を開始する'}
                </button>
              </div>
              {role == 'patient' && questionaire && (
                <div className="flex w-full text-4xl">
                  <button
                    className="mx-auto mt-8 w-96 rounded-xl text-sm text-black"
                    onClick={() => {
                      setShowQuestion(true)
                    }}
                  >
                    問診票を確認
                  </button>
                </div>
              )}
            </div>
          </div>
          <CommonModal
            isOpen={showQuestion}
            onClose={() => {
              setShowQuestion(false)
            }}
          >
            <CheckoutList
              isView={false}
              questionaire={questionaire}
              patientId={patientId}
              clinicId={clinicId}
              receptionId={receptionId}
              updateSucces={() => setShowQuestion(false)}
            />
          </CommonModal>
        </div>
      </div>
    </>
  )
}

export default PreparationView
