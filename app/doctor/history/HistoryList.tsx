'use client'
import AppointmentTimeComponent from '@/components/AppointmentTime'
import EditDoctorComponent from '@/components/EditDoctorComponent'
import GenderComponent from '@/components/GenderComponent'
import PatientNameComponent from '@/components/PatientNameComponent'

import type { DataItem } from '@/components/Table'
import Table from '@/components/Table'
import { firstReceptionList } from '@/server/reception'
// import { useRouter, useSearchParams } from 'next/navigation'
import { MenuBarComponent } from '@/app/doctor/Menu/MenuBar'
import type { Patient } from '@/gen/proto/v1/patient_pb'
import type {
  Doctor,
  Examination,
  Memo,
  Reception,
} from '@/gen/proto/v1/reception_pb'
import React, { useCallback, useEffect, useMemo, useState } from 'react'

import PaymentSuccess from '@/components/PaymentSuccess'
import type { SessionProps, SessionUser } from '@/utils/type'
import { addDays } from 'date-fns'

const HistoryList: React.FC<SessionProps> = ({ session }) => {
  const role = 'admin'
  const user = session?.user as SessionUser

  const [receptions, setReceptions] = useState<Reception[]>([])

  const [startDate, setStartDate] = useState(new Date())

  const [isShowHistory, setIsShowHistory] = useState(false)
  const [historyId, setHistoryId] = useState('')

  useEffect(() => {
    // Function to fetch data
    const fetchData = async () => {
      try {
        const res = await firstReceptionList({
          fromDate: startDate.toISOString().split('T')[0],
          toDate: addDays(new Date(startDate), 1).toISOString().split('T')[0],
          assignTo: undefined,
          sortAppointmentTime: undefined,
          sortReservationTime: undefined,
          status: [],
          page: 1,
          size: 30,
        })
        setReceptions(
          res.receptions.sort((a, b) =>
            a.appointmentTime.localeCompare(b.appointmentTime),
          ),
        )
      } catch (error) {
        console.error('Error fetching data:', error)
      }

      // const testData = generateReceptionDummyData()

      // const newData = testData.map((i) => Reception.fromJson(i))
      // console.log('change receptions')
    }

    // Call fetchData when component mounts
    fetchData()
  }, [startDate])

  const editAssignInfo = useCallback((id: number) => {
    console.log(id)
  }, [])

  const showHistory = useCallback((id: string) => {
    //setIsShowHistory(true)
    setHistoryId(id)
  }, [])

  const columns = useMemo(
    () => [
      {
        title: '診察時間',
        index: 'appointmentTime',
        render: (name: string) => (
          <AppointmentTimeComponent
            startDate={new Date(name.split(' ')[0])}
            name={name.split(' ')[1]}
          />
        ),
        className:
          'max-w-[200px] 3xl:max-w-[240px] 4xl:max-w-[280px] text-sm text-gray-600 border-t border-b lg:pl-16',
      },
      {
        title: '氏名',
        index: 'patient',
        render: (value: Patient) => <PatientNameComponent data={value} />,
        className:
          'text-center max-w-[150px] 3xl:max-w-[190px] 4xl:max-w-[220px] text-sm text-gray-600 border-t border-b',
      },
      {
        title: '性別',
        index: 'patient',
        render: (value: Patient) => <GenderComponent sex={value.gender} />,
        className:
          'max-w-[150px] 3xl:max-w-[190px] 4xl:max-w-[220px] text-sm text-gray-600 border-t border-b',
      },
      {
        title: 'カルテ番号',
        index: 'patient',
        render: (value: Patient) => (
          <div className="w-full text-center">{value?.clinicalNumber}</div>
        ),
        className:
          'max-w-[150px] 3xl:max-w-[190px] 4xl:max-w-[220px] text-sm text-gray-600 border-t border-b',
      },
      {
        title: '診察メニュー',
        index: 'examination',
        render: (value: Examination) => (
          <div className="w-full text-center">{value?.name}</div>
        ),
        className:
          'max-w-[150px] 3xl:max-w-[190px] 4xl:max-w-[220px] text-sm text-gray-600 border-t border-b',
      },
      {
        title: '担当医師',
        index: 'doctor',
        render: (value: Doctor, record: DataItem) => (
          <EditDoctorComponent
            value={value}
            record={record as Reception}
            editAssignInfo={editAssignInfo}
          />
        ),
        className:
          'max-w-[150px] 3xl:max-w-[190px] 4xl:max-w-[220px] text-sm text-gray-600 border-t border-b',
      },
      {
        title: 'メモ',
        index: 'memo',
        render: (value: Memo) => (
          <div className="flex w-full text-center">
            {value && (
              <div className="mx-auto flex">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth="1.5"
                  stroke="currentColor"
                  className="mr-2 size-6"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M7.5 8.25h9m-9 3H12m-9.75 1.51c0 1.6 1.123 2.994 2.707 3.227 1.129.166 2.27.293 3.423.379.35.026.67.21.865.501L12 21l2.755-4.133a1.14 1.14 0 0 1 .865-.501 48.172 48.172 0 0 0 3.423-.379c1.584-.233 2.707-1.626 2.707-3.228V6.741c0-1.602-1.123-2.995-2.707-3.228A48.394 48.394 0 0 0 12 3c-2.392 0-4.744.175-7.043.513C3.373 3.746 2.25 5.14 2.25 6.741v6.018Z"
                  />
                </svg>

                <div>{value?.content}</div>
              </div>
            )}
          </div>
        ),
        className:
          'max-w-[150px] 3xl:max-w-[190px] 4xl:max-w-[220px] text-sm text-gray-600 border-t border-b',
      },
    ],
    [editAssignInfo],
  )

  return (
    <>
      <MenuBarComponent
        role={role}
        startDate={startDate}
        setStartDate={setStartDate}
        showStatus={false}
        // TODO: Fix these props
        selectedOptions={[]}
        setSelectedOptions={() => {}}
        setSelectedDoctor={() => {}}
        clinnicId={user.clinic_id}
      />
      <div className="justify-center">
        <Table columns={columns} data={receptions} onRowClick={showHistory} />
        <PaymentSuccess
          isDisplay={isShowHistory}
          setIsDisplay={setIsShowHistory}
          contentId={historyId}
          title="診察履歴"
        />
      </div>
    </>
  )
}

export default HistoryList
