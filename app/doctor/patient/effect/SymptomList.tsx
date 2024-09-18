'use client'

import Table from '@/components/Table'
import { EffectSymptomRecord } from '@/gen/proto/v1/effect_symptom_pb'
import { effectSymptomList } from '@/server/symptom'
import { generateSymptomHistoryDummyData } from '@/utils/dummy'
import { useEffect, useMemo, useState } from 'react'

interface SymptomListComponentProps {
  startDate: Date
  patientId: string
  onClickFunction: () => void
}

const SymptomListComponent: React.FC<SymptomListComponentProps> = ({
  onClickFunction,
}) => {
  const [symptoms, setSymptoms] = useState<EffectSymptomRecord[]>([])

  useEffect(() => {
    // Function to fetch data
    const fetchData = async () => {
      try {
        const _response = await effectSymptomList({
          page: 1,
        })
        const _newData = _response.symptoms
      } catch (error) {
        console.error('Error fetching data:', error)
      }

      const testData = generateSymptomHistoryDummyData()
      const newData = testData.map((i) => EffectSymptomRecord.fromJson(i))
      setSymptoms(newData)
    }

    // Call fetchData when component mounts
    fetchData()
  }, [setSymptoms])

  const symptomColumns = useMemo(
    () => [
      {
        title: '薬剤名',
        index: 'name',
        render: (value: string) => (
          <p className="ml-8 w-full text-left">{value}</p>
        ),
        className: `text-center max-w-[150px] min-w-[150px] text-sm text-gray-600 border-t border-b`,
      },
      {
        title: '発症期間',
        index: 'date',
        render: (value: string) => (
          <p className="w-full text-left">{value || '-'}</p>
        ),
        className:
          'max-w-[150px] min-w-[150px] text-sm text-gray-600 border-t border-b',
      },
      {
        title: '症状',
        index: 'symptom',
        render: (value: string) => (
          <p className="w-full text-left">{value || '-'}</p>
        ),
        className:
          'max-w-[150px] min-w-[150px] text-sm text-gray-600 border-t border-b',
      },
      {
        title: '',
        index: 'treatment',
        render: (_: EffectSymptomRecord) => (
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
        <p className="mx-2 text-xl font-bold">副作用</p>
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
          columns={symptomColumns}
          data={symptoms}
          headerClass="bg-primary-admin"
          onRowClick={() => {}}
        />
      </div>
    </>
  )
}

export default SymptomListComponent
