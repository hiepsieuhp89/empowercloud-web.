import { format } from 'date-fns'
import React from 'react'

interface AppointmentTimeParams {
  startDate: Date
  name: string
}
const AppointmentTimeComponent: React.FC<AppointmentTimeParams> = ({
  startDate,
  name,
}) => {
  return (
    <div className="mr-4 flex w-full text-center">
      <div className="mr-16">{format(startDate, 'MM/dd')}</div>{' '}
      <div>{name}</div>
    </div>
  )
}

export default AppointmentTimeComponent
