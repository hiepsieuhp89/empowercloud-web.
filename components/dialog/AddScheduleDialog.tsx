'use client'

import type { Patient } from '@/gen/proto/v1/patient_pb'
import type { Doctor } from '@/gen/proto/v1/reception_pb'
import { searchPatient } from '@/server/patient'
import React, { useState } from 'react'
import Modal from 'react-modal'
import FormCreateReception from './FormCreateReception'

interface AddScheduleDialogProps {
  startDateTime: string
  setOpenDialog: React.Dispatch<React.SetStateAction<boolean>>
  openDialog: boolean
  doctor?: Doctor
}

const AddScheduleDialog: React.FC<AddScheduleDialogProps> = ({
  setOpenDialog,
  openDialog,
  doctor,
  startDateTime,
}) => {
  const onClickFunction = () => {
    setOpenDialog(false)
    setStep('0')
    setNewType('0')
  }

  const [isClicked, setIsClicked] = useState(false)

  const clickRow = () => {
    setIsClicked(!isClicked)
  }

  const [newType, setNewType] = useState('0')
  const [step, setStep] = useState('0')
  const [patient, setPatient] = useState<Patient>()

  const handleSearchPatient = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    const data = new FormData(e.currentTarget)
    const dataObj = Object.fromEntries(data.entries())
    try {
      const response = await searchPatient(Number(dataObj.userId))
      setPatient(response)
      setStep('1')
    } catch (e) {
      console.log('Error::: ', e)
    }
  }

  const handleBackStep = () => {
    setStep('1')
  }

  const handleBackType = () => {
    setNewType('0')
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
        className={`z-50 rounded-lg p-8 text-black ${newType == '0' ? 'bg-white' : 'bg-main-200'} min-w-[500px]`}
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
        {newType == '0' && (
          <div className="mt-4 block">
            <div className="flex w-full px-16 py-4">
              <h1 className="mx-auto text-xl font-bold ">新規予約</h1>
            </div>
            <div className="flex w-full px-16 py-4">
              <button
                className="mx-auto w-48 rounded-xl border-2 border-main-300 bg-white p-4 hover:bg-main-500 hover:text-white"
                onClick={() => setNewType('1')}
              >
                新規のお客様
              </button>
            </div>
            <div className="flex w-full px-16 py-4">
              <button
                className="mx-auto w-48  rounded-xl border-2 border-main-300 bg-white p-4 hover:bg-main-300 hover:text-white"
                onClick={() => setNewType('2')}
              >
                既に会員のお客様
              </button>
            </div>
            <div className="flex w-full px-16 py-4">
              <button
                className="mx-auto w-48  rounded-xl border-2 border-main-300 bg-white p-4 hover:bg-gray-400 hover:text-white"
                onClick={() => setOpenDialog(false)}
              >
                戻る
              </button>
            </div>
          </div>
        )}

        {newType == '1' && (
          <FormCreateReception
            handleBack={() => handleBackType()}
            patientFirstName=""
            patientLastName=""
            patientFirstNameFurigana=""
            patientLastNameFurigana=""
            patientBirthDate=""
            setOpenDialog={setOpenDialog}
            patientTel=""
            patientId={0}
            patientMenuId={0}
            patientSelectedDate={
              startDateTime ? startDateTime.split(' ')[0] : ''
            }
            patientSelectedTime={
              startDateTime ? startDateTime.split(' ')[1] : ''
            }
            patientMemo=""
            doctor={doctor}
          />
        )}

        {newType == '2' && step == '0' && (
          <form
            id="searchPatient"
            className="mt-4 block"
            onSubmit={handleSearchPatient}
          >
            <div className="flex w-full px-16">
              <h1 className="mx-auto pb-2 text-xl font-bold">会員検索</h1>
            </div>
            <div className="mt-2 block w-full  px-16">
              <label className="w-full py-2">会員No</label>
              <input className="w-full rounded-xl p-4" name="userId" />
            </div>
            <div className="mt-4 flex w-full px-16">
              <button
                className="mr-8 w-32  rounded-xl border-2 border-main-500 bg-white p-2"
                onClick={() => setNewType('0')}
              >
                戻る
              </button>
              <button
                className="ml-8 w-32  rounded-xl border-2 border-main-500 bg-main-400 p-2"
                type="submit"
              >
                検索
              </button>
            </div>
          </form>
        )}

        {newType == '2' && step == '1' && (
          <div className="mt-4">
            <div className="flex w-full px-16">
              <h1 className="mx-auto pb-2 text-xl font-bold">会員検索結果</h1>
            </div>
            <div className="mt-2 block  w-full rounded bg-white">
              <table className="w-full text-center">
                <thead>
                  <tr>
                    <th>会員No.</th>
                    <th>氏名</th>
                    <th>フリガナ</th>
                    <th>誕生日</th>
                  </tr>
                </thead>
                <tbody>
                  <tr
                    className={`${isClicked ? 'border-2 border-black bg-primary-admin' : ''} h-[40px] cursor-pointer`}
                    onClick={clickRow}
                  >
                    <td>No.00{patient?.id}</td>
                    <td
                      className={`${!patient?.firstName || !patient?.lastName ? 'text-red-500' : ''}`}
                    >
                      {patient?.firstName || ''} {patient?.lastName || ''}
                    </td>
                    <td
                      className={`${!patient?.firstNameFurigana || !patient?.lastNameFurigana ? 'text-red-500' : ''}`}
                    >
                      {patient?.firstNameFurigana || ''}{' '}
                      {patient?.lastNameFurigana || ''}
                    </td>
                    <td
                      className={`${String(patient?.birthYear) <= '1900-01-01' ? 'text-red-500' : ''}`}
                    >
                      {patient?.birthYear}
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
            <div className="mt-4 flex w-full px-16">
              <button
                className="mr-8 w-32  rounded-xl border-2 border-main-500 bg-white p-2"
                onClick={() => setStep('0')}
              >
                戻る
              </button>
              <button
                disabled={!isClicked}
                className={`${isClicked ? 'bg-white' : 'bg-gray-300'} mr-8  w-32 rounded-xl border-2 border-main-500 p-2`}
              >
                患者情報
              </button>
              <button
                disabled={!isClicked}
                className={`border-2 ${isClicked ? 'bg-main-400' : 'bg-gray-300'} ml-8 w-32 rounded-xl border-main-500 p-2`}
                onClick={() => setStep('2')}
              >
                選択
              </button>
            </div>
          </div>
        )}

        {newType == '2' && step == '2' && (
          <FormCreateReception
            setOpenDialog={setOpenDialog}
            handleBack={() => handleBackStep()}
            patientFirstName={patient?.firstName || ''}
            patientLastName={patient?.lastName || ''}
            patientFirstNameFurigana={patient?.firstNameFurigana || ''}
            patientLastNameFurigana={patient?.lastNameFurigana || ''}
            patientBirthDate={patient?.birthYear || ''}
            patientTel={patient?.phone || ''}
            patientId={patient?.id || 0}
            patientMenuId={0}
            patientSelectedDate={
              startDateTime ? startDateTime.split(' ')[0] : ''
            }
            patientSelectedTime={
              startDateTime ? startDateTime.split(' ')[1] : ''
            }
            patientMemo=""
            doctor={doctor}
          />
        )}
      </div>
    </Modal>
  )
}

export { AddScheduleDialog }
