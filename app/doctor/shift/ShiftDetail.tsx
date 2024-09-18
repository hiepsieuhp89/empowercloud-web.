'use client'
import ColorSelection from '@/components/ColorSelection'
import CommonModal from '@/components/CommonModal'
import EditableStaffRole from '@/components/EditableStaffRole'
import RangeTimeSelection from '@/components/RangeTimeSelection'
import type { Clinic } from '@/gen/proto/v1/clinic_pb'
import type { WorkSchedule } from '@/gen/proto/v1/shift_pb'
import {
  ListWorkScheduleRequest,
  Shift,
  StoreShiftItem,
  StoreWorkScheduleItem,
} from '@/gen/proto/v1/shift_pb'
import type { Staff } from '@/gen/proto/v1/staff_pb'
import { clinicList } from '@/server/clinic'
import { getStaffList, storeStaff } from '@/server/doctor'
import {
  listShift,
  listWorkSchedule,
  storeShift,
  storeWorkSchedule,
} from '@/server/shift'
import { getPositionName, type PositionRole } from '@/utils/reception'
import type { SessionProps, SessionUser } from '@/utils/type'
import { format, parse } from 'date-fns'
import { Parser } from 'json2csv'
import React, { useCallback, useEffect, useMemo, useState } from 'react'

const ShiftDetail: React.FC<SessionProps> = ({ session }) => {
  const user = useMemo(() => {
    return session?.user as SessionUser
  }, [session?.user])
  //const shiftMasterData: any[] | (() => any[]) = [] //generateShiftMasterDummyData()
  const [timeSheet, setTimeSheet] = useState<Shift[]>([])
  const [staffList, setStaffList] = useState<Staff[]>([])
  const [searchFromDay, setSearchFromDay] = useState<string>('')
  const [searchToDay, setSearchToDay] = useState<string>('')
  const [staffId, setStaffId] = useState<number>()
  const [workSchedules, setWorkSchedules] = useState<WorkSchedule[]>([])
  const [errorMessage, setErrorMessage] = useState('')
  const [modalIsOpen, setModalIsOpen] = useState(false)

  const [startDate, setStartDate] = useState(new Date())
  const [clinics, setClinics] = useState<Clinic[]>([])
  const [clinicId, setClinicId] = useState<number>(user.clinic_id)

  const [dates, setDates] = useState<string[]>([]) //staffDummy.dates
  const [staffData, setStaffData] = useState<
    {
      id: bigint
      name: string
      office: string
      shift: number[]
      changed: number[]
    }[]
  >([]) //

  const convertDbToScheduleList = useCallback(
    (items: WorkSchedule[]) => {
      const holidayShift = timeSheet.findLast((i) => i.isOff == 1)
      const tmpDataSchedule: {
        id: bigint
        name: string
        office: string
        shift: number[]
        changed: number[]
      }[] = []
      if (staffId && Number(staffId) > 0) {
        staffList
          .filter((i) => i.id == BigInt(staffId))
          .forEach((staff) => {
            const staffSchedules = items.filter(
              (_i) => _i.staffId == Number(staff.id),
            )
            tmpDataSchedule.push({
              id: staff.id,
              name: staff.firstName + staff.lastName,
              office: staff.position,
              changed: [],
              shift: dates.map((i) =>
                Number(
                  staffSchedules.findLast((k) => k.calendarDate == i)
                    ?.shiftId || holidayShift?.id,
                ),
              ),
            })
          })
        setStaffData(tmpDataSchedule)
      } else {
        staffList.forEach((staff) => {
          const staffSchedules = items.filter(
            (_i) => _i.staffId == Number(staff.id),
          )
          tmpDataSchedule.push({
            id: staff.id,
            name: staff.firstName + staff.lastName,
            office: staff.position,
            changed: [],
            shift: dates.map((i) =>
              Number(
                staffSchedules.findLast((k) => k.calendarDate == i)?.shiftId ||
                  holidayShift?.id,
              ),
            ),
          })
        })
        setStaffData(tmpDataSchedule)
      }
    },
    [timeSheet, dates, staffList, staffId],
  )
  const fetchDoctors = useCallback(async () => {
    const response = await getStaffList({
      clinnicId: user.clinic_id,
      keyword: '',
      page: 1,
      size: 100,
    })
    setStaffList(response.staffs)
  }, [setStaffList, user.clinic_id])

  const fetchScheduleData = useCallback(async () => {
    if (searchFromDay && searchToDay) {
      const requestParams = new ListWorkScheduleRequest({
        clinicId: user.clinic_id,
        staffId: Number(staffId),
        startDate: searchFromDay,
        endDate: searchToDay,
      })
      //requestParams.staffId = 1
      const sheduleData = await listWorkSchedule(requestParams)
      setWorkSchedules(sheduleData.schedules)
      convertDbToScheduleList(sheduleData.schedules)
    }
  }, [
    searchToDay,
    searchFromDay,
    convertDbToScheduleList,
    staffId,
    user.clinic_id,
  ])

  const fetchShiftData = useCallback(async () => {
    try {
      const response = await listShift(user.clinic_id)

      setTimeSheet(response.shifts)
    } catch (error) {
      console.error('Error fetching data:', error)
      setErrorMessage('シフトデータが見つかりません')
      setModalIsOpen(true)
    }
  }, [setTimeSheet, user.clinic_id])

  useEffect(() => {
    fetchShiftData()
  }, [startDate, fetchShiftData]) //s

  useEffect(() => {
    fetchDoctors()
    //fetchScheduleData()
    //fetchShiftData()
  }, [startDate, fetchDoctors]) //startDate

  useEffect(() => {
    fetchScheduleData()
  }, [startDate, fetchScheduleData]) //startDate

  const fetchClinicList = useCallback(async () => {
    const res = await clinicList('', 1, 100)
    setClinics(
      res.clinics.filter(
        (cl) => cl.id == user.clinic_id || user.role == 'admin',
      ),
    )
  }, [setClinics, user.clinic_id, user.role])

  useEffect(() => {
    fetchClinicList()
  }, [fetchClinicList])

  const changeClinicId = useCallback(
    async (value: string) => {
      setClinicId(Number(value))
      await storeStaff({ id: BigInt(user.id), clinicId: BigInt(value) })
      window.location.reload()
    },
    [user.id, setClinicId],
  )

  useEffect(() => {
    const firstDayCurrentMonth = new Date(
      startDate.getFullYear(),
      startDate.getMonth(),
      1,
    )
    // Get the first day of the next month
    const firstDayNextMonth = new Date(
      startDate.getFullYear(),
      startDate.getMonth() + 1,
      1,
    )

    setSearchFromDay(firstDayCurrentMonth.toISOString().split('T')[0])
    setSearchToDay(firstDayNextMonth.toISOString().split('T')[0])

    const dateList: string[] = []
    const currentDate = new Date(firstDayCurrentMonth)

    while (currentDate < firstDayNextMonth) {
      dateList.push(currentDate.toISOString().split('T')[0])
      currentDate.setDate(currentDate.getDate() + 1)
    }

    setDates(dateList)
  }, [startDate])

  const setDay = useCallback(
    (e: { target: { value: string | number | Date } }) => {
      if (e.target.value) {
        setStartDate(new Date(e.target.value))
      } else {
        setStartDate(new Date())
      }
    },
    [setStartDate],
  )

  const updateStaffId = useCallback(
    (value: string) => {
      setStaffId(Number(value))
    },
    [setStaffId],
  )

  const updateName = (shiftId: number, value: string) => {
    const timeSheetTmp = [...timeSheet]
    timeSheetTmp[shiftId].category = value
    setTimeSheet(timeSheetTmp)
  }

  const updateColor = (shiftId: number, value: string) => {
    const timeSheetTmp = [...timeSheet]
    timeSheetTmp[shiftId].colorCode = value
    setTimeSheet(timeSheetTmp)
  }

  const updateAttendance = (shiftId: number, timeId: number, value: string) => {
    const timeSheetTmp = [...timeSheet]
    if (timeId == 0) {
      timeSheetTmp[shiftId].workStartTime = value == ':' ? '' : value
    } else {
      timeSheetTmp[shiftId].workEndTime = value == ':' ? '' : value
    }

    setTimeSheet(timeSheetTmp)
  }

  const updateMultiShift = useCallback(async () => {
    const data: StoreShiftItem[] = []
    timeSheet.forEach((i: Shift) => {
      data.push(new StoreShiftItem(i))
    })
    try {
      await storeShift(data)
      setErrorMessage('シフトデータが保存できました')
      setModalIsOpen(true)
    } catch (e) {
      setErrorMessage('シフトデータが保存できません')
      setModalIsOpen(true)
    } finally {
    }
  }, [timeSheet])

  const closeModal = useCallback(() => {
    setModalIsOpen(false)
    setErrorMessage('')
  }, [setModalIsOpen, setErrorMessage])

  const updateBreak = (
    shiftId: number,
    breakId: number,
    timeId: number,
    value: string,
  ) => {
    const timeSheetTmp = [...timeSheet]
    if (breakId == 0) {
      if (timeId == 0) {
        timeSheetTmp[shiftId].firstBreakStartTime = value == ':' ? '' : value
      } else {
        timeSheetTmp[shiftId].firstBreakEndTime = value == ':' ? '' : value
      }
    } else {
      if (timeId == 0) {
        timeSheetTmp[shiftId].secondBreakStartTime = value == ':' ? '' : value
      } else {
        timeSheetTmp[shiftId].secondBreakEndTime = value == ':' ? '' : value
      }
    }

    setTimeSheet(timeSheetTmp)
  }

  const convertTime = useCallback((item: string) => {
    return `${parse(item, 'yyyy-MM-dd', new Date()).toLocaleString('ja-JP', {
      weekday: 'short',
    })} <br/> ${format(parse(item, 'yyyy-MM-dd', new Date()), 'dd')}`
  }, [])

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

  const updateStaffData = useCallback(
    (staffId: number, shiftId: number, value: string) => {
      const staffDataTmp = [...staffData]
      staffDataTmp[staffId].shift[shiftId] = parseInt(value)
      staffDataTmp[staffId].changed.push(shiftId)
      setStaffData(staffDataTmp)
    },
    [staffData, setStaffData],
  )

  const updateAllStaffData = useCallback(
    (staffId: number, value: string) => {
      const staffDataTmp = [...staffData]
      staffDataTmp[staffId].shift = staffDataTmp[staffId].shift.map((_) => {
        return parseInt(value)
      })
      staffDataTmp[staffId].changed = staffDataTmp[staffId].shift.map(
        (_, j) => {
          return j
        },
      )
      setStaffData(staffDataTmp)
    },
    [staffData, setStaffData],
  )

  const addNewShift = useCallback(() => {
    const timeSheetTmp = [...timeSheet]
    timeSheetTmp.push(
      Shift.fromJson({
        id: 0,
        clinicId: user.clinic_id,
        category: '',
        isOff: 0,
        colorCode: '',
        workStartTime: '',
        workEndTime: '',
        firstBreakStartTime: '',
        firstBreakEndTime: '',
        secondBreakStartTime: '',
        secondBreakEndTime: '',
      }),
    )

    setTimeSheet(timeSheetTmp)
  }, [timeSheet, user])

  const updateStaffRole = useCallback(
    async (staffId: number, id: bigint, value: string) => {
      const staffDataTmp = [...staffData]
      staffDataTmp[staffId].office = value
      setStaffData(staffDataTmp)
      const staffDataValue = {
        id,
        position: value,
        clinicId: BigInt(user.clinic_id),
      }
      try {
        await storeStaff(staffDataValue)
        setErrorMessage('ポジションが保存できました')
        setModalIsOpen(true)
      } catch (e) {
        setErrorMessage('ポジションが保存できません')
        setModalIsOpen(true)
      }
    },
    [staffData, setStaffData, user],
  )

  const saveWorkSchedule = useCallback(async () => {
    const changedData: StoreWorkScheduleItem[] = []
    staffData.forEach((staff) => {
      Array.from(new Set(staff.changed)).forEach((i) => {
        changedData.push(
          new StoreWorkScheduleItem({
            id: Number(
              workSchedules.findLast(
                (w) =>
                  w.staffId == Number(staff.id) && w.calendarDate == dates[i],
              )?.id,
            ),
            shiftId: staff.shift[i],
            clinicId: user.clinic_id,
            staffId: Number(staff.id),
            calendarDate: dates[i],
          }),
        )
      })
    })

    try {
      await storeWorkSchedule(changedData)
      setErrorMessage('シフトデータが保存できました')
      setModalIsOpen(true)
    } catch (e) {
      setErrorMessage('シフトデータが保存できません')
      setModalIsOpen(true)
    } finally {
      await fetchShiftData()
    }
  }, [staffData, dates, workSchedules, user, fetchShiftData])

  const handleExport = useCallback(async () => {
    const csvHeaders: string[] = ['スタッフ', 'ポジション']
    dates.forEach((d) => {
      csvHeaders.push(d)
    })

    const data: {
      [key: string]: string
    }[] = []
    staffData.forEach((s) => {
      const staffItem: { [key: string]: string } = {
        スタッフ: s.name,
        ポジション: getPositionName(s.office as PositionRole),
      }
      s.shift.forEach((sh, si) => {
        staffItem[csvHeaders[si + 2]] =
          timeSheet.findLast((t) => t.id == sh)?.category || '休'
      })
      data.push(staffItem)
    })
    const json2csvParser = new Parser({ fields: csvHeaders })
    const csv = json2csvParser.parse(data)

    const blob = new Blob([csv], { type: 'text/csv' })
    const url = URL.createObjectURL(blob)

    const a = document.createElement('a')
    a.href = url
    a.download = `shift-data.csv`
    a.click()
    return false
  }, [staffData, dates, timeSheet])

  return (
    <div className="w-full">
      <div className="my-4 flex w-full text-gray-500">
        <div className="w-full px-4">
          <h1 className="w-full px-4 py-2 text-xl">シフト設定</h1>
          <div className="w-full px-4 py-2">
            <table className="w-full border-separate">
              <thead>
                <tr>
                  <th>シフトパターン名</th>
                  <th>カラー</th>
                  <th>出退勤時間</th>
                  <th>休憩時間１</th>
                  <th>休憩時間２</th>
                </tr>
              </thead>
              <tbody>
                {timeSheet.map(
                  (item, _i) =>
                    !item.isOff && (
                      <tr key={`row_${_i}`} className="space-y-3">
                        <td className="text-center">
                          <input
                            type="text"
                            value={item.category}
                            onChange={(e) => updateName(_i, e.target.value)}
                          ></input>
                        </td>
                        <td>
                          <ColorSelection
                            color={item.colorCode}
                            setColor={(value) => updateColor(_i, value)}
                          />
                        </td>
                        <td>
                          <RangeTimeSelection
                            startTime={item.workStartTime}
                            setStartTime={(value) =>
                              updateAttendance(_i, 0, value)
                            }
                            endTime={item.workEndTime}
                            setEndTime={(value) =>
                              updateAttendance(_i, 1, value)
                            }
                          />
                        </td>

                        <td>
                          <RangeTimeSelection
                            startTime={item.firstBreakStartTime}
                            setStartTime={(value) =>
                              updateBreak(_i, 0, 0, value)
                            }
                            endTime={item.firstBreakEndTime}
                            setEndTime={(value) => updateBreak(_i, 0, 1, value)}
                          />
                        </td>

                        <td>
                          <RangeTimeSelection
                            startTime={item.secondBreakStartTime}
                            setStartTime={(value) =>
                              updateBreak(_i, 1, 0, value)
                            }
                            endTime={item.secondBreakEndTime}
                            setEndTime={(value) => updateBreak(_i, 1, 1, value)}
                          />
                        </td>
                      </tr>
                    ),
                )}
              </tbody>
            </table>
            <div className="my-4 w-full">
              <button
                className="py hidden rounded bg-primary px-4 py-1 font-bold text-white"
                onClick={addNewShift}
              >
                追加
              </button>
              <button
                className="py rounded bg-primary px-4 py-1 font-bold text-white"
                onClick={updateMultiShift}
              >
                保存
              </button>
            </div>
          </div>

          <div className="flex">
            <h1 className="py-2 text-xl">シフト表</h1>

            <select
              className="w-42 mx-4 rounded py-2 text-center"
              value={clinicId}
              onChange={(e) => {
                changeClinicId(e.target.value)
              }}
            >
              {clinics.map((c, _i) => (
                <option key={_i} value={Number(c.id)}>
                  {c.name}
                </option>
              ))}
            </select>

            <select
              className="ml-8 w-32 text-center"
              onChange={(e) => updateStaffId(e.target.value)}
            >
              <option>----</option>
              {staffList.map((i, _type_index) => (
                <option value={Number(i.id)} key={`select_staff_id_${i.id}`}>
                  {i.firstName}
                  {i.lastName}
                </option>
              ))}
            </select>

            <input
              className="w-42 mx-4 text-right"
              type="month"
              onChange={setDay}
              value={format(startDate, 'yyyy-MM')}
              //defaultValue={format(startDate, 'yyyy-MM')}
            />
            <div className="mx-auto"></div>
            <button
              className="mx-4 my-2 rounded bg-primary px-4 text-xs font-bold text-white"
              onClick={handleExport}
            >
              CSV出力
            </button>
          </div>

          <div className="w-full px-4 py-2">
            <table className="w-full border-separate border-spacing-0 border border-setting-border text-center">
              <thead>
                <tr className="border-1 border-setting-border bg-setting-table">
                  <th className="border border-setting-border">スタッフ</th>
                  <th className="border border-setting-border">ポジション</th>
                  {dates.map((date, _i) => (
                    <th
                      key={`date_header_${_i}`}
                      className={`border border-setting-border ${weekendStyle(date)}`}
                    >
                      <div
                        dangerouslySetInnerHTML={{ __html: convertTime(date) }}
                      />
                    </th>
                  ))}
                  <th className="border border-setting-border">一括編集</th>
                </tr>
              </thead>
              <tbody className="border border-setting-border">
                {staffData.map((staff, _i) => (
                  <tr key={`staff_${_i}`}>
                    <td className="border border-setting-border">
                      {staff.name}
                    </td>
                    <td className="border border-setting-border">
                      <EditableStaffRole
                        value={staff?.office as PositionRole}
                        setValue={(val: string) => {
                          updateStaffRole(_i, staff.id, val)
                        }}
                      />
                    </td>
                    {staff.shift.map((sh, _j) => (
                      <td key={`staff_day_${_i}_${_j}`}>
                        <select
                          value={sh}
                          style={{
                            background: timeSheet.findLast((t) => t.id == sh)
                              ?.colorCode,
                          }}
                          className="my-1 border-2 border-background-gray text-center text-sm"
                          onChange={(e) =>
                            updateStaffData(_i, _j, e.target.value)
                          }
                        >
                          {timeSheet.map((i, _type_index) => (
                            <option
                              value={i.id}
                              key={`select_shift_type_${i.id}`}
                            >
                              {i.category}
                            </option>
                          ))}
                        </select>
                      </td>
                    ))}
                    <td>
                      <select
                        className="my-1 border-2 border-background-gray text-center text-sm"
                        onChange={(e) => updateAllStaffData(_i, e.target.value)}
                      >
                        <option value={-1}>-</option>

                        {timeSheet.map((i, _type_index) => (
                          <option
                            value={i.id}
                            key={`select_all_shift_type_${i.id}`}
                          >
                            {i.category}
                          </option>
                        ))}
                      </select>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            <div className="my-4 w-full">
              <button
                className="py rounded bg-primary px-4 py-1 font-bold text-white"
                onClick={saveWorkSchedule}
              >
                保存
              </button>
            </div>
          </div>
        </div>
      </div>
      <CommonModal isOpen={modalIsOpen} onClose={closeModal}>
        <div className="text-blue-500">{errorMessage}</div>
      </CommonModal>
    </div>
  )
}

export default ShiftDetail
