'use client'

import type { DataItem } from '@/components/Table'
import Table from '@/components/Table'
import { useCallback, useEffect, useMemo, useState } from 'react'

import { AllergyRecord } from '@/gen/proto/v1/treatment_list_pb'
import { allergyList } from '@/server/allergy'
import { generateAllergyDummyData } from '@/utils/dummy'
import AllergyDialogComponent from './AllergyDialog'

interface AllergyHistoryComponentProps {
  setDay: (event: { target: { value: string | number | Date } }) => void
  startDate: Date
  patientId: string
  onClickFunction: () => void
}

const AllergyHistoryComponent: React.FC<AllergyHistoryComponentProps> = ({
  patientId,
  startDate,
  onClickFunction,
}) => {
  const [allergies, setAllergies] = useState<AllergyRecord[]>([])
  const [showDialog, setShowDialog] = useState(false)

  const [allergyId, seAllergyId] = useState('')

  useEffect(() => {
    // Function to fetch data
    const fetchData = async () => {
      try {
        const _response = await allergyList({
          page: 1,
        })
        const _newData = _response.allergies
      } catch (error) {
        console.error('Error fetching data:', error)
      }

      const testData = generateAllergyDummyData()
      const newData = testData.map((i) => AllergyRecord.fromJson(i))
      setAllergies(newData)
    }

    // Call fetchData when component mounts
    fetchData()
  }, [startDate, patientId])

  const handleAddTreatment = useCallback(() => {
    seAllergyId('')
    setShowDialog(true)
  }, [])

  const handleEditTreatment = useCallback(() => {
    setShowDialog(true)
  }, [])

  const treatmentColumns = useMemo(
    () => [
      {
        title: 'アレルゲン',
        index: 'name',
        render: (_: string, value: DataItem) => (
          <p className="ml-8 w-full text-left">{value.name}</p>
        ),
        className: `text-center text-sm text-gray-600 border-t border-b max-w-[150px] min-w-[150px]`,
      },
      {
        title: '発症期間',
        index: 'date',
        render: (value: string) => <p className="w-full text-left">{value}</p>,
        className:
          'text-sm text-gray-600 border-t border-b max-w-[150px] min-w-[150px]',
      },
      {
        title: '症状',
        index: 'symptom',
        render: (value: string) => (
          <p className="w-full text-left">{value || '-'}</p>
        ),
        className:
          'text-sm text-gray-600 border-t border-b max-w-[150px] min-w-[150px]',
      },
      {
        title: '',
        index: 'date',
        render: (_: string, value: DataItem) => (
          <div className="w-full text-center">
            <button
              onClick={() => {
                seAllergyId(String(value.id))
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
        <p className="mx-2 text-xl font-bold">アレルギー</p>

        <div className="mx-auto"></div>
        <div className="flex w-32 items-center">
          <button
            className="font-base flex items-center rounded border-2 border-main-200 bg-white px-4"
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

      <div>
        <Table
          columns={treatmentColumns}
          data={allergies}
          headerClass="bg-primary-admin"
          onRowClick={onClickFunction}
        />
      </div>

      <AllergyDialogComponent
        id={allergyId}
        setShowDialog={setShowDialog}
        onClickFunction={onClickFunction}
        isNew={!allergyId}
        showDialog={showDialog}
      />
    </>
  )
}

export default AllergyHistoryComponent
