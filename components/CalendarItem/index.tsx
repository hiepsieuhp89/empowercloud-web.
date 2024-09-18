import React from 'react'

import type { ScheduleData } from '@/gen/proto/v1/schedule_list_pb'

interface CalendarItemParams {
  addSchedule: (value: string) => void
  item: {
    date: string
    schedules: { title: string; id: number }[]
    isHoliday: boolean
    warning?: string
  }
  record: ScheduleData
  editSchedule: (value: number) => void
}
const CalendarItemComponent: React.FC<CalendarItemParams> = ({
  addSchedule,
  record,
  item,
  editSchedule,
}) => {
  return (
    <div
      className={`block h-40 w-full px-2 text-left text-xl text-gray-400 ${item && item.isHoliday ? 'relative bg-main-50' : ''}`}
      onClick={() => addSchedule(`${item.date} ${record.startTime}`)}
    >
      <div
        className={`flex w-full text-left ${item && item.isHoliday ? '' : 'text-gray-600'} mb-2`}
      >
        <div>{record.startTime}</div>
        {item && item.warning && (
          <div className="flex">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth="1.5"
              stroke="currentColor"
              className="size-6 text-red-600"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M12 9v3.75m9-.75a9 9 0 1 1-18 0 9 9 0 0 1 18 0Zm-9 3.75h.008v.008H12v-.008Z"
              />
            </svg>
            <button className="border bg-gray-100 text-xs">
              {item.warning}
            </button>
          </div>
        )}
      </div>
      {item?.isHoliday && (
        <div className="absolute inset-0 flex w-full items-center justify-center">
          休診
        </div>
      )}
      <div className="flex w-full flex-wrap">
        {item?.schedules &&
          item.schedules.length > 0 &&
          item.schedules.slice(0, 6).map((schedule) => {
            return (
              <div key={schedule.id} className="w-1/2 px-2">
                <button
                  title={schedule.title}
                  onClick={(e) => {
                    e.stopPropagation()
                    editSchedule(schedule.id)
                  }}
                  className="round w-full truncate rounded-md border bg-other-schedule text-sm text-gray-600"
                >
                  {schedule.title}
                </button>
              </div>
            )
          })}
        {item?.schedules && item.schedules.length > 6 && (
          <button className="round mb w-full rounded-xl text-gray-600">
            ...
          </button>
        )}
      </div>
    </div>
  )
}

export default CalendarItemComponent
