'use client'

import type { Reception } from '@/gen/proto/v1/reception_pb'
import { receptionDetail } from '@/server/reception'
import React, { useEffect, useState } from 'react'
import Modal from 'react-modal'
import FormCreateReception from './FormCreateReception'

interface EditScheduleDialogProps {
  setOpenDialog: React.Dispatch<React.SetStateAction<boolean>>
  openDialog: boolean
  receptionId: number
}

const EditScheduleDialog: React.FC<EditScheduleDialogProps> = ({
  setOpenDialog,
  openDialog,
  receptionId,
}) => {
  const onClickFunction = () => {
    setOpenDialog(false)
  }

  const [recption, setReception] = useState<Reception>()

  useEffect(() => {
    const fetchData = async () => {
      const res = await receptionDetail(receptionId)
      console.log(res)
      setReception(res)
    }
    fetchData()
  }, [receptionId, setReception])

  return (
    <Modal
      isOpen={openDialog}
      onRequestClose={onClickFunction}
      contentLabel="Example Modal"
      overlayClassName="fixed inset-0 z-50 flex items-center justify-center "
      className="elative rounded-2xl bg-white shadow-lg"
    >
      <div className="z-50 min-w-[500px] rounded-lg bg-main-200 p-8 text-black">
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

        <FormCreateReception
          setOpenDialog={setOpenDialog}
          handleBack={() => onClickFunction()}
          patientFirstName={recption?.patient?.firstName || ''}
          patientLastName={recption?.patient?.lastName || ''}
          patientFirstNameFurigana={recption?.patient?.firstNameFurigana || ''}
          patientLastNameFurigana={recption?.patient?.lastNameFurigana || ''}
          patientBirthDate={recption?.patient?.birthYear || ''}
          patientTel={recption?.patient?.phone || ''}
          patientId={recption?.patient?.id || 0}
          patientMenuId={Number(recption?.examination?.id)}
          patientSelectedDate={recption?.appointmentTime.split(' ')[0] || ''}
          patientSelectedTime={recption?.appointmentTime.split(' ')[1] || ''}
          patientMemo={recption?.memo[0]?.content || ''}
          receptionId={receptionId}
          doctor={recption?.doctor}
        />
      </div>
    </Modal>
  )
}

export { EditScheduleDialog }
