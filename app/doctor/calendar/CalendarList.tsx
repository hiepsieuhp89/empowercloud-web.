'use client'
import { MenuBarCalendarComponent } from '@/app/doctor/Menu/MenuBarCalendar'
import type { DataItem } from '@/components/Table'
import Table from '@/components/Table'
import { AddScheduleDialog } from '@/components/dialog/AddScheduleDialog'
import { HourSchedule, ScheduleData } from '@/gen/proto/v1/schedule_list_pb'
import { scheduleList } from '@/server/schedule'
import type { RenderSchedule, SessionProps, SessionUser } from '@/utils/type'
import React, { useCallback, useEffect, useState } from 'react'

import CalendarItemComponent from '@/components/CalendarItem'
import { EditScheduleDialog } from '@/components/dialog/EditScheduleDialog'
import type { Doctor } from '@/gen/proto/v1/reception_pb'
import type { Shift } from '@/gen/proto/v1/shift_pb'
import {
  ListWorkScheduleRequest,
  type WorkSchedule,
} from '@/gen/proto/v1/shift_pb'
import { listShift, listWorkSchedule } from '@/server/shift'
import {
  addDays,
  addMinutes,
  addMonths,
  eachDayOfInterval,
  format,
  parse,
} from 'date-fns'

const CalendarList: React.FC<SessionProps> = ({ session }) => {
  const role = 'admin'
  const user = session?.user as SessionUser

  const [schedules, setSchedules] = useState<ScheduleData[]>([])

  const [startDate, setStartDate] = useState(new Date())

  const [startDateTime, setStartDateTime] = useState('')
  const [mode, setMode] = useState('week')
  const [calendarMode, setCalendarMode] = useState('1')
  const [selectedDoctor, setSelectedDoctor] = useState<Doctor>()

  const [showDialog, setShowDialog] = useState(false)
  const [showEditDialog, setShowEditDialog] = useState(false)
  const [receptionId, setReceptionId] = useState<number>()
  const [workSchedules, setWorkSchedules] = useState<WorkSchedule[]>()
  const [timeSheet, setTimeSheet] = useState<Shift[]>([])

  const [columns, setColums] = useState<
    {
      title: string
      index: string | number
      render: RenderSchedule
      className: string
    }[]
  >([])

  const addSchedule = useCallback(
    (value: string) => {
      setStartDateTime(value)
      setShowDialog(true)
    },
    [setShowDialog],
  )

  const editSchedule = useCallback(
    (value: number) => {
      //setStartDateTime(value)
      setReceptionId(value)
      setShowEditDialog(true)
    },
    [setShowEditDialog, setReceptionId],
  )

  const weekendStyle = useCallback((item: string) => {
    const dateString = parse(item, 'yyyy-MM-dd', new Date()).toLocaleString(
      'ja-JP',
      {
        weekday: 'short',
      },
    )
    return dateString == '土'
      ? 'text-other-blue'
      : dateString == '日'
        ? 'text-red-300'
        : 'text-gray-400'
  }, [])

  const headerTitle = useCallback((item: string) => {
    return `${parse(item, 'yyyy-MM-dd', new Date()).toLocaleString('ja-JP', {
      weekday: 'short',
    })} <br/> ${format(parse(item, 'yyyy-MM-dd', new Date()), 'dd')}`
  }, [])

  const headerWeekTitle = useCallback((item: string) => {
    return `${parse(item, 'yyyy-MM-dd', new Date()).toLocaleString('ja-JP', {
      weekday: 'short',
    })}`
  }, [])

  const fetchShiftData = useCallback(async () => {
    const response = await listShift(user.clinic_id)
    setTimeSheet(response.shifts)
  }, [setTimeSheet, user])

  useEffect(() => {
    fetchShiftData()
  }, [startDate, fetchShiftData]) //s

  const checkIsInRange = useCallback(
    (start: string, end: string, val: string) => {
      if (val >= start && val < end) return true
      return false
    },
    [],
  )

  const checkIsWorkingTime = useCallback(
    (workTime: string, workShift: Shift | undefined) => {
      if (!workShift) return false

      if (workShift.isOff) return false

      if (
        !checkIsInRange(
          workShift.workStartTime,
          workShift.workEndTime,
          workTime,
        )
      )
        return false

      if (
        workShift.firstBreakStartTime &&
        checkIsInRange(
          workShift.firstBreakStartTime,
          workShift.firstBreakEndTime,
          workTime,
        )
      )
        return false

      if (
        workShift.secondBreakStartTime &&
        checkIsInRange(
          workShift.secondBreakStartTime,
          workShift.secondBreakEndTime,
          workTime,
        )
      )
        return false

      return true
    },
    [checkIsInRange],
  )

  const convertToViewData = useCallback(
    (items: ScheduleData[], times: string[], days: string[]) => {
      const newData: ScheduleData[] = []
      times.forEach((time) => {
        const timeData: ScheduleData = ScheduleData.fromJson({
          start_time: time,
          data: [],
        })
        const filteredData = items.filter((i) => i.startTime == time)
        for (let ii = 0; ii < days.length; ii++) {
          const dayData = filteredData.findLast(
            (i) =>
              i.data[0] &&
              format(new Date(i.data[0].date), 'yyyy-MM-dd') == days[ii],
          )
          let workingTimeOfDoctor
          if (selectedDoctor) {
            const shiftOfDay = workSchedules?.findLast(
              (i) => i.calendarDate == days[ii],
            )?.shiftId
            if (shiftOfDay) {
              workingTimeOfDoctor = timeSheet.findLast(
                (i) => i.id == shiftOfDay,
              )
            }
          }

          if (dayData) {
            const dataSchedule = HourSchedule.fromJson({
              date: days[ii],
              is_holiday: selectedDoctor
                ? !checkIsWorkingTime(time, workingTimeOfDoctor)
                : false,
              warning: selectedDoctor
                ? dayData.data[0].schedules.length > 2
                  ? '複数予約があり'
                  : ''
                : '',
              schedules: [],
            })
            dataSchedule.schedules = dayData.data[0].schedules
            timeData.data.push(dataSchedule)
          } else {
            timeData.data.push(
              HourSchedule.fromJson({
                date: days[ii],
                is_holiday: selectedDoctor
                  ? !checkIsWorkingTime(time, workingTimeOfDoctor)
                  : false,
                warning: '',
                schedules: [],
              }),
            )
          }
        }
        newData.push(timeData)
      })
      return newData
    },
    [workSchedules, selectedDoctor, timeSheet, checkIsWorkingTime],
  )

  const fetchDoctorWorkTime = useCallback(async () => {
    if (startDate && selectedDoctor) {
      const endDateTmp =
        mode == 'week'
          ? addDays(new Date(startDate), 7)
          : addMonths(new Date(startDate), 1)
      const requestParams = new ListWorkScheduleRequest({
        clinicId: user.clinic_id,
        staffId: selectedDoctor.id,
        startDate: startDate.toISOString().split('T')[0],
        endDate: endDateTmp.toISOString().split('T')[0],
      })
      //requestParams.staffId = 1
      const sheduleData = await listWorkSchedule(requestParams)
      setWorkSchedules(sheduleData.schedules)
    } else {
      setWorkSchedules([])
    }
  }, [startDate, selectedDoctor, setWorkSchedules, mode, user])

  useEffect(() => {
    fetchDoctorWorkTime()
  }, [startDate, mode, selectedDoctor, fetchDoctorWorkTime])

  useEffect(() => {
    // Function to fetch data
    const fetchData = async () => {
      const endDateTmp =
        mode == 'week'
          ? addDays(new Date(startDate), 7)
          : addMonths(new Date(startDate), 1)
      const res = await scheduleList({
        fromDate: startDate.toISOString().split('T')[0],
        toDate: endDateTmp.toISOString().split('T')[0],
        doctor: selectedDoctor ? selectedDoctor.id : undefined,
        mode: undefined,
        page: undefined,
        size: undefined,
      })

      if (calendarMode == '1') {
        const tmpColums: {
          title: string
          index: string | number
          render: RenderSchedule
          className: string
        }[] = []

        const days = eachDayOfInterval({
          start: startDate,
          end: endDateTmp,
        }).map((day) => format(day, 'yyyy-MM-dd'))
        const workingTimes = res.receptions.map((i) => i.startTime).sort()

        let startWorkTime = '09:00'
        if (startWorkTime > workingTimes[0]) {
          startWorkTime = workingTimes[0]
        }

        let endWorkTime = '20:00'
        if (endWorkTime < workingTimes[workingTimes.length - 1]) {
          endWorkTime = workingTimes[workingTimes.length - 1]
        }

        const interval = 15 // Interval in minutes

        const startTime = parse(startWorkTime, 'HH:mm', new Date())
        const endTime = parse(endWorkTime, 'HH:mm', new Date())

        let currentTime = startTime
        const timeSlots: string[] = []

        while (currentTime <= endTime) {
          timeSlots.push(format(currentTime, 'HH:mm'))
          currentTime = addMinutes(currentTime, interval)
        }

        const viewedData: ScheduleData[] = convertToViewData(
          res.receptions,
          timeSlots,
          days,
        )

        days.forEach((item, _index) => {
          tmpColums.push({
            title: headerTitle(item),
            index: 'data',
            render: (
              rowItems: {
                date: string
                schedules: { title: string; id: number }[]
                isHoliday: boolean
                warning?: string
              }[],
              record: DataItem, //ScheduleData
            ) => (
              <CalendarItemComponent
                item={rowItems[_index]}
                record={record as ScheduleData}
                editSchedule={editSchedule}
                addSchedule={addSchedule}
              />
            ),
            className: `max-w-[200px] 3xl:max-w-[240px] 4xl:max-w-[280px] text-xl border border-main-200 bg-white min-w-[220px] max-w-[220px] ${weekendStyle(item)} `,
          })
        })

        setSchedules(viewedData)
        setColums(tmpColums)
      }
    }

    // Call fetchData when component mounts
    fetchData()
  }, [
    mode,
    startDate,
    addSchedule,
    headerTitle,
    weekendStyle,
    calendarMode,
    headerWeekTitle,
    selectedDoctor,
    convertToViewData,
    editSchedule,
  ])

  return (
    <>
      <MenuBarCalendarComponent
        role={role}
        startDate={startDate}
        setStartDate={setStartDate}
        addSchedule={addSchedule}
        mode={mode}
        setMode={setMode}
        setCalendarMode={setCalendarMode}
        setSelectedDoctor={setSelectedDoctor}
        clinnicId={user.clinic_id}
      />
      <div className="mx-8 h-screen justify-center overflow-hidden lg:mx-16">
        <div className="h-5/6 overflow-auto border-4 border-black">
          {calendarMode == '1' && <Table columns={columns} data={schedules} />}
        </div>
      </div>
      <AddScheduleDialog
        startDateTime={startDateTime}
        setOpenDialog={setShowDialog}
        openDialog={showDialog}
        doctor={selectedDoctor}
      />

      {receptionId && (
        <EditScheduleDialog
          setOpenDialog={setShowEditDialog}
          openDialog={showEditDialog}
          receptionId={receptionId}
        />
      )}
    </>
  )
}

export default CalendarList
