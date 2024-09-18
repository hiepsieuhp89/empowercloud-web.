'use client'

import React from 'react'
import Modal from 'react-modal'
import FormRegisterReception from './FormRegisterReception'

interface Props {
  startDateTime: string
  setOpenDialog: React.Dispatch<React.SetStateAction<boolean>>
  openDialog: boolean
  patientId: string
}

const PatientScheduleDialog: React.FC<Props> = ({
  setOpenDialog,
  openDialog,
  patientId,
}) => {
  const onClickFunction = () => {
    setOpenDialog(false)
  }
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

        <FormRegisterReception
          setOpenDialog={setOpenDialog}
          handleBack={onClickFunction}
          patientId={Number(patientId)}
          patientMenuId={0}
          patientSelectedDate=""
          patientSelectedTime=""
          patientMemo=""
        />
      </div>
    </Modal>
  )
}

export { PatientScheduleDialog }
