'use client'

import Table from '@/components/Table'
import { useEffect, useMemo, useState } from 'react'

import { MedicalHistory } from '@/gen/proto/v1/treatment_list_pb'
import { receptionList } from '@/server/reception'
import { generateMedicialHistoryDummyData } from '@/utils/dummy'
import { addDays } from 'date-fns'

interface MedicalHistoryComponentProps {
  startDate: Date
  patientId: string
  onClickFunction: () => void
}

const MedicalHistoryComponent: React.FC<MedicalHistoryComponentProps> = ({
  patientId,
  startDate,
  onClickFunction,
}) => {
  const [medicialHistories, setMedicailHistories] = useState<MedicalHistory[]>(
    [],
  )

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

      const medicalData = generateMedicialHistoryDummyData()
      const convertedMedicalHistories = medicalData.map((i) =>
        MedicalHistory.fromJson(i),
      )
      setMedicailHistories(convertedMedicalHistories)
    }

    // Call fetchData when component mounts
    fetchData()
  }, [patientId, startDate])

  const medicialHistoryColumns = useMemo(
    () => [
      {
        title: '病名',
        index: 'name',
        render: (value: string) => (
          <p className="ml-16 w-full text-left">{value}</p>
        ),
        className: `text-left text-sm text-gray-600 border-t border-b min-w-[120px] max-w-[120px]`,
      },
      {
        title: '発症期間',
        index: 'date',
        render: (value: string) => (
          <p className="w-full text-center">{value || '-'}</p>
        ),
        className:
          'text-sm text-gray-600 border-t border-b min-w-[120px] max-w-[120px]',
      },
      {
        title: '手術',
        index: 'surgery',
        render: (value: string) => (
          <p className="w-full text-center">{value || '-'}</p>
        ),
        className:
          'text-sm text-gray-600 border-t border-b min-w-[120px] max-w-[120px]',
      },
      {
        title: '治療中',
        index: 'status',
        render: (value: number) => (
          <div className="w-full text-center">{value || '-'}</div>
        ),
        className:
          'text-sm text-gray-600 border-t border-b min-w-[120px] max-w-[120px]',
      },
      {
        title: '',
        index: 'treatment',
        render: (_: MedicalHistory) => (
          <div className="w-full text-center">
            <button>
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
    [],
  )

  return (
    <>
      <div className="flex py-4 text-black">
        <p className="mx-2 text-xl font-bold">既往歴</p>
        <div className="mx-auto"></div>
        <div className="flex w-32 items-center">
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

      <div>
        <Table
          columns={medicialHistoryColumns}
          data={medicialHistories}
          headerClass="bg-primary-admin"
          onRowClick={() => {}}
        />
      </div>
    </>
  )
}

export default MedicalHistoryComponent
