'use client'

import type { DataItem } from '@/components/Table'
import Table from '@/components/Table'
import { useCallback, useEffect, useMemo, useState } from 'react'

import { TreatmentItem } from '@/gen/proto/v1/treatment_list_pb'
import { receptionList } from '@/server/reception'
import { generateTreatmentDummyData } from '@/utils/dummy'
import { addDays, format } from 'date-fns'
import TreatmentDialogComponent from './TreatmentDialog'

interface TreatmentHisotyComponentProps {
  setDay: (event: { target: { value: string | number | Date } }) => void
  startDate: Date
  patientId: string
  onClickFunction: () => void
}

const TreatmentHistoryComponent: React.FC<TreatmentHisotyComponentProps> = ({
  patientId,
  startDate,
  setDay,
  onClickFunction,
}) => {
  const [treatments, setTreatments] = useState<TreatmentItem[]>([])
  const [showDialog, setShowDialog] = useState(false)

  const [treatmentId, setTreatmentId] = useState('')

  useEffect(() => {
    // Function to fetch data
    const fetchData = async () => {
      try {
        const _response = await receptionList({
          fromDate: startDate.toISOString().split('T')[0],
          toDate: addDays(new Date(startDate), 1).toISOString().split('T')[0],
          assignTo: undefined,
          sortAppointmentTime: undefined,
          sortReservationTime: undefined,
          status: [],
          page: undefined,
          size: undefined,
        })
      } catch (error) {
        console.error('Error fetching data:', error)
      }

      const testData = generateTreatmentDummyData()
      const newData = testData.map((i) => TreatmentItem.fromJson(i))
      setTreatments(newData)
    }

    // Call fetchData when component mounts
    fetchData()
  }, [startDate, patientId])

  const handleAddTreatment = useCallback(() => {
    setTreatmentId('')
    setShowDialog(true)
  }, [])

  const handleEditTreatment = useCallback(() => {
    setShowDialog(true)
  }, [])

  const treatmentColumns = useMemo(
    () => [
      {
        title: '施術名',
        index: 'treatment',
        render: (value: DataItem) => (
          <div className="ml-12 w-full items-center text-left">
            <div>
              <input
                type="checkbox"
                value={value.id}
                // Handle checkbox change
                onChange={() => setTreatmentId(String(value.id))}
                className="mx-4 bg-gray-500"
              />
              {value.name}
            </div>
          </div>
        ),
        className: `text-left text-sm text-gray-600 border-t border-b min-w-[120px] max-w-[120px]`,
      },
      {
        title: '施術期限',
        index: 'startDate',
        render: (value: string, record: DataItem) => (
          <p className="w-full text-center">
            {record.startDate} ~ {record.postDate}
          </p>
        ),
        className:
          'text-sm text-gray-600 border-t border-b min-w-[120px] max-w-[120px]',
      },
      // {
      //   title: '転記日',
      //   index: 'postDate',
      //   render: (value: string) => (
      //     <p className="w-full text-center">{value || '-'}</p>
      //   ),
      //   className:
      //     'text-sm text-gray-600 border-t border-b min-w-[120px] max-w-[120px]',
      // },
      // {
      //   title: '転記',
      //   index: 'memo',
      //   render: (value: string) => (
      //     <div className="w-full text-center">{value || '-'}</div>
      //   ),
      //   className:
      //     'text-sm text-gray-600 border-t border-b min-w-[120px] max-w-[120px]',
      // },
      {
        title: '',
        index: 'treatment',
        render: (value: DataItem) => (
          <div className="w-full text-center">
            <button
              onClick={() => {
                setTreatmentId(String(value.id))
                handleEditTreatment()
              }}
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth="1.5"
                stroke="currentColor"
                className="size-4"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="m16.862 4.487 1.687-1.688a1.875 1.875 0 1 1 2.652 2.652L6.832 19.82a4.5 4.5 0 0 1-1.897 1.13l-2.685.8.8-2.685a4.5 4.5 0 0 1 1.13-1.897L16.863 4.487Zm0 0L19.5 7.125"
                />
              </svg>
            </button>
          </div>
        ),
        className: 'text-sm text-gray-600 border-t border-b',
      },
    ],
    [handleEditTreatment],
  )

  return (
    <>
      <div className="flex py-4 text-black">
        <p className="mx-2 text-xl font-bold">施術歴</p>
        <input
          className="w-32 min-w-[200px] border-2 px-2"
          type="date"
          onChange={setDay}
          value={format(startDate, 'yyyy-MM-dd')}
          defaultValue={format(startDate, 'yyyy-MM-dd')}
        />

        {/* <div className="mx-2">
          <button
            className="font-base flex items-center rounded border-2 border-main-200 bg-gray-100 px-4"
            onClick={onClickFunction}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth="1.5"
              stroke="currentColor"
              className="mx size-6"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M12 3c2.755 0 5.455.232 8.083.678.533.09.917.556.917 1.096v1.044a2.25 2.25 0 0 1-.659 1.591l-5.432 5.432a2.25 2.25 0 0 0-.659 1.591v2.927a2.25 2.25 0 0 1-1.244 2.013L9.75 21v-6.568a2.25 2.25 0 0 0-.659-1.591L3.659 7.409A2.25 2.25 0 0 1 3 5.818V4.774c0-.54.384-1.006.917-1.096A48.32 48.32 0 0 1 12 3Z"
              />
            </svg>
            転記
          </button>
        </div> */}

        <div className="mx-auto"></div>
        {/* <div className="flex w-32 items-center">
          <button
            className="font-base flex items-center rounded border-2 border-main-200 bg-gray-100 px-4"
            onClick={handleEditTreatment}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth="1.5"
              stroke="currentColor"
              className="size-4"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="m16.862 4.487 1.687-1.688a1.875 1.875 0 1 1 2.652 2.652L6.832 19.82a4.5 4.5 0 0 1-1.897 1.13l-2.685.8.8-2.685a4.5 4.5 0 0 1 1.13-1.897L16.863 4.487Zm0 0L19.5 7.125"
              />
            </svg>
            編集
          </button>
        </div> */}
        <div className="flex w-32 items-center">
          <button
            className="font-base flex items-center rounded border-2 border-main-200 bg-gray-100 px-4"
            onClick={handleAddTreatment}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth="1.5"
              stroke="currentColor"
              className="mx-auto size-4 text-red-500"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M12 4.5v15m7.5-7.5h-15"
              />
            </svg>
            追加
          </button>
        </div>
      </div>

      <div className="justify-center text-black">
        <div>
          <Table
            columns={treatmentColumns}
            data={treatments}
            headerClass="bg-primary-admin"
            onRowClick={onClickFunction}
          />
        </div>
      </div>

      <TreatmentDialogComponent
        id={treatmentId}
        setShowDialog={setShowDialog}
        onClickFunction={onClickFunction}
        isNew={!treatmentId}
        showDialog={showDialog}
      />
    </>
  )
}

export default TreatmentHistoryComponent
