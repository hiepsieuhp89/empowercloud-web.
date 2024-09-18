'use client'
import DoctorSelect from '@/components/DoctorsPopup'
import type { Doctor } from '@/gen/proto/v1/reception_pb'
import { addMonths, addWeeks, format } from 'date-fns'
import { useCallback } from 'react'

interface MenuBarCalendarComponentProps {
  role: string
  startDate: Date
  mode: string
  setMode: React.Dispatch<React.SetStateAction<string>>
  setStartDate: React.Dispatch<React.SetStateAction<Date>>
  addSchedule: (value: string) => void
  setCalendarMode: React.Dispatch<React.SetStateAction<string>>
  setSelectedDoctor: React.Dispatch<React.SetStateAction<Doctor | undefined>>
  clinnicId: number
}

const MenuBarCalendarComponent: React.FC<MenuBarCalendarComponentProps> = ({
  role,
  startDate,
  addSchedule,
  setStartDate,
  mode,
  setMode,
  setSelectedDoctor,
  clinnicId,
}) => {
  const onClickFunction = () => {
    addSchedule('')
  }

  const setPreviousDate = () => {
    if (mode == 'week') {
      setStartDate(addWeeks(startDate, -1))
    } else {
      setStartDate(addMonths(startDate, -1))
    }
  }
  const setNextDate = () => {
    if (mode == 'week') {
      setStartDate(addWeeks(startDate, 1))
    } else {
      setStartDate(addMonths(startDate, 1))
    }
  }

  const setDay = (event: { target: { value: string | number | Date } }) => {
    setStartDate(new Date(event.target.value))
  }

  const handleSelectDoctor = useCallback(
    (doctor: Doctor | undefined) => {
      setSelectedDoctor(doctor)
    },
    [setSelectedDoctor],
  )

  return (
    <div
      className={`block lg:px-16 ${role == 'admin' ? 'bg-primary-admin' : 'bg-primary-client'} flex py-4 text-black`}
    >
      <button
        className="mr-4 w-16 rounded border border-black bg-white"
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
        className="w-32 px-2"
        type="date"
        onChange={setDay}
        value={format(startDate, 'yyyy-MM-dd')}
        defaultValue={format(startDate, 'yyyy-MM-dd')}
      />
      <button
        className="mx-4 w-16 rounded border border-black bg-white"
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
      <button
        onClick={() => setMode('week')}
        className={`ml-4 w-16 border-black text-sm ${mode == 'week' ? 'bg-main-500 text-white' : 'bg-white'}`}
      >
        週間
      </button>
      <button
        onClick={() => setMode('month')}
        className={`mr-4 w-16 border-black text-sm ${mode == 'week' ? 'bg-white' : 'bg-main-500 text-white'}`}
      >
        月間
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
      <DoctorSelect
        onSelect={handleSelectDoctor}
        styleSelect="w-60"
        clinnicId={clinnicId}
      />
      <div className="mx-auto"></div>
      <div className="flex w-32 items-center">
        <button
          className="font-base rounded-2xl border-2 border-main-200 bg-gray-100 px-4 hover:bg-main-500 hover:text-white"
          onClick={onClickFunction}
        >
          新規予約
        </button>
      </div>
    </div>
  )
}

export { MenuBarCalendarComponent }
