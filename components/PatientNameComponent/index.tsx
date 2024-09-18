import type { Patient } from '@/gen/proto/v1/patient_pb'
import React from 'react'

interface PatientNameComponentParams {
  data: Patient
  showBirth?: boolean
}
const PatientNameComponent: React.FC<PatientNameComponentParams> = ({
  data,
  showBirth = true,
}) => {
  return (
    <div className="w-full text-center">
      <div>
        <p
          className={`${!data.firstName || !data.lastName || !data.firstNameFurigana || !data?.lastNameFurigana ? 'text-red-500' : ''}`}
        >
          <ruby>
            {data.firstName}
            {data.lastName}
            <rt>
              {data.firstNameFurigana}
              {data?.lastNameFurigana}
            </rt>
          </ruby>
        </p>
        {showBirth && (
          <p
            className={`${String(data.birthYear) <= '1900-01-01' ? 'text-red-500' : ''}`}
          >
            {data?.birthYear}
          </p>
        )}
      </div>
    </div>
  )
}

export default PatientNameComponent
