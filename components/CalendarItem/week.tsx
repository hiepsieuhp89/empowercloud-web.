import React from 'react'

import type { ScheduleData } from '@/gen/proto/v1/schedule_list_pb'
import { format, parse } from 'date-fns'

interface CalendarWeekItemParams {
  addSchedule: (value: string) => void
  item: {
    date: string
    schedules: { title: string; id: number }[]
    isHoliday: boolean
    warning?: string
  }
  record: ScheduleData
}
const CalendarWeekItemComponent: React.FC<CalendarWeekItemParams> = ({
  addSchedule,
  record,
  item,
}) => {
  return (
    <div
      className="block h-40 w-full px-2 text-left text-xl text-gray-400"
      onClick={() => addSchedule(record.startTime)}
    >
      <div className="flex w-full flex-wrap text-xs">
        <div className="w-full">
          {item ? format(parse(item.date, 'yyyy-MM-dd', new Date()), 'dd') : ''}
        </div>
        {item?.schedules &&
          item.schedules.length > 0 &&
          item.schedules.slice(0, 9).map((schedule) => {
            return (
              <div className="w-1/3 px-2" key={schedule.id}>
                <button className="round mb-2 h-8 w-full rounded border border-black text-gray-600">
                  {schedule.title}
                </button>
              </div>
            )
          })}
        {item?.schedules && item.schedules.length > 9 && (
          <button className="text-gray-600">...</button>
        )}
      </div>
    </div>
  )
}

export default CalendarWeekItemComponent
