'use client'
import React, { useCallback, useEffect, useState } from 'react'

import ChatComponent from '@/components/Chat'
import CheckoutList from '@/components/CheckList'
import CommonModal from '@/components/CommonModal'
import type { Patient } from '@/gen/proto/v1/patient_pb'
import type { Questionaire } from '@/gen/proto/v1/questionaire_pb'
import type { DetailReception, Doctor } from '@/gen/proto/v1/reception_pb'
import { detailQuestionaire } from '@/server/questionaire'
import { receptionDetail } from '@/server/reception'
import { calculateAge } from '@/utils/chunks'
import type { SessionUser } from '@/utils/type'
import type { Session } from 'next-auth'
import { useRouter, useSearchParams } from 'next/navigation'

interface Props {
  session: Session | null
}

const MeetingView: React.FC<Props> = ({ session }) => {
  const router = useRouter()
  const params = useSearchParams()
  const currentUser = session?.user as SessionUser

  const role = currentUser.role ?? 'client'

  const roomId = params.get('iv') ?? '1'

  const [patient, setPatient] = useState<Patient>()
  const [doctor, setDoctor] = useState<Doctor>()
  const [reception, setReception] = useState<DetailReception>()
  const [errorMessage, setErrorMessage] = useState('')
  const [modalIsOpen, setModalIsOpen] = useState(false)
  const [questionaire, setQuestionaire] = useState<Questionaire>()

  useEffect(() => {
    // Function to fetch data
    const fetchData = async () => {
      const _res = await detailQuestionaire(Number(roomId))
      setQuestionaire(_res.questionaire)
    }

    // Call fetchData when component mounts
    fetchData()
  }, [roomId])

  const handleBackHome = useCallback(() => {
    const backPath =
      role == 'admin' ? `/doctor/patient/reception` : '/patient/reception'
    router.push(`${backPath}?role=${role}&id=${roomId}`)
  }, [role, router, roomId])

  useEffect(() => {
    // Function to fetch data
    const fetchData = async () => {
      try {
        const _reception = await receptionDetail(Number(roomId))
        setPatient(_reception?.patient)
        setDoctor(_reception?.doctor)
        setReception(_reception)
      } catch (error) {
        console.error('Error fetching data:', error)
        setErrorMessage('患者情報が見つかりません')
        setModalIsOpen(true)
      }
    }

    // Call fetchData when component mounts
    fetchData()
  }, [roomId])

  const { years, months } = calculateAge(patient?.birthYear || '')

  const handleStartMeeting = useCallback(() => {
    window.open(`${doctor?.meetingUrl}`, '_blank')
  }, [doctor])

  const closeModal = useCallback(() => {
    setModalIsOpen(false)
    setErrorMessage('')
  }, [setModalIsOpen, setErrorMessage])

  return (
    <>
      <div className="flex h-10p py-1 text-black">
        <div className="mx-4 block w-1/5 bg-white">
          <div>{reception?.appointmentTime}</div>
          <div>{reception?.examination?.name}</div>
          <div>再診</div>
        </div>

        <div className="mx-4 block min-w-96 bg-white">
          <div>
            {patient?.firstName}
            {patient?.lastName}
          </div>
          <div>
            ({patient?.firstNameFurigana}
            {patient?.lastNameFurigana})
          </div>
          <div className="flex w-full">
            <div className="border-r-2 border-gray-500 px-1 leading-none">
              {patient?.birthYear.substring(0, 4)}年
              {patient?.birthYear.substring(5, 7)}月
              {patient?.birthYear.substring(8, 10)}日
            </div>
            <div className="border-r-2 border-gray-500 px-1 leading-none">
              {years}歳{months}ヶ月
            </div>
            <div
              className={`border-r-2 border-gray-500 px-1 leading-none ${Number(patient?.gender) < 1 ? 'text-red-500' : ''}`}
            >
              {patient?.gender == 1
                ? '男性'
                : patient?.gender == 2
                  ? '女性'
                  : 'その他'}
            </div>
            <div className="mx-2 rounded border px-1 leading-none">総合</div>
          </div>
        </div>

        <div className="mx-auto"></div>
        {/* <div className="flex w-32 items-center text-center font-bold">
          <div className="mx-auto">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth="1.5"
              stroke="currentColor"
              className="mx-auto size-6"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M9 8.25H7.5a2.25 2.25 0 0 0-2.25 2.25v9a2.25 2.25 0 0 0 2.25 2.25h9a2.25 2.25 0 0 0 2.25-2.25v-9a2.25 2.25 0 0 0-2.25-2.25H15m0-3-3-3m0 0-3 3m3-3V15"
              />
            </svg>
            画面共有を開始
          </div>
        </div> */}
        <div className="flex w-16 items-center text-center font-bold">
          <div className="mx-auto cursor-pointer" onClick={handleBackHome}>
            <svg
              width="20"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth="1.5"
              stroke="currentColor"
              className="mx-auto size-6"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M6.75 3v2.25M17.25 3v2.25M3 18.75V7.5a2.25 2.25 0 0 1 2.25-2.25h13.5A2.25 2.25 0 0 1 21 7.5v11.25m-18 0A2.25 2.25 0 0 0 5.25 21h13.5A2.25 2.25 0 0 0 21 18.75m-18 0v-7.5A2.25 2.25 0 0 1 5.25 9h13.5A2.25 2.25 0 0 1 21 11.25v7.5m-9-6h.008v.008H12v-.008ZM12 15h.008v.008H12V15Zm0 2.25h.008v.008H12v-.008ZM9.75 15h.008v.008H9.75V15Zm0 2.25h.008v.008H9.75v-.008ZM7.5 15h.008v.008H7.5V15Zm0 2.25h.008v.008H7.5v-.008Zm6.75-4.5h.008v.008h-.008v-.008Zm0 2.25h.008v.008h-.008V15Zm0 2.25h.008v.008h-.008v-.008Zm2.25-4.5h.008v.008H16.5v-.008Zm0 2.25h.008v.008H16.5V15Z"
              />
            </svg>
            カルテ
          </div>
        </div>
        {/* <div className="flex w-32 items-center text-center font-bold">
          <div className="mx-auto">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth="1.5"
              stroke="currentColor"
              className="mx-auto size-6"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M20.25 8.511c.884.284 1.5 1.128 1.5 2.097v4.286c0 1.136-.847 2.1-1.98 2.193-.34.027-.68.052-1.02.072v3.091l-3-3c-1.354 0-2.694-.055-4.02-.163a2.115 2.115 0 0 1-.825-.242m9.345-8.334a2.126 2.126 0 0 0-.476-.095 48.64 48.64 0 0 0-8.048 0c-1.131.094-1.976 1.057-1.976 2.192v4.286c0 .837.46 1.58 1.155 1.951m9.345-8.334V6.637c0-1.621-1.152-3.026-2.76-3.235A48.455 48.455 0 0 0 11.25 3c-2.115 0-4.198.137-6.24.402-1.608.209-2.76 1.614-2.76 3.235v6.226c0 1.621 1.152 3.026 2.76 3.235.577.075 1.157.14 1.74.194V21l4.155-4.155"
              />
            </svg>
            チャット
          </div>
        </div> */}
        <div className="flex w-24 items-center text-center font-bold">
          <div className="mx-auto">
            <a
              href="https://empowerme-cloud.com/helpcenter/"
              target="_"
              className="rounded border-0 p-0 py-2  text-main-gray hover:bg-gray-100 hover:text-blue-700 sm:flex md:block"
            >
              <svg
                width="20"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth="1.5"
                stroke="currentColor"
                className="mx-auto size-6"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M9.879 7.519c1.171-1.025 3.071-1.025 4.242 0 1.172 1.025 1.172 2.687 0 3.712-.203.179-.43.326-.67.442-.745.361-1.45.999-1.45 1.827v.75M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Zm-9 5.25h.008v.008H12v-.008Z"
                />
              </svg>
              ヘルプ
            </a>
          </div>
        </div>
        <div className="flex items-center text-center font-bold">
          <div className="mx-auto">
            <button
              className="mr-4 h-12 rounded-xl bg-main-500 px-2 text-white"
              onClick={handleBackHome}
            >
              診察を終了する
            </button>
          </div>
        </div>
      </div>
      <div className="mx-1 flex h-90p justify-center overflow-hidden bg-main-200">
        <div className="w-1/4 pt-8 text-base text-gray-600">
          <div className="block w-full">
            <div className="mb-4 px-2 text-lg font-bold">再診</div>
            <CheckoutList
              isView={true}
              questionaire={questionaire}
              patientId={reception?.patient?.id || 0}
              clinicId={reception?.clinicId || 0}
              receptionId={Number(reception?.id)}
            />
            {/* {checklist.content.map((question, i) => (
              <div
                key={i}
                className={`block w-full pt-2 ${i == 0 ? '' : 'border-t-2 border-dashed border-white'} text-sm`}
              >
                <div className="w-full">【{question.type}】</div>
                <div className="w-full pr-8">{question.question}</div>
                <div className="mt-2 flex w-full">
                  {question.answerType == 1 && (
                    <p className="mb-2 font-bold">{question.answers[0]}</p>
                  )}
                  {question.answerType == 2 &&
                    question.answers.map((i, answer_index) => (
                      <button
                        key={answer_index}
                        className="mx-2 mb-2 flex rounded bg-gray-200 px-1 text-xs text-black"
                      >
                        {i} x
                      </button>
                    ))}
                </div>
              </div>
            ))} */}
          </div>
        </div>

        <div className="relative flex w-1/2 items-center justify-center bg-main-100">
          {role == 'patient' && (
            <img
              src="/interview_client.png"
              className="inset-0 flex h-4/6 items-center justify-center"
              alt=""
            />
          )}
          {role == 'doctor' && (
            <img
              src="/interview_admin.jpeg"
              className="inset-0 flex h-4/6 items-center justify-center"
              alt=""
            />
          )}

          <div className="absolute bottom-2 z-20 h-24 w-3/5 min-w-[500px] bg-main-200 p-4 pb-2 text-center text-black">
            <div className="inline-block h-full w-2/6">
              <p className="mb-2">診察開始</p>
              <button
                className="flex w-full items-center justify-center"
                onClick={handleStartMeeting}
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth={1.5}
                  stroke="currentColor"
                  className="mx-auto size-6"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M2.25 6.75c0 8.284 6.716 15 15 15h2.25a2.25 2.25 0 0 0 2.25-2.25v-1.372c0-.516-.351-.966-.852-1.091l-4.423-1.106c-.44-.11-.902.055-1.173.417l-.97 1.293c-.282.376-.769.542-1.21.38a12.035 12.035 0 0 1-7.143-7.143c-.162-.441.004-.928.38-1.21l1.293-.97c.363-.271.527-.734.417-1.173L6.963 3.102a1.125 1.125 0 0 0-1.091-.852H4.5A2.25 2.25 0 0 0 2.25 4.5v2.25Z"
                  />
                </svg>
              </button>
            </div>
          </div>

          {/* <div className="absolute bottom-2 z-20 h-24 w-3/5 min-w-[500px] bg-main-200 p-4 pb-2 text-center text-black">
            <div className="inline-block h-full w-2/6">
              <p>ミュート</p>
              <button className="flex w-full items-center justify-center">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth="1.5"
                  stroke="currentColor"
                  className="mx-auto size-9"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M17.25 9.75 19.5 12m0 0 2.25 2.25M19.5 12l2.25-2.25M19.5 12l-2.25 2.25m-10.5-6 4.72-4.72a.75.75 0 0 1 1.28.53v15.88a.75.75 0 0 1-1.28.53l-4.72-4.72H4.51c-.88 0-1.704-.507-1.938-1.354A9.009 9.009 0 0 1 2.25 12c0-.83.112-1.633.322-2.396C2.806 8.756 3.63 8.25 4.51 8.25H6.75Z"
                  />
                </svg>
              </button>
            </div>
            <div className="inline-block h-full w-2/6">
              <p>ビデオの停止</p>
              <button className="flex w-full items-center justify-center">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth="1.5"
                  stroke="currentColor"
                  className="mx-auto size-9"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="m15.75 10.5 4.72-4.72a.75.75 0 0 1 1.28.53v11.38a.75.75 0 0 1-1.28.53l-4.72-4.72M4.5 18.75h9a2.25 2.25 0 0 0 2.25-2.25v-9a2.25 2.25 0 0 0-2.25-2.25h-9A2.25 2.25 0 0 0 2.25 7.5v9a2.25 2.25 0 0 0 2.25 2.25Z"
                  />
                </svg>
              </button>
            </div>
            <div className="inline-block h-full w-2/6">
              <p>シミュレーター</p>
              <button className="flex w-full items-center justify-center">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth="1.5"
                  stroke="currentColor"
                  className="mx-auto size-9"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="m16.862 4.487 1.687-1.688a1.875 1.875 0 1 1 2.652 2.652L6.832 19.82a4.5 4.5 0 0 1-1.897 1.13l-2.685.8.8-2.685a4.5 4.5 0 0 1 1.13-1.897L16.863 4.487Zm0 0L19.5 7.125"
                  />
                </svg>
              </button>
            </div>
          </div> */}
        </div>

        <div className="w-1/4 overflow-scroll pt-8 text-base text-gray-600">
          <ChatComponent roomId={roomId} role={role} patient={patient} />
        </div>

        <CommonModal isOpen={modalIsOpen} onClose={closeModal}>
          <div>{errorMessage}</div>
        </CommonModal>
      </div>
    </>
  )
}

export default MeetingView
