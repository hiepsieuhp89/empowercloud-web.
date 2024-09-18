'use client'

import type { DataItem } from '@/components/Table'
import Table from '@/components/Table'
import type { Doctor, Reception } from '@/gen/proto/v1/reception_pb'
import {
  //getCompletedReception,
  getUserReceptions,
} from '@/server/reception'
import React, { useCallback, useEffect, useMemo, useState } from 'react'
import Modal from 'react-modal'
import { MenuBarComponent } from '../Menu/MenuBar'

import CheckoutButton from '@/components/CheckoutButton/index'
import CommonModal from '@/components/CommonModal'
import Pagination from '@/components/Pagination'
import PaymentSuccess from '@/components/PaymentSuccess'
import { PatientScheduleDialog } from '@/components/dialog/PatientScheduleDialog'
import { verifyPayment } from '@/server/payment'
import type { SessionUser } from '@/utils/type'
import type { Session } from 'next-auth'
import { useRouter, useSearchParams } from 'next/navigation'

interface Props {
  session: Session | null
}

const ReceptionList: React.FC<Props> = ({ session }) => {
  const [receptions, setReceptions] = useState<Reception[]>([])
  const [isPayment, setIsPayment] = useState(false)
  const router = useRouter()
  const params = useSearchParams()
  const [showDialog, setShowDialog] = useState(false)

  const user = session?.user as SessionUser

  const [errorMessage, setErrorMessage] = useState('')
  const [modalIsOpen, setModalIsOpen] = useState(false)
  const sessionId = params.get('session_id') ?? ''

  const [isOpenPopup, setIsOpenPopup] = useState(false)
  const [currentPage, _setCurrentPage] = useState<number>(1)
  const [totalPages, setTotalPages] = useState<number>(1)

  const [popupPosition, _setPopupPosition] = useState({ top: 0, left: 0 })
  const [orderId, setOrderId] = useState<string>()

  useEffect(() => {
    const verifySessionFunc = async () => {
      if (sessionId) {
        const paymentSession = await verifyPayment(sessionId)
        if (paymentSession) {
          setIsPayment(true)
          setOrderId(paymentSession.toString())
        }
      }
    }
    verifySessionFunc()
  }, [sessionId])

  useEffect(() => {
    // Function to fetch data
    const fetchData = async () => {
      try {
        const response = await getUserReceptions()
        setReceptions(response.receptions)
        setTotalPages(response.totalPage)
      } catch (error) {
        console.error('Error fetching data:', error)
        setErrorMessage('予約一覧が見つかりません')
        setModalIsOpen(true)
      }
    }

    // Call fetchData when component mounts
    fetchData()
  }, [currentPage])

  const closeModal = useCallback(() => {
    setModalIsOpen(false)
    setErrorMessage('')
  }, [setModalIsOpen, setErrorMessage])

  const showPatientDetail = useCallback(
    (id: number) => {
      router.push(`/patient/reception?id=${id}`)
    },
    [router],
  )

  const addSchedule = useCallback((_: string) => {
    setShowDialog(true)
  }, [])

  const convertStatusToName = useCallback((value: number) => {
    let statusName = ''
    switch (value) {
      case 1:
        // waiting for order
        statusName = '受付中'
        break
      case 2:
        // wait for examination
        statusName = '診察待ち'
        break
      case 3:
        // examinating
        statusName = '診察中'
        break
      case 4:
        // waiting for payment
        statusName = '会計待ち'
        break
      case 5:
        // paid
        statusName = '会計済み'
        break
      default:
        statusName = '完了'
      // code block executed if expression doesn't match any case
    }
    return statusName
  }, [])

  const columns = useMemo(
    () => [
      {
        title: '診察予約時間',
        index: 'appointmentTime',
        render: (name: string) => (
          <div className="flex w-full justify-center text-center">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth="1.5"
              stroke="currentColor"
              className="mr-2 size-6"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M6.75 3v2.25M17.25 3v2.25M3 18.75V7.5a2.25 2.25 0 0 1 2.25-2.25h13.5A2.25 2.25 0 0 1 21 7.5v11.25m-18 0A2.25 2.25 0 0 0 5.25 21h13.5A2.25 2.25 0 0 0 21 18.75m-18 0v-7.5A2.25 2.25 0 0 1 5.25 9h13.5A2.25 2.25 0 0 1 21 11.25v7.5m-9-6h.008v.008H12v-.008ZM12 15h.008v.008H12V15Zm0 2.25h.008v.008H12v-.008ZM9.75 15h.008v.008H9.75V15Zm0 2.25h.008v.008H9.75v-.008ZM7.5 15h.008v.008H7.5V15Zm0 2.25h.008v.008H7.5v-.008Zm6.75-4.5h.008v.008h-.008v-.008Zm0 2.25h.008v.008h-.008V15Zm0 2.25h.008v.008h-.008v-.008Zm2.25-4.5h.008v.008H16.5v-.008Zm0 2.25h.008v.008H16.5V15Z"
              />
            </svg>
            <p className="text-center text-[14px]">{name}</p>
          </div>
        ),
        className:
          'max-w-[200px] 3xl:max-w-[240px] 4xl:max-w-[280px] text-sm text-gray-600 border-t border-b lg:pl-16',
        sorter: (a: string, b: string) => a.localeCompare(b),
      },
      {
        title: '受付時間',
        index: 'receptionTime',
        render: (name: string) => (
          <div className="w-full text-center">{name}</div>
        ),
        className:
          'max-w-[200px] 3xl:max-w-[240px] 4xl:max-w-[280px] text-sm text-gray-600 border-t border-b',
        sorter: (a: string, b: string) => a.localeCompare(b),
      },
      {
        title: 'ステータス',
        index: 'status',
        render: (_: number, record: DataItem) => (
          <div className="flex w-full items-center justify-center text-left">
            <p>{convertStatusToName(record.status)}</p>
          </div>
        ),
        className:
          'max-w-[150px] 3xl:max-w-[190px] 4xl:max-w-[220px] text-sm text-gray-600 border-t border-b',
      },

      {
        title: '診察メニュー',
        index: 'examination',
        render: (value: DataItem) => (
          <div className="w-full text-center">{value.name}</div>
        ),
        className:
          'max-w-[150px] 3xl:max-w-[190px] 4xl:max-w-[220px] text-sm text-gray-600 border-t border-b',
      },
      {
        title: '担当医師',
        index: 'doctor',
        render: (value: Doctor, _: DataItem) => (
          <div className="flex w-full justify-center gap-1 text-center">
            {value?.name}
          </div>
        ),
        className:
          'max-w-[150px] 3xl:max-w-[190px] 4xl:max-w-[220px] text-sm text-gray-600 border-t border-b',
      },

      {
        title: '',
        index: 'id',
        render: (_: number, record: DataItem) => (
          <div className="flex justify-end">
            {record?.status == 4 && (
              <CheckoutButton orderId={record.id.toString()} source="patient" />
            )}
            {record?.status < 5 && (
              <a href={`/interview/preparation?iv=${record.id}`}>
                <button className="w-16 rounded border bg-status-3 px-4 py-2 text-white hover:bg-blue-700">
                  回答
                </button>
              </a>
            )}
            {record?.status < 5 && (
              <a href={`/interview/preparation?iv=${record.id}`}>
                <button className="w-16 rounded border bg-status-3 px-4 py-2 text-white hover:bg-blue-700">
                  参加
                </button>
              </a>
            )}
            {record?.status > 3 && (
              <a href={`/interview/preparation?iv=${record.id}`}>
                <button className="w-16 rounded border bg-status-3 px-4 py-2 text-white hover:bg-blue-700">
                  再診
                </button>
              </a>
            )}
          </div>
        ),
        className:
          'max-w-[150px] 3xl:max-w-[190px] 4xl:max-w-[220px] text-sm text-gray-600 border-t border-b  lg:pr-16',
      },
    ],
    [convertStatusToName],
  )

  return (
    <>
      <MenuBarComponent addSchedule={addSchedule} />
      <div className="h-full justify-center">
        <Table
          columns={columns}
          data={receptions}
          onRowClick={showPatientDetail}
        />
        <div className="my-4 flex justify-center">
          <Pagination
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={() => {}}
          />
        </div>
        <div className="relative">
          <Modal
            isOpen={isOpenPopup}
            onRequestClose={() => setIsOpenPopup(false)}
            contentLabel=""
            style={{
              content: {
                top: popupPosition.top || '50%',
                left: popupPosition.left || '50%',
                transform: 'translate(-50%, -50%)',
              },
              // overlay: {
              //   backgroundColor: 'rgba(0, 0, 0, 0.5)',
              // },
            }}
            overlayClassName="fixed inset-0 z-30 flex items-center justify-center"
            className="absolute w-fit"
            //className={`relative max-h-full max-w-3xl overflow-auto rounded-lg bg-white text-black`}
          />
        </div>
      </div>

      <CommonModal isOpen={modalIsOpen} onClose={closeModal}>
        <div>{errorMessage}</div>
      </CommonModal>
      <PaymentSuccess
        isDisplay={isPayment}
        setIsDisplay={setIsPayment}
        title="お会計が完了しました!"
        contentId={orderId}
      />
      <PatientScheduleDialog
        startDateTime=""
        setOpenDialog={setShowDialog}
        openDialog={showDialog}
        patientId={user.id}
      />
    </>
  )
}

export default ReceptionList
