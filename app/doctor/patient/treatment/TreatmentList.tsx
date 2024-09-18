'use client'
import React, { useCallback, useState } from 'react'
import MedicalHistoryComponent from './MedicalHistory'
import SymptomListComponent from './SymptomList'
import TreatmentHistoryComponent from './TreatmentHistory'

const PatientTreatmentList: React.FC = () => {
  const [startDate, setStartDate] = useState(new Date())

  // const setPreviousDate = useCallback(() => {
  //   const targetDate = addMonths(startDate, -1)
  //   setStartDate(targetDate)
  // }, [setStartDate, startDate])

  // const setNextDate = useCallback(() => {
  //   const targetDate = addMonths(startDate, 1)
  //   setStartDate(targetDate)
  // }, [setStartDate, startDate])

  const onClickFunction = useCallback(() => {
    console.log('click')
  }, [])

  const setDay = useCallback(
    (event: { target: { value: string | number | Date } }) => {
      setStartDate(new Date(event.target.value))
    },
    [setStartDate],
  )

  return (
    <>
      <TreatmentHistoryComponent
        setDay={setDay}
        startDate={startDate}
        patientId=""
        onClickFunction={onClickFunction}
      />

      <MedicalHistoryComponent
        startDate={startDate}
        patientId=""
        onClickFunction={() => {}}
      />

      <SymptomListComponent
        startDate={startDate}
        patientId=""
        onClickFunction={() => {}}
      />

      {/* <div className="flex py-4 text-black">
        <div className="mx-auto"></div>
        <button className="mx-4 flex w-16" onClick={setPreviousDate}>
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
          前月
        </button>
        <button className="mx-4 flex w-16" onClick={setNextDate}>
          次月
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
      </div> */}
    </>
  )
}

export default PatientTreatmentList
