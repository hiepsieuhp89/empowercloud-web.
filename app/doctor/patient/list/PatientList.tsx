'use client'
import type { DataItem } from '@/components/Table'
import Table from '@/components/Table'
import React, { useCallback, useEffect, useMemo, useState } from 'react'

import { useRouter } from 'next/navigation'

import GenderComponent from '@/components/GenderComponent'
import Pagination from '@/components/Pagination'
import PatientNameComponent from '@/components/PatientNameComponent'
import { AddPatientDialog } from '@/components/dialog/AddPatientDialog'
import type { Patient } from '@/gen/proto/v1/patient_pb'
import { listPatients } from '@/server/patient'
import { Parser } from 'json2csv'

const PatientList: React.FC = ({}) => {
  const router = useRouter()

  const [patients, setPatients] = useState<Patient[]>([])

  const [showModal, setShowModal] = useState(false)

  const [currentPage, setCurrentPage] = useState<number>(1)
  const [totalPages, setTotalPages] = useState<number>(1)
  const pageSize = 20

  const [searchKey, setSearchKey] = useState('')

  const handleChangePage = useCallback(
    (page: number) => {
      setCurrentPage(page)
    },
    [setCurrentPage],
  )

  useEffect(() => {
    // Function to fetch data
    const fetchData = async () => {
      try {
        const res = await listPatients(currentPage, pageSize, searchKey)
        setPatients(res.patients)
        setTotalPages(Math.ceil(res.totalPage / pageSize))
      } catch (error) {
        console.error('Error fetching data:', error)
      }
    }

    fetchData()
  }, [searchKey, currentPage, pageSize])

  const showPatientDetail = useCallback(
    (value: number) => {
      router.push(`/doctor/patient/reception?pid=${value}`)
    },
    [router],
  )

  const handleExport = useCallback(async () => {
    let page = 1
    const size = 20000
    const res = await listPatients(page, size, searchKey)
    const pageCount = Math.ceil(res.totalPage / size)
    while (page <= pageCount) {
      const res = await listPatients(page, size, searchKey)
      const data = res.patients.map((i) => {
        return {
          ID: i.id,
          氏名: `${i.firstName}${i.lastName}`,
          氏名フリガナ: `${i.firstNameFurigana}${i.lastNameFurigana}`,
          生年月日: i.birthYear,
          会員番号: i.memberId,
          お客番号: i.customerId,
          メール: i.email,
          電話番号: i.phone,
          性別: i.gender > 1 ? '女性' : i.gender > 0 ? '男性' : 'その他',
        }
      })
      console.log(data[0])
      const fields = [
        'ID',
        '氏名',
        '氏名フリガナ',
        '生年月日',
        '会員番号',
        'お客番号',
        'メール',
        '電話番号',
        '性別',
      ]
      const json2csvParser = new Parser({ fields })
      const csv = json2csvParser.parse(data)

      const blob = new Blob([csv], { type: 'text/csv' })
      const url = URL.createObjectURL(blob)

      const a = document.createElement('a')
      a.href = url
      a.download = `data-page-${page}.csv`
      a.click()
      page += 1
    }
    return false
  }, [searchKey])

  const columns = useMemo(
    () => [
      {
        title: '氏名',
        index: 'firstName',
        render: (_v: string, value: DataItem) => (
          <PatientNameComponent data={value as Patient} showBirth={false} />
        ),
        className:
          'text-center max-w-[150px] 3xl:max-w-[190px] 4xl:max-w-[220px] text-sm text-gray-600 border-t border-b',
      },
      {
        title: '性別',
        index: 'gender',
        render: (value: number) => <GenderComponent sex={value} />,
        className:
          'max-w-[150px] 3xl:max-w-[190px] 4xl:max-w-[220px] text-sm text-gray-600 border-t border-b',
      },
      {
        title: '生年月日',
        index: 'birthYear',
        render: (value: string) => (
          <p
            className={`w-full text-center ${value <= '1900-01-01' ? 'text-red-500' : ''}`}
          >
            {value}
          </p>
        ),
        className:
          'max-w-[150px] 3xl:max-w-[190px] 4xl:max-w-[220px] text-sm text-gray-600 border-t border-b',
      },
      {
        title: 'カルテ番号',
        index: 'memberId',
        render: (value: string) => (
          <div className="w-full text-center">{value}</div>
        ),
        className:
          'max-w-[150px] 3xl:max-w-[190px] 4xl:max-w-[220px] text-sm text-gray-600 border-t border-b',
      },
      {
        title: '電話番号',
        index: 'phone',
        render: (value: string) => (
          <div className="w-full text-center">{value}</div>
        ),
        className:
          'max-w-[150px] 3xl:max-w-[190px] 4xl:max-w-[220px] text-sm text-gray-600 border-t border-b',
      },
      {
        title: '来店回数',
        index: 'arrivedTime',
        render: (value: string) => (
          <div className="w-full text-center">{value}</div>
        ),
        className:
          'max-w-[150px] 3xl:max-w-[190px] 4xl:max-w-[220px] text-sm text-gray-600 border-t border-b',
      },
      {
        title: '初回来店日',
        index: 'firstArrivedTime',
        render: (value: string) => (
          <div className="w-full text-center">{value}</div>
        ),
        className:
          'max-w-[150px] 3xl:max-w-[190px] 4xl:max-w-[220px] text-sm text-gray-600 border-t border-b',
      },
      {
        title: '最新来店日',
        index: 'lastArrivedTime',
        render: (value: string) => (
          <div className="w-full text-center">{value}</div>
        ),
        className:
          'max-w-[150px] 3xl:max-w-[190px] 4xl:max-w-[220px] text-sm text-gray-600 border-t border-b',
      },
      // {
      //   title: 'クリニック名',
      //   index: 'clinicName',
      //   render: (value: string) => (
      //     <div className="w-full text-center">{value}</div>
      //   ),
      //   className:
      //     'max-w-[150px] 3xl:max-w-[190px] 4xl:max-w-[220px] text-sm text-gray-600 border-t border-b',
      // },
      // {
      //   title: '担当医師',
      //   index: 'doctor',
      //   render: (value: string) => (
      //     <div className="w-full text-center">{value}</div>
      //   ),
      //   className:
      //     'max-w-[150px] 3xl:max-w-[190px] 4xl:max-w-[220px] text-sm text-gray-600 border-t border-b',
      // },
    ],
    [],
  )

  const addPatient = useCallback(() => {
    setShowModal(true)
  }, [])

  const handleInputChange = useCallback(
    (event: { target: { value: React.SetStateAction<string> } }) => {
      setSearchKey(event.target.value)
    },
    [setSearchKey],
  )

  return (
    <div className="w-full">
      <div className="flex bg-primary-admin px-8 py-4 text-black">
        <div className="flex justify-center">
          <h1 className="text-center text-2xl font-bold leading-normal text-gray-600">
            患者一覧
          </h1>
        </div>
        <div className="mx-auto"></div>
        <button
          className="font-base mx-4 rounded border-2 border-gray-300 bg-white px-4 py-2 font-bold"
          onClick={handleExport}
        >
          エクスポート
        </button>
        {/* <button className="font-base mx-4 rounded border-2 border-gray-300 bg-white px-4 py-2 font-bold">
          インポート
        </button> */}
        <button
          className="font-base mx-4 rounded border-2 border-gray-300 bg-green-300 px-4 font-bold"
          onClick={addPatient}
        >
          お客様を追加
        </button>
      </div>
      <div className="flex bg-primary-admin px-8 py-4 text-black">
        <div className="flex w-full items-center rounded bg-white px-4 py-2">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth="1.5"
            stroke="currentColor"
            className="size-6"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="m21 21-5.197-5.197m0 0A7.5 7.5 0 1 0 5.196 5.196a7.5 7.5 0 0 0 10.607 10.607Z"
            />
          </svg>
          <input
            className="w-full px-4"
            placeholder="検索"
            defaultValue={searchKey}
            onChange={handleInputChange}
          ></input>
          <div className="min-w-[140px]">絞り込みをする</div>
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth="1.5"
            stroke="currentColor"
            className="size-6"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M12 3c2.755 0 5.455.232 8.083.678.533.09.917.556.917 1.096v1.044a2.25 2.25 0 0 1-.659 1.591l-5.432 5.432a2.25 2.25 0 0 0-.659 1.591v2.927a2.25 2.25 0 0 1-1.244 2.013L9.75 21v-6.568a2.25 2.25 0 0 0-.659-1.591L3.659 7.409A2.25 2.25 0 0 1 3 5.818V4.774c0-.54.384-1.006.917-1.096A48.32 48.32 0 0 1 12 3Z"
            />
          </svg>
        </div>
      </div>
      <div className="justify-center">
        <AddPatientDialog setOpenDialog={setShowModal} openDialog={showModal} />
        <Table
          columns={columns}
          data={patients}
          onRowClick={showPatientDetail}
        />
        {totalPages > 1 && (
          <div className="my-4 flex justify-center">
            <Pagination
              currentPage={currentPage}
              totalPages={totalPages}
              onPageChange={handleChangePage}
            />
          </div>
        )}
      </div>
    </div>
  )
}

export default PatientList
