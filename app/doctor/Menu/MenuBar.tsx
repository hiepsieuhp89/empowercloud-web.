'use client'
import DoctorSelect from '@/components/DoctorsPopup'
import MultiSelectStatus from '@/components/MultiSelectStatus'
import type { Doctor } from '@/gen/proto/v1/reception_pb'
import { addDays, format } from 'date-fns'
import React, { useCallback } from 'react'

interface MenuBarComponentProps {
  role: string
  startDate: Date
  setStartDate: React.Dispatch<React.SetStateAction<Date>>
  showStatus: boolean
  setSelectedDoctor: React.Dispatch<React.SetStateAction<Doctor | undefined>>
  selectedOptions: number[]
  setSelectedOptions: React.Dispatch<React.SetStateAction<number[]>>
  completeReceptionPer?: { completed: number; total: number }
  clinnicId: number
}

const MenuBarComponent: React.FC<MenuBarComponentProps> = ({
  role,
  startDate,
  setStartDate,
  showStatus = true,
  selectedOptions,
  setSelectedOptions,
  setSelectedDoctor,
  completeReceptionPer,
  clinnicId,
}) => {
  const handleSelectDoctor = (doctor: Doctor | undefined) => {
    setSelectedDoctor(doctor)
  }

  const setPreviousDate = useCallback(() => {
    const targetDate = addDays(startDate, -1)
    setStartDate(targetDate)
  }, [setStartDate, startDate])

  const setNextDate = useCallback(() => {
    const targetDate = addDays(startDate, 1)
    setStartDate(targetDate)
  }, [setStartDate, startDate])

  const setToday = useCallback(() => {
    const targetDate = new Date()
    setStartDate(targetDate)
  }, [setStartDate])

  const setDay = useCallback(
    (event: { target: { value: string | number | Date } }) => {
      setStartDate(new Date(event.target.value))
    },
    [setStartDate],
  )

  return (
    <div
      className={`block ${role == 'admin' ? 'bg-primary-admin' : 'bg-primary-client'} flex py-4 text-black lg:px-16`}
    >
      <div className="flex w-fit">
        <button
          className="mr-2 w-16 rounded border border-black bg-white px-4"
          onClick={setPreviousDate}
        >
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
              d="M15.75 19.5 8.25 12l7.5-7.5"
            />
          </svg>
        </button>
        <input
          className="w-34 px-2"
          type="date"
          onChange={setDay}
          value={format(startDate, 'yyyy-MM-dd')}
          defaultValue={format(startDate, 'yyyy-MM-dd')}
        />
        <button
          className="mx-2 w-20 rounded border border-black bg-white"
          onClick={setToday}
        >
          今日
        </button>
        <button
          className="w-16 rounded border border-black bg-white px-4"
          onClick={setNextDate}
        >
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
              d="m8.25 4.5 7.5 7.5-7.5 7.5"
            />
          </svg>
        </button>
        <button>
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
              d="M15.75 6a3.75 3.75 0 1 1-7.5 0 3.75 3.75 0 0 1 7.5 0ZM4.501 20.118a7.5 7.5 0 0 1 14.998 0A17.933 17.933 0 0 1 12 21.75c-2.676 0-5.216-.584-7.499-1.632Z"
            />
          </svg>
        </button>
      </div>
      <DoctorSelect
        onSelect={handleSelectDoctor}
        styleSelect="w-60 ml-2"
        clinnicId={clinnicId}
      />
      {showStatus && (
        <div className="ml-2 flex w-full items-center justify-between">
          <MultiSelectStatus
            selectedOptions={selectedOptions}
            onChange={setSelectedOptions}
          />
          <div className="ml-2 flex items-center justify-between">
            <p className="w-fit">
              本日の診察完了: {completeReceptionPer?.completed || 0}/
              {completeReceptionPer?.total || 0}
            </p>
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
        </div>
      )}
    </div>
  )
}

export { MenuBarComponent }
