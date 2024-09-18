import React, { useState } from 'react'

interface RangeTimeSelectionParams {
  startTime: string
  setStartTime: (value: string) => void
  endTime: string
  setEndTime: (value: string) => void
}
const RangeTimeSelection: React.FC<RangeTimeSelectionParams> = ({
  startTime,
  endTime,
  setStartTime,
  setEndTime,
}) => {
  const [startHour, setStartHour] = useState(startTime.split(':')[0])
  const [startMinute, setStartMinute] = useState(startTime.split(':')[1])

  const [endHour, setEndHour] = useState(endTime.split(':')[0])
  const [endMinute, setEndMinute] = useState(endTime.split(':')[1])

  const hours = [
    '',
    '08',
    '09',
    '10',
    '11',
    '12',
    '13',
    '14',
    '15',
    '16',
    '17',
    '18',
    '19',
    '20',
    '21',
    '22',
    '23',
    '00',
    '01',
    '02',
    '03',
    '04',
    '05',
    '06',
    '07',
  ]
  const minutes = [
    '',
    '00',
    '05',
    '10',
    '15',
    '20',
    '25',
    '30',
    '35',
    '40',
    '45',
    '50',
    '55',
  ]

  const updateStartHour = (e: {
    target: { value: React.SetStateAction<string> }
  }) => {
    setStartHour(e.target.value)
    setStartTime(`${e.target.value}:${startMinute}`)
  }

  const updateStartMinute = (e: {
    target: { value: React.SetStateAction<string> }
  }) => {
    setStartMinute(e.target.value)
    setStartTime(`${startHour}:${e.target.value}`)
  }

  const updateEndHour = (e: {
    target: { value: React.SetStateAction<string> }
  }) => {
    setEndHour(e.target.value)
    setEndTime(`${e.target.value}:${endMinute}`)
  }

  const updateEndMinute = (e: {
    target: { value: React.SetStateAction<string> }
  }) => {
    setEndMinute(e.target.value)
    setEndTime(`${endHour}:${e.target.value}`)
  }

  return (
    <div className="my-2 flex w-full items-center justify-center">
      <div className="border">
        <select
          className="m-2 w-16"
          onChange={updateStartHour}
          value={startHour}
        >
          {hours.map((h) => (
            <option key={`start_hours_${h}`} value={h}>
              {h || '-'}
            </option>
          ))}
        </select>
      </div>
      <div className="ml-1 border">
        <select
          className="m-2 w-16"
          onChange={updateStartMinute}
          value={startMinute}
        >
          {minutes.map((m) => (
            <option key={`start_minutes_${m}`} value={m}>
              {m || '-'}
            </option>
          ))}
        </select>
      </div>
      <div className="w-8 text-center">~</div>
      <div className="border">
        <select className="m-2 w-16" onChange={updateEndHour} value={endHour}>
          {hours.map((h) => (
            <option key={`end_hours_${h}`} value={h}>
              {h || '-'}
            </option>
          ))}
        </select>
      </div>
      <div className="ml-1 border">
        <select
          className="m-2 w-16"
          onChange={updateEndMinute}
          value={endMinute}
        >
          {minutes.map((m) => (
            <option key={`end_minutes_${m}`} value={m}>
              {m || '-'}
            </option>
          ))}
        </select>
      </div>
    </div>
  )
}

export default RangeTimeSelection
