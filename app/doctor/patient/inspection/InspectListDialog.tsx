'use client'

import type { InspectionRecord } from '@/gen/proto/v1/inspection_pb'
import { PatientRecord } from '@/gen/proto/v1/reception_pb'
import { patientDumy } from '@/utils/dummy'
import { useCallback, useEffect, useRef } from 'react'

interface InspectListDialogComponentProps {
  setShowDialog: React.Dispatch<React.SetStateAction<boolean>>
  onClickFunction: () => void
  data: InspectionRecord[]
  showDialog: boolean
}

const InspectListDialogComponent: React.FC<InspectListDialogComponentProps> = ({
  data,
  setShowDialog,
  showDialog,
}) => {
  const patient = PatientRecord.fromJson(patientDumy())

  const dialogRef = useRef<HTMLDivElement>(null)

  const handleClickOutside = useCallback(
    (event: MouseEvent) => {
      if (
        dialogRef.current &&
        !dialogRef.current.contains(event.target as Node)
      ) {
        setShowDialog(false)
      }
    },
    [setShowDialog],
  )

  useEffect(() => {
    if (showDialog) {
      document.addEventListener('mousedown', handleClickOutside)
    } else {
      document.removeEventListener('mousedown', handleClickOutside)
    }
    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [showDialog, handleClickOutside])

  if (!showDialog) {
    return null
  }

  return (
    <div className="fixed inset-0 z-30 flex items-center justify-center bg-black/50 text-black">
      <div
        className="relative rounded-2xl bg-white py-8 shadow-lg"
        ref={dialogRef}
      >
        <div className="absolute right-0 top-0 mr-[-4px] mt-[-4px] size-4 rounded-2xl bg-gray-700 text-center text-xs font-bold text-white">
          <button onClick={() => setShowDialog(false)}>X</button>
        </div>
        <div className="flex w-full px-16 py-4">
          <h1 className="mx-4 flex items-center justify-center text-xl font-bold">
            検査結果
          </h1>
          <div className="mx-4 flex items-center justify-center">
            <div>{patient.id}</div>
          </div>
          <div className="flex items-start">
            <div className="block">
              <div className="mx-4 block min-w-96 bg-white">
                <div className="flex items-end">
                  <div className="text-2xl font-bold">
                    {patient.firstName}
                    {patient.lastName}
                  </div>
                  <div className="text-md mx-4">
                    {patient.firstNameFurigana}
                    {patient.lastNameFurigana}
                  </div>
                </div>

                <div className="flex w-full">
                  <div className="border-r-2 border-gray-500 px-1 leading-none">
                    1997年06月12日
                  </div>
                  <div className="border-r-2 border-gray-500 px-1 leading-none">
                    25歳10ヶ月
                  </div>
                  <div
                    className={`border-r-2 border-gray-500 px-1 leading-none ${Number(patient.gender) < 1 ? 'text-red-500' : ''}`}
                  >
                    {patient.gender == 1
                      ? '男性'
                      : patient.gender == 2
                        ? '女性'
                        : 'その他'}
                  </div>
                  <div className="mx-2 rounded border px-1 leading-none">
                    総合
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div className="mx-auto"></div>
          <div className="flex">
            <button className="m-2 flex items-center rounded border bg-main-100 p-2">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                fill="currentColor"
                className="size-6"
              >
                <path
                  fillRule="evenodd"
                  d="M7.875 1.5C6.839 1.5 6 2.34 6 3.375v2.99c-.426.053-.851.11-1.274.174-1.454.218-2.476 1.483-2.476 2.917v6.294a3 3 0 0 0 3 3h.27l-.155 1.705A1.875 1.875 0 0 0 7.232 22.5h9.536a1.875 1.875 0 0 0 1.867-2.045l-.155-1.705h.27a3 3 0 0 0 3-3V9.456c0-1.434-1.022-2.7-2.476-2.917A48.716 48.716 0 0 0 18 6.366V3.375c0-1.036-.84-1.875-1.875-1.875h-8.25ZM16.5 6.205v-2.83A.375.375 0 0 0 16.125 3h-8.25a.375.375 0 0 0-.375.375v2.83a49.353 49.353 0 0 1 9 0Zm-.217 8.265c.178.018.317.16.333.337l.526 5.784a.375.375 0 0 1-.374.409H7.232a.375.375 0 0 1-.374-.409l.526-5.784a.373.373 0 0 1 .333-.337 41.741 41.741 0 0 1 8.566 0Zm.967-3.97a.75.75 0 0 1 .75-.75h.008a.75.75 0 0 1 .75.75v.008a.75.75 0 0 1-.75.75H18a.75.75 0 0 1-.75-.75V10.5ZM15 9.75a.75.75 0 0 0-.75.75v.008c0 .414.336.75.75.75h.008a.75.75 0 0 0 .75-.75V10.5a.75.75 0 0 0-.75-.75H15Z"
                  clipRule="evenodd"
                />
              </svg>
              印刷する
            </button>

            <button
              className="m-2 flex rounded border bg-white p-2"
              onClick={() => setShowDialog(false)}
            >
              キャンセル
            </button>
          </div>
        </div>
        <div className="overflow-scroll px-4">
          <table className="w-full border-separate border-spacing-0">
            <thead>
              <tr>
                <th colSpan={3} className="text-sm text-gray-500">
                  印刷したい検査日時を選択(最大4日まで)
                </th>
                {data.length > 0 &&
                  data[0].days.map((_day, _id) => (
                    <th
                      key={_id}
                      className="min-w-[170px] max-w-[170px] border text-center"
                    >
                      <input type="checkbox" className="mx-4 bg-gray-500" />
                    </th>
                  ))}
              </tr>
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
                {data.length > 0 &&
                  data[0].days.map((day, _id) => (
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
              {data.length > 0 &&
                data.map((item, index) => (
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
      </div>
    </div>
  )
}

export default InspectListDialogComponent
