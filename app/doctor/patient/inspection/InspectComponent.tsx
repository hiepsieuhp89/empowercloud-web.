'use client'
// import { useRouter, useSearchParams } from 'next/navigation'
import { InspectionRecord } from '@/gen/proto/v1/inspection_pb'
import { inspectionList } from '@/server/inspection'
import { generateInspectionHistoryDummyData } from '@/utils/dummy'
import { useEffect, useState } from 'react'

import InspectListDialogComponent from './InspectListDialog'

const PatientInspectComponent: React.FC = () => {
  const [isShowDialog, setIsShowDialog] = useState(false)

  const [inspections, setInspectiion] = useState<InspectionRecord[]>([])

  useEffect(() => {
    // Function to fetch data
    const fetchData = async () => {
      try {
        const _response = await inspectionList({
          page: 1,
        })
        const _newData = _response.inspections
      } catch (error) {
        console.error('Error fetching data:', error)
      }

      const testData = generateInspectionHistoryDummyData()
      const newData = testData.map((i) => InspectionRecord.fromJson(i))
      setInspectiion(newData)
    }

    // Call fetchData when component mounts
    fetchData()
  }, [setInspectiion])

  return (
    <div className="justify-center text-black">
      <div className="text-md flex w-full">
        <button className="m-2 flex rounded-xl border p-2">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            fill="currentColor"
            className="size-6"
          >
            <path d="M18.375 2.25c-1.035 0-1.875.84-1.875 1.875v15.75c0 1.035.84 1.875 1.875 1.875h.75c1.035 0 1.875-.84 1.875-1.875V4.125c0-1.036-.84-1.875-1.875-1.875h-.75ZM9.75 8.625c0-1.036.84-1.875 1.875-1.875h.75c1.036 0 1.875.84 1.875 1.875v11.25c0 1.035-.84 1.875-1.875 1.875h-.75a1.875 1.875 0 0 1-1.875-1.875V8.625ZM3 13.125c0-1.036.84-1.875 1.875-1.875h.75c1.036 0 1.875.84 1.875 1.875v6.75c0 1.035-.84 1.875-1.875 1.875h-.75A1.875 1.875 0 0 1 3 19.875v-6.75Z" />
          </svg>
          グラフ表示
        </button>
        <button
          className="m-2 flex rounded-xl border p-2"
          onClick={() => setIsShowDialog(true)}
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            fill="currentColor"
            className="size-6"
          >
            <path
              fillRule="evenodd"
              d="M15.75 2.25H21a.75.75 0 0 1 .75.75v5.25a.75.75 0 0 1-1.5 0V4.81L8.03 17.03a.75.75 0 0 1-1.06-1.06L19.19 3.75h-3.44a.75.75 0 0 1 0-1.5Zm-10.5 4.5a1.5 1.5 0 0 0-1.5 1.5v10.5a1.5 1.5 0 0 0 1.5 1.5h10.5a1.5 1.5 0 0 0 1.5-1.5V10.5a.75.75 0 0 1 1.5 0v8.25a3 3 0 0 1-3 3H5.25a3 3 0 0 1-3-3V8.25a3 3 0 0 1 3-3h8.25a.75.75 0 0 1 0 1.5H5.25Z"
              clipRule="evenodd"
            />
          </svg>
          印刷
        </button>
      </div>
      <div className="overflow-scroll">
        <table className="w-full border-separate border-spacing-0">
          <thead>
            <tr className="border bg-main-50">
              <th className="min-w-[200px] max-w-[200px] border text-center">
                項目名
              </th>
              <th className="min-w-[170px] max-w-[170px] border text-center">
                基準値
              </th>
              <th className="min-w-[170px] max-w-[170px] border text-center">
                単位
              </th>
              {inspections.length > 0 &&
                inspections[0].days.map((day, _id) => (
                  <th
                    key={_id}
                    className="min-w-[170px] max-w-[170px] border text-center"
                  >
                    <div className="mx-auto flex justify-center">
                      <p className="mx-2 flex items-center justify-center">
                        {day.day}
                      </p>
                      <div className="flex flex-col">
                        <button className="w-4 cursor-pointer text-primary">
                          <svg
                            width="4"
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
                              d="m4.5 15.75 7.5-7.5 7.5 7.5"
                            />
                          </svg>
                        </button>
                        <button className="w-4 cursor-pointer text-primary">
                          <svg
                            width="4"
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
                              d="m19.5 8.25-7.5 7.5-7.5-7.5"
                            />
                          </svg>
                        </button>
                      </div>
                    </div>
                  </th>
                ))}
            </tr>
          </thead>
          <tbody>
            {inspections.length > 0 &&
              inspections.map((item, index) => (
                <tr
                  key={index}
                  className={`border ${index % 2 !== 0 ? 'bg-main-50' : 'bg-white'}`}
                >
                  <td className="border text-center">
                    <div className="flex w-full items-center text-center">
                      <input
                        type="checkbox"
                        disabled={true}
                        className="mx-4 bg-gray-500"
                      />
                      {item.name}
                    </div>
                  </td>
                  <td className="border text-center">
                    {item.min}~{item.max}
                  </td>
                  <td className="border text-center">{item.unit}</td>
                  {item.days.map((row, _i) => (
                    <td key={_i} className="border text-center">
                      <div className="mx-auto flex justify-center">
                        {row.value > item.max && (
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            viewBox="0 0 24 24"
                            fill="currentColor"
                            className="size-6 font-bold text-red-500"
                          >
                            <path
                              fillRule="evenodd"
                              d="M11.47 2.47a.75.75 0 0 1 1.06 0l3.75 3.75a.75.75 0 0 1-1.06 1.06l-2.47-2.47V21a.75.75 0 0 1-1.5 0V4.81L8.78 7.28a.75.75 0 0 1-1.06-1.06l3.75-3.75Z"
                              clipRule="evenodd"
                            />
                          </svg>
                        )}
                        {row.value < item.min && (
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            viewBox="0 0 24 24"
                            fill="currentColor"
                            className="size-6 font-bold text-green-500"
                          >
                            <path
                              fillRule="evenodd"
                              d="M12 2.25a.75.75 0 0 1 .75.75v16.19l2.47-2.47a.75.75 0 1 1 1.06 1.06l-3.75 3.75a.75.75 0 0 1-1.06 0l-3.75-3.75a.75.75 0 1 1 1.06-1.06l2.47 2.47V3a.75.75 0 0 1 .75-.75Z"
                              clipRule="evenodd"
                            />
                          </svg>
                        )}
                        {row.value}
                      </div>
                    </td>
                  ))}
                </tr>
              ))}
          </tbody>
        </table>
      </div>
      <InspectListDialogComponent
        setShowDialog={setIsShowDialog}
        data={inspections}
        onClickFunction={() => {}}
        showDialog={isShowDialog}
      />
    </div>
  )
}

export default PatientInspectComponent
