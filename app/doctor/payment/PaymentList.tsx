'use client'
import Table from '@/components/Table'
import type { PaymentHistory } from '@/gen/proto/v1/payment_pb'
import React, { useCallback, useEffect, useMemo, useState } from 'react'

import Pagination from '@/components/Pagination'
import PaymentSuccess from '@/components/PaymentSuccess'
import { listPayments } from '@/server/payment'

const PaymentList: React.FC = () => {
  //const [patients, setPatients] = useState<Payment[]>([])
  const [histories, setHistories] = useState<PaymentHistory[]>([])

  const [searchKey, setSearchKey] = useState('')

  const [paymentType, setPaymentType] = useState('')

  const [isShowPayment, setIsShowPayment] = useState(false)
  const [paymentId, setPaymentId] = useState('')
  const [page, setPage] = useState(1)
  const [totalPages, setTotalPages] = useState(0)
  const size = 20

  useEffect(() => {
    // Function to fetch data
    const fetchData = async () => {
      try {
        const response = await listPayments({
          page,
          size,
          paymentSource: '',
          paymentType,
          search: searchKey,
        })
        setHistories(response.payments)
        setTotalPages(Math.ceil(response.total / size))
      } catch (error) {
        console.error('Error fetching data:', error)
      }
    }

    // Call fetchData when component mounts
    fetchData()
  }, [searchKey, paymentType, page])

  const convertStatusToString = useCallback((status: string) => {
    switch (status) {
      case 'pending':
        return '未決済'
      case 'failed':
        return '失敗'
      case 'paid':
        return '決済済み'
      default:
        return '未決済'
    }
  }, [])

  const formatter = useMemo(() => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'JPY',
    })
  }, [])

  const columns = useMemo(
    () => [
      {
        title: '決済日時',
        index: 'paymentDatetime',
        render: (val: string) => (
          <div className="w-full text-center">
            <div>
              <p>{val}</p>
            </div>
          </div>
        ),
        className:
          'text-center max-w-[150px] 3xl:max-w-[190px] 4xl:max-w-[220px] text-sm text-gray-600 border-t border-b',
      },
      {
        title: 'カルテ番号',
        index: 'patientNo',
        render: (value: string) => (
          <div className="w-full text-center">{value}</div>
        ),
        className:
          'max-w-[150px] 3xl:max-w-[190px] 4xl:max-w-[220px] text-sm text-gray-600 border-t border-b',
      },
      {
        title: '氏名',
        index: 'patientName',
        render: (val: string) => (
          <div className="w-full text-center">{val}</div>
        ),
        className:
          'text-center max-w-[150px] 3xl:max-w-[190px] 4xl:max-w-[220px] text-sm text-gray-600 border-t border-b',
      },
      {
        title: '合計金額',
        index: 'totalAmount',
        render: (value: number) => (
          <p className="w-full text-center">{formatter.format(value * 1.08)}</p>
        ),
        className:
          'max-w-[150px] 3xl:max-w-[190px] 4xl:max-w-[220px] text-sm text-gray-600 border-t border-b',
      },
      {
        title: 'ステータス',
        index: 'status',
        render: (value: string) => (
          <div className="w-full text-center">
            {convertStatusToString(value)}
          </div>
        ),
        className:
          'max-w-[150px] 3xl:max-w-[190px] 4xl:max-w-[220px] text-sm text-gray-600 border-t border-b',
      },
    ],
    [convertStatusToString, formatter],
  )

  const handleInputChange = useCallback(
    (event: { target: { value: React.SetStateAction<string> } }) => {
      setSearchKey(event.target.value)
    },
    [],
  )

  const showPayment = useCallback((id: string) => {
    setIsShowPayment(true)
    setPaymentId(id)
  }, [])

  return (
    <>
      <div className="flex bg-primary-admin px-8 py-4 text-black lg:px-16">
        <div className="flex justify-center">
          <h1 className="text-center text-2xl font-bold leading-normal text-gray-600">
            決済履歴
          </h1>
        </div>
        <div className="mx-auto"></div>
        <button className="font-base ml-4 rounded border-2 border-gray-300 bg-white px-4 py-2 font-bold">
          エクスポート
        </button>
      </div>
      <div className="flex bg-primary-admin px-8 py-4 text-black lg:px-16">
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
            className="w-full"
            placeholder="検索(ex. 氏名、 カルテ番号、 クリニック名 etc...)"
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

      <div className="bg-primary-admin px-4 lg:px-16">
        <div className="flex">
          <button
            className={`px-4 py-2 font-bold text-black ${paymentType === '' ? 'bg-white' : 'bg-gray-300'}`}
            onClick={() => setPaymentType('')}
          >
            すべて
          </button>
          <button
            className={`px-4 py-2 font-bold text-black ${paymentType === 'admin' ? 'bg-white' : 'bg-gray-300'}`}
            onClick={() => setPaymentType('admin')}
          >
            クリニック
          </button>
          <button
            className={`px-4 py-2 font-bold text-black ${paymentType === 'patient' ? 'bg-white' : 'bg-gray-300'}`}
            onClick={() => setPaymentType('patient')}
          >
            オンライン注文
          </button>
        </div>
        <div className="justify-center bg-white">
          <Table columns={columns} data={histories} onRowClick={showPayment} />
          <PaymentSuccess
            isDisplay={isShowPayment}
            setIsDisplay={setIsShowPayment}
            contentId={paymentId}
            title="決済履歴"
          />
        </div>
        <div className="mt-4 flex justify-center">
          <Pagination
            currentPage={page}
            onPageChange={setPage}
            totalPages={totalPages}
          />
        </div>
      </div>
    </>
  )
}

export default PaymentList
