'use client'
import React, { useCallback, useState } from 'react'
import AllergyHistoryComponent from './AllergyHistory'
import MedicalHistoryComponent from './MedicalHistory'
import RegularListComponent from './RegularList'
import SymptomListComponent from './SymptomList'

const PatientEffectList: React.FC = () => {
  const [startDate, setStartDate] = useState(new Date())

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
      <AllergyHistoryComponent
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

      <RegularListComponent
        startDate={startDate}
        patientId=""
        onClickFunction={() => {}}
      />
    </>
  )
}

export default PatientEffectList
