'use client'

import type { DataItem } from '@/components/Table'
import Table from '@/components/Table'
import type { Patient } from '@/gen/proto/v1/patient_pb'
import type {
  Doctor,
  Examination,
  Label,
  Memo,
  Reception,
} from '@/gen/proto/v1/reception_pb'
import {
  getCompletedReception,
  receptionList,
  updateReception,
  updateReceptionLabel,
} from '@/server/reception'
import React, { useCallback, useEffect, useMemo, useState } from 'react'
import Modal from 'react-modal'
import { MenuBarComponent } from '../Menu/MenuBar'

import AddLabelPopup from '@/components/AddLabelPopup'
import AddMemoModal from '@/components/AddMemoModal'
import StatusButton from '@/components/ChangeStatusButton'
import CheckoutButton from '@/components/CheckoutButton/index'
import CommonModal from '@/components/CommonModal'
import Pagination from '@/components/Pagination'
import UpdateDoctorPopup from '@/components/UpdateDoctorPopup'
import { sendMessageToLineUser } from '@/server/chat'
import { createMemo } from '@/server/memo'
import type { SessionUser } from '@/utils/type'
import { addDays } from 'date-fns'
import type { Session } from 'next-auth'
import { useRouter } from 'next/navigation'

interface Props {
  session: Session | null
}

const ReceptionList: React.FC<Props> = ({ session }) => {
  const [startDate, setStartDate] = useState(new Date())
  const [receptions, setReceptions] = useState<Reception[]>([])
  const [selectedDoctor, setSelectedDoctor] = useState<Doctor | undefined>()
  const [selectedStatus, setSelectedStatus] = useState<number[]>([])
  const router = useRouter()

  const currentUser = session?.user as SessionUser
  const role = currentUser.role ?? 'doctor'

  const [errorMessage, setErrorMessage] = useState('')
  const [modalIsOpen, setModalIsOpen] = useState(false)

  const [isOpenLabelPopup, setIsOpenLabelPopup] = useState<boolean>(false)
  const [isOpenMemoModal, setIsOpenMemoModal] = useState<boolean>(false)
  const [isOpenDoctorPopup, setIsOpenDoctorPopup] = useState<boolean>(false)

  const [receptionId, setReceptionId] = useState<bigint>(BigInt(0))
  const [currentPage, setCurrentPage] = useState<number>(1)
  const [totalPages, setTotalPages] = useState<number>(1)
  const [menuId, setMenuId] = useState<number>(0)
  const [completedReceptionPer, setCompletedReceptionPer] = useState<{
    completed: number
    total: number
  }>({ completed: 0, total: 0 })
  const pageSize = 20
  const handleCloseMemoModal = useCallback(() => {
    setReceptionId(BigInt(0))
    setIsOpenMemoModal(false)
  }, [])

  const [popupPosition, setPopupPosition] = useState({ top: 0, left: 0 })

  const handleToggleLabelPopup = useCallback(
    (e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
      if (e.currentTarget) {
        const buttonRect = e.currentTarget.getBoundingClientRect()
        setPopupPosition({
          top: buttonRect.bottom + window.scrollY,
          left: buttonRect.left + window.scrollX,
        })
      }
      setIsOpenLabelPopup(!isOpenLabelPopup)
    },
    [isOpenLabelPopup],
  )

  const handleOpenDoctorPopup = useCallback(
    (e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
      if (e.currentTarget) {
        const buttonRect = e.currentTarget.getBoundingClientRect()
        setPopupPosition({
          top: buttonRect.bottom + window.scrollY,
          left: buttonRect.left + window.scrollX,
        })
      }
      setIsOpenDoctorPopup(!isOpenDoctorPopup)
    },
    [isOpenDoctorPopup],
  )

  useEffect(() => {
    // Function to fetch data
    const fetchData = async () => {
      try {
        const response = await receptionList({
          fromDate: startDate.toISOString().split('T')[0],
          toDate: addDays(new Date(startDate), 1).toISOString().split('T')[0],
          assignTo: selectedDoctor?.id,
          sortAppointmentTime: 'asc',
          sortReservationTime: 'asc',
          status: selectedStatus,
          page: currentPage,
          size: currentPage * pageSize,
        })

        setReceptions(response.receptions)
        setTotalPages(Math.ceil(response.total / pageSize))
      } catch (error) {
        console.error('Error fetching data:', error)
        setErrorMessage('予約一覧が見つかりません')
        setModalIsOpen(true)
      }
    }

    // Call fetchData when component mounts
    fetchData()
  }, [startDate, selectedDoctor, selectedStatus, currentPage])

  const closeModal = useCallback(() => {
    setModalIsOpen(false)
    setErrorMessage('')
  }, [setModalIsOpen, setErrorMessage])

  const showPatientDetail = useCallback(
    (id: number) => {
      router.push(`/doctor/patient/reception?id=${id}`)
    },
    [router],
  )

  const convertStatusToClass = useCallback((value: number) => {
    let cssClass = ''
    switch (value) {
      case 1:
        // waiting for order
        cssClass = 'bg-status-1'
        break
      case 2:
        // wait for examination
        cssClass = 'bg-status-2'
        break
      case 3:
        // examinating
        cssClass = 'bg-status-3'
        break
      case 4:
        // waiting for payment
        cssClass = 'bg-status-4'
        break
      case 5:
        // paid
        cssClass = 'bg-status-5'
        break
      default:
        cssClass = 'bg-gray-500'
      // code block executed if expression doesn't match any case
    }
    return cssClass
  }, [])

  const handleOpenMemoModal = useCallback(
    (
      event: React.MouseEvent<HTMLButtonElement, MouseEvent>,
      receptionId: bigint,
    ) => {
      event.stopPropagation()
      setIsOpenMemoModal(true)
      setReceptionId(receptionId)
    },
    [],
  )

  const handleAddMemo = async (receptionId: bigint, memoContent: string) => {
    try {
      const response = await createMemo(receptionId, memoContent)
      const newReceptions = receptions.map((item) => {
        if (item.id === receptionId && Boolean(response)) {
          item.memo.push(response as Memo)
        }
        return item
      })
      setReceptions(newReceptions)
    } catch (error) {
      console.error('Error adding memo:', error)
      setErrorMessage('メモの追加に失敗しました')
      setModalIsOpen(true)
    } finally {
      setIsOpenMemoModal(false)
      setReceptionId(BigInt(0))
    }
  }

  const handleChangePage = useCallback((page: number) => {
    setCurrentPage(page)
  }, [])

  const handleAddLabel = useCallback(
    async (
      receptionId: bigint,
      labelId: bigint,
      name: string,
      color: string,
    ) => {
      try {
        const response = await updateReceptionLabel(receptionId, labelId)
        const newReceptions = receptions.map((item) => {
          if (item.id === receptionId && Boolean(response)) {
            item.labels.push({ id: BigInt(labelId), name, color } as Label)
          }
          return item
        })
        setReceptions(newReceptions)
      } catch (error) {
        console.error('Error adding label:', error)
        setErrorMessage('ラベルの追加に失敗しました')
        setModalIsOpen(true)
      } finally {
        setIsOpenLabelPopup(false)
        setReceptionId(BigInt(0))
      }
    },
    [receptions],
  )

  const handleUpdateStatus = useCallback(
    async (id: bigint, status: number) => {
      try {
        const reception = await updateReception(id, status)
        console.log(reception)
        if (reception) {
          const newReceptions = receptions.map((item) => {
            if (BigInt(item.id) === BigInt(reception.id)) {
              item.status = status
            }

            if (BigInt(item.id) === BigInt(reception.id) && status == 2) {
              item.receptionTime = reception.receptionTime
            }

            return item
          })
          const lineId = reception?.patient?.lineId
          if (lineId && status === 5) {
            // await sendMessageToLineUser(lineId)
            await sendMessageToLineUser(
              lineId,
              Number(reception.id ?? 0),
              Number(currentUser.clinic_id ?? 0),
              Number(reception?.patient?.id ?? 0),
            )
          }
          setReceptions(newReceptions)
        }
      } catch (error) {
        console.error('Error updating status:', error)
        setErrorMessage('ステータスの更新に失敗しました')
      }
    },
    [receptions, currentUser],
  )

  const handleUpdateDoctor = useCallback(
    async (receptionId: bigint, doctorId: number) => {
      try {
        const reception = await updateReception(
          receptionId,
          0,
          BigInt(doctorId),
        )

        const newReceptions = receptions.map((item) => {
          if (reception && item.id === receptionId) {
            item.doctor = reception.doctor
          }

          return item
        })

        setReceptions(newReceptions)
      } catch (error) {
        console.error('Error updating doctor:', error)
        setErrorMessage('医師の更新に失敗しました')
      } finally {
        setIsOpenDoctorPopup(false)
        setReceptionId(BigInt(0))
        setMenuId(0)
      }
    },
    [receptions],
  )

  useEffect(() => {
    const fetchDate = async () => {
      try {
        const date = startDate.toISOString().split('T')[0]
        const response = await getCompletedReception(
          date,
          addDays(new Date(date), 1).toISOString().split('T')[0],
        )
        setCompletedReceptionPer({
          completed: response.completed,
          total: response.total,
        })
      } catch (error) {
        console.error('Error fetching data:', error)
        setErrorMessage('予約一覧が見つかりません')
      }
    }

    fetchDate()
  }, [startDate])

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
        render: (value: number, record: DataItem) => (
          <div className="flex w-full items-center justify-center text-left">
            <StatusButton
              initialStatus={value}
              handleUpdateStatus={handleUpdateStatus}
              convertStatusToClassName={convertStatusToClass}
              receptionId={record.id}
            />
          </div>
        ),
        className:
          'max-w-[150px] 3xl:max-w-[190px] 4xl:max-w-[220px] text-sm text-gray-600 border-t border-b',
      },
      {
        title: '氏名',
        index: 'patient',
        render: (value: Patient) => (
          <div className="w-full cursor-pointer text-center">
            <div>
              <p
                className={`${!value.firstName || !value.lastName || !value.firstNameFurigana || !value?.lastNameFurigana ? 'text-red-500' : ''}`}
              >
                <ruby>
                  {value.firstName || '--'}
                  {value.lastName || '--'}
                  <rt>
                    {value.firstNameFurigana || '--'}
                    {value?.lastNameFurigana || '--'}
                  </rt>
                </ruby>
              </p>
              <p
                className={`${String(value?.birthYear) <= '1900-01-01' ? 'text-red-500' : ''}`}
              >
                {value?.birthYear}
              </p>
            </div>
          </div>
        ),
        className:
          'text-left max-w-[150px] 3xl:max-w-[190px] 4xl:max-w-[220px] text-sm text-gray-600 border-t border-b',
      },
      {
        title: '性別',
        index: 'patient',
        render: (value: Patient) => (
          <div
            className={`w-full text-center ${Number(value.gender) < 1 ? 'text-red-500' : ''}`}
          >
            {value.gender == 1 ? '男性' : value.gender == 2 ? '女性' : 'その他'}
          </div>
        ),
        className:
          'max-w-[150px] 3xl:max-w-[190px] 4xl:max-w-[220px] text-sm text-gray-600 border-t border-b',
      },
      {
        title: 'カルテ番号',
        index: 'patient',
        render: (value: Patient) => (
          <div className="w-full text-center">{value?.customerId}</div>
        ),
        className:
          'max-w-[150px] 3xl:max-w-[190px] 4xl:max-w-[220px] text-sm text-gray-600 border-t border-b',
      },
      {
        title: '診察メニュー',
        index: 'examination',
        render: (value: Examination) => (
          <div className="w-full text-center">{value.name}</div>
        ),
        className:
          'max-w-[150px] 3xl:max-w-[190px] 4xl:max-w-[220px] text-sm text-gray-600 border-t border-b',
      },
      {
        title: '担当医師',
        index: 'doctor',
        render: (value: Doctor, record: DataItem) => (
          <div className="flex w-full justify-center gap-1 text-center">
            {value?.name}
            {record?.status < 4 && (
              <button
                onClick={(event) => {
                  event.stopPropagation()
                  handleOpenDoctorPopup(event)
                  setReceptionId(record.id)
                  setMenuId(record.examination?.id || 0)
                }}
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth="1.5"
                  stroke="currentColor"
                  className="size-4"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="m16.862 4.487 1.687-1.688a1.875 1.875 0 1 1 2.652 2.652L6.832 19.82a4.5 4.5 0 0 1-1.897 1.13l-2.685.8.8-2.685a4.5 4.5 0 0 1 1.13-1.897L16.863 4.487Zm0 0L19.5 7.125"
                  />
                </svg>
              </button>
            )}
          </div>
        ),
        className:
          'max-w-[150px] 3xl:max-w-[190px] 4xl:max-w-[220px] text-sm text-gray-600 border-t border-b',
      },
      {
        title: 'メモ',
        index: 'memo',
        render: (_: Memo[], record: DataItem) => (
          <div className="item-center flex w-full justify-center gap-1 text-center">
            <div className="flex flex-col gap-1">
              {record.memo && (
                <div>
                  {record.memo.map(
                    (item: Memo) =>
                      item.content != 'undefined' && (
                        <p className="w-14 truncate text-[14px]" key={item.id}>
                          {item.content}
                        </p>
                      ),
                  )}
                </div>
              )}
            </div>
            <button
              className="p-2"
              onClick={(event) => handleOpenMemoModal(event, record.id)}
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth="1.5"
                stroke="currentColor"
                className="size-4"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M12 4.5v15m7.5-7.5h-15"
                />
              </svg>
            </button>
          </div>
        ),
        className:
          'max-w-[150px] 3xl:max-w-[190px] 4xl:max-w-[220px] text-sm text-gray-600 border-t border-b',
      },
      {
        title: 'ラベル',
        index: 'labels',
        render: (value: Label[], record: DataItem) => (
          <div className="relative flex items-center justify-center text-center">
            <div className="flex flex-col gap-1">
              {value.map((item, index) => (
                <div
                  key={index}
                  className="mx-auto inline-block max-w-none rounded-xl border bg-white px-2 text-center"
                  style={{ backgroundColor: item.color }}
                >
                  {item?.name}
                </div>
              ))}
            </div>
            <button
              className="p-2"
              onClick={(event) => {
                event.stopPropagation()
                handleToggleLabelPopup(event)
                setReceptionId(record.id)
              }}
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth="1.5"
                stroke="currentColor"
                className="mx-auto size-4"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M12 4.5v15m7.5-7.5h-15"
                />
              </svg>
            </button>
          </div>
        ),
        className:
          'max-w-[150px] 3xl:max-w-[190px] 4xl:max-w-[220px] text-sm text-gray-600 border-t border-b',
      },
      {
        title: '',
        index: 'id',
        render: (value: number, record: DataItem) => (
          <div className="flex justify-end">
            {record?.status == 1 && (
              <button
                className="w-16 rounded border bg-status-1 px-4 py-2 text-white hover:bg-blue-400"
                onClick={(event) => {
                  event.stopPropagation()
                  setReceptionId(record.id)
                  setMenuId(record.examination?.id || 0)
                  handleOpenDoctorPopup(event)
                }}
              >
                受付
              </button>
            )}
            {(record?.status == 2 || record?.status == 3) && (
              <button
                className="w-32 rounded border bg-status-3 px-4 py-2 text-white hover:bg-blue-300"
                onClick={(event) => {
                  event.stopPropagation()
                  showPatientDetail(Number(record?.id))
                }}
              >
                カルテ表示
              </button>
            )}
            {record?.status == 4 && (
              <CheckoutButton orderId={record.id.toString()} source="admin" />
            )}
            {record?.status == 5 && (
              <button
                className="w-16 rounded border bg-main-200 px-4 py-2 text-white hover:bg-blue-300"
                onClick={(event) => {
                  event.stopPropagation()
                }}
              >
                予約
              </button>
            )}
            {/* <div className="flex w-6 items-center">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                fill="currentColor"
                className="size-6"
              >
                <path
                  fillRule="evenodd"
                  d="M10.5 6a1.5 1.5 0 1 1 3 0 1.5 1.5 0 0 1-3 0Zm0 6a1.5 1.5 0 1 1 3 0 1.5 1.5 0 0 1-3 0Zm0 6a1.5 1.5 0 1 1 3 0 1.5 1.5 0 0 1-3 0Z"
                  clipRule="evenodd"
                />
              </svg>
            </div> */}
          </div>
        ),
        className:
          'max-w-[150px] 3xl:max-w-[190px] 4xl:max-w-[220px] text-sm text-gray-600 border-t border-b  lg:pr-16',
      },
    ],
    [
      handleUpdateStatus,
      convertStatusToClass,
      handleOpenDoctorPopup,
      handleOpenMemoModal,
      handleToggleLabelPopup,
      showPatientDetail,
    ],
  )

  return (
    <>
      <MenuBarComponent
        role={role}
        startDate={startDate}
        setStartDate={setStartDate}
        showStatus={true}
        setSelectedDoctor={setSelectedDoctor}
        selectedOptions={selectedStatus}
        setSelectedOptions={setSelectedStatus}
        completeReceptionPer={completedReceptionPer}
        clinnicId={currentUser.clinic_id}
      />
      <div className="h-full justify-center">
        <Table
          columns={columns}
          data={receptions}
          onRowClick={showPatientDetail}
        />
        {totalPages > 1 && (
          <div className="my-4 flex justify-center">
            <Pagination
              currentPage={currentPage}
              totalPages={totalPages}
              onPageChange={handleChangePage}
            />
          </div>
        )}
        <div className="relative">
          <Modal
            id="label-popup"
            isOpen={isOpenLabelPopup}
            onRequestClose={() => setIsOpenLabelPopup(false)}
            contentLabel=""
            style={{
              content: {
                top: popupPosition.top || '50%',
                left: popupPosition.left || '50%',
                transform: 'translate(-50%, -50%)',
              },
            }}
            overlayClassName="fixed inset-0 z-30 flex items-center justify-center"
            className="absolute w-fit"
            ariaHideApp={false}
          >
            <AddLabelPopup
              handleAddLabel={handleAddLabel}
              receptionId={receptionId}
            />
          </Modal>
        </div>
        <div className="relative">
          <Modal
            id="doctor-popup"
            isOpen={isOpenDoctorPopup}
            onRequestClose={() => setIsOpenDoctorPopup(false)}
            contentLabel=""
            style={{
              content: {
                top: popupPosition.top || '50%',
                left: popupPosition.left || '50%',
                transform: 'translate(-50%, -50%)',
              },
            }}
            overlayClassName="fixed inset-0 z-30 flex items-center justify-center"
            className="absolute w-fit"
            ariaHideApp={false}
          >
            <UpdateDoctorPopup
              handleUpdateDoctor={handleUpdateDoctor}
              receptionId={receptionId}
              menuId={menuId}
            />
          </Modal>
        </div>

        <AddMemoModal
          isOpen={isOpenMemoModal}
          onClose={handleCloseMemoModal}
          receptionId={receptionId}
          handleAddMemo={handleAddMemo}
        />
      </div>

      <CommonModal isOpen={modalIsOpen} onClose={closeModal}>
        <div>{errorMessage}</div>
      </CommonModal>
    </>
  )
}

export default ReceptionList
