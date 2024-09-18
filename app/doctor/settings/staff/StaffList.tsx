'use client'
import Pagination from '@/components/Pagination'
import type { DataItem } from '@/components/Table'
import Table from '@/components/Table'
import type { Staff } from '@/gen/proto/v1/staff_pb'
import { getStaffList, storeStaff } from '@/server/doctor'
import type { LoginTypeRole, PositionRole } from '@/utils/reception'
import {
  AdminTypeRole,
  PositionRoleList,
  getLoginTypeName,
  getPositionName,
} from '@/utils/reception'
import type { SessionUser, StaffInput } from '@/utils/type'
import { zodResolver } from '@hookform/resolvers/zod'
import type { Session } from 'next-auth'
import React, { useCallback, useEffect, useMemo, useState } from 'react'
import type { SubmitHandler } from 'react-hook-form'
import { useForm } from 'react-hook-form'
import { z } from 'zod'

const basicFormSchema = z.object({
  id: z.union([z.number(), z.null(), z.string(), z.string().length(0)]),
  email: z.union([z.string(), z.string().length(0)]),
  firstName: z.string(),
  lastName: z.union([z.string(), z.string().length(0)]),
  firstNameFurigana: z.string(),
  lastNameFurigana: z.union([z.string(), z.string().length(0)]),
  type: z.string(),
  position: z.string(),
  medicalLicenseNumber: z.string(),
  medicalRegistrationNumber: z.string(),
  clinicId: z.union([z.number(), z.string()]),
})

interface Props {
  session: Session | null
}

const StaffList: React.FC<Props> = ({ session }) => {
  const user = session?.user as SessionUser

  const { handleSubmit, register, reset } = useForm<StaffInput>({
    resolver: zodResolver(basicFormSchema),
  })

  const [doctors, setDoctors] = useState<Staff[]>([])
  const pageSize = 30
  const [showModal, setShowModal] = useState(false)
  const [totalPages, setTotalPages] = useState<number>(1)
  const [currentPage, setCurrentPage] = useState<number>(1)
  const handleChangePage = useCallback((page: number) => {
    setCurrentPage(page)
  }, [])

  const [currentStaff, setCurrentStaff] = useState<Staff>()

  // モーダルを開く関数
  const openModal = () => {
    setShowModal(true)
  }

  const fetchData = useCallback(async () => {
    try {
      const res = await getStaffList({
        clinnicId: user.clinic_id,
        keyword: undefined,
        page: currentPage,
        size: pageSize,
      })
      setDoctors(res.staffs)
      setTotalPages(Math.ceil(res.total / pageSize))
    } catch (error) {
      console.error('Error fetching data:', error)
    }
  }, [currentPage, pageSize, setDoctors, setTotalPages, user])

  useEffect(() => {
    // Call fetchData when component mounts
    fetchData()
  }, [fetchData])

  const columns = useMemo(
    () => [
      {
        title: '氏名',
        index: 'id',
        render: (_: string, record: DataItem) => (
          <p className="w-full text-center">
            {record.firstName}
            {record.lastName}
          </p>
        ),
        className:
          'text-center max-w-[150px] 3xl:max-w-[190px] 4xl:max-w-[220px] text-sm text-gray-600 border-t border-b',
      },
      {
        title: 'フリガナ',
        index: 'id',
        render: (_: string, record: DataItem) => (
          <p className="w-full text-center">
            {record.firstNameFurigana}
            {record.lastNameFurigana}
          </p>
        ),
        className:
          'max-w-[150px] 3xl:max-w-[190px] 4xl:max-w-[220px] text-sm text-gray-600 border-t border-b',
      },
      {
        title: 'スタッフ区分',
        index: 'position',
        render: (value: PositionRole) => (
          <p className="w-full text-center">{getPositionName(value)}</p>
        ),
        className:
          'max-w-[150px] 3xl:max-w-[190px] 4xl:max-w-[220px] text-sm text-gray-600 border-t border-b',
      },
      {
        title: '医籍登録番号',
        index: 'medicalRegistrationNumber',
        render: (value: string) => (
          <p className="w-full text-center">{value}</p>
        ),
        className:
          'max-w-[150px] 3xl:max-w-[190px] 4xl:max-w-[220px] text-sm text-gray-600 border-t border-b',
      },
      {
        title: '医師免許番号',
        index: 'medicalLicenseNumber',
        render: (value: string) => (
          <p className="w-full text-center">{value}</p>
        ),
        className:
          'max-w-[150px] 3xl:max-w-[190px] 4xl:max-w-[220px] text-sm text-gray-600 border-t border-b',
      },
      {
        title: '権限',
        index: 'type',
        render: (value: LoginTypeRole) => (
          <p className="w-full text-center">{getLoginTypeName(value)}</p>
        ),
        className:
          'max-w-[150px] 3xl:max-w-[190px] 4xl:max-w-[220px] text-sm text-gray-600 border-t border-b',
      },
      {
        title: '店舗',
        index: 'clinicName',
        render: (value: string) => (
          <p className="w-full text-center">{value}</p>
        ),
        className:
          'max-w-[150px] 3xl:max-w-[190px] 4xl:max-w-[220px] text-sm text-gray-600 border-t border-b',
      },
      {
        title: '',
        index: 'doctorLicense',
        render: (_: string, record: DataItem) => (
          <div className="flex w-full py-2 text-center">
            <button
              onClick={() => {
                setCurrentStaff(record as Staff)
                openModal()
              }}
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth="1.5"
                stroke="currentColor"
                className="size-4 text-blue-500"
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
        className:
          'max-w-[150px] 3xl:max-w-[190px] 4xl:max-w-[220px] text-sm text-gray-600 border-t border-b',
      },
    ],
    [],
  )

  const onSubmit: SubmitHandler<StaffInput> = async (data: StaffInput) => {
    try {
      data.clinicId = BigInt(user.clinic_id)
      await storeStaff(data)
      await fetchData()
      setShowModal(false)
      reset()
    } catch (err) {}
  }

  return (
    <div className="w-full">
      <div className="my-4 block w-full text-gray-500">
        <div className="flex w-full bg-main-50 p-4 font-bold">
          <h1>スタッフ管理</h1>
          <div className="mx-auto" />
          <div className="w-42 flex items-center">
            <button
              onClick={() => {
                setCurrentStaff(undefined)
                openModal()
              }}
              className="font-base flex w-full items-center rounded border-2 border-main-200 bg-gray-100 px-4"
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
              スタッフを追加
            </button>
          </div>
        </div>

        {/* モーダル */}
        {showModal && (
          <div className="fixed inset-0 z-50 overflow-y-auto">
            <div className="flex min-h-screen items-center justify-center bg-gray-500/50">
              <div className="z-50 min-w-[500px] rounded-lg bg-white p-8 text-black">
                {/* 編集フォーム */}
                <form onSubmit={handleSubmit(onSubmit)}>
                  <div className="block">
                    <div className="flex w-full px-16">
                      <h1 className="mx-auto pb-2 text-xl font-bold">
                        {currentStaff ? 'スタッフ編集' : 'スタッフ追加'}
                      </h1>
                      <input
                        type="hidden"
                        {...register('id')}
                        value={currentStaff?.id ? Number(currentStaff?.id) : ''}
                      />
                      <input
                        type="hidden"
                        {...register('clinicId')}
                        value={user.clinic_id}
                      />
                    </div>
                    <div className="mt-2 block w-full  px-16">
                      <label className="w-full py-2">メール</label>
                      <div className="flex w-full">
                        <input
                          {...register('email')}
                          defaultValue={currentStaff?.email}
                          className="w-1/2 rounded border p-2"
                        />
                      </div>
                    </div>
                    <div className="mt-2 block w-full  px-16">
                      <label className="w-full py-2">氏名</label>
                      <div className="flex w-full">
                        <input
                          {...register('firstName')}
                          defaultValue={currentStaff?.firstName}
                          className="w-1/2 rounded border p-2"
                        />
                        <input
                          {...register('lastName')}
                          defaultValue={currentStaff?.lastName}
                          className="mx-2 w-1/2 rounded border p-2"
                        />
                      </div>
                    </div>
                    <div className="mt-2 block w-full  px-16">
                      <label className="w-full py-2">ふりがな</label>
                      <div className="flex w-full">
                        <input
                          {...register('firstNameFurigana')}
                          defaultValue={currentStaff?.firstNameFurigana}
                          className="w-1/2 rounded border p-2"
                        />
                        <input
                          {...register('lastNameFurigana')}
                          defaultValue={currentStaff?.lastNameFurigana}
                          className="mx-2 w-1/2 rounded border p-2"
                        />
                      </div>
                    </div>
                    <div className="mt-2 block w-full  px-16">
                      <label className="w-full py-2">スタッフ区分</label>
                      <select
                        className="w-full rounded border py-2"
                        {...register('position')}
                        defaultValue={currentStaff?.position}
                      >
                        <option value="">-</option>
                        {PositionRoleList.map((p, _i) => (
                          <option value={p} key={_i}>
                            {getPositionName(p)}
                          </option>
                        ))}
                      </select>
                    </div>
                    <div className="mt-2 block w-full  px-16">
                      <label className="w-full py-2">医籍登録番号</label>
                      <input
                        {...register('medicalRegistrationNumber')}
                        defaultValue={currentStaff?.medicalRegistrationNumber}
                        className="w-full rounded border p-2"
                      />
                    </div>
                    <div className="mt-2 block w-full  px-16">
                      <label className="w-full py-2">医師免許番号</label>
                      <input
                        className="w-full rounded border p-2"
                        {...register('medicalLicenseNumber')}
                        defaultValue={currentStaff?.medicalLicenseNumber}
                      />
                    </div>

                    <div className="mt-2 block w-full  px-16">
                      <label className="w-full py-2">権限</label>
                      <select
                        className="w-full rounded border py-2"
                        {...register('type')}
                        defaultValue={currentStaff?.type}
                      >
                        <option value="">-</option>
                        {AdminTypeRole.map(
                          (p) =>
                            (p != 'admin' || user.role == 'admin') && (
                              <option value={p} key={p}>
                                {getLoginTypeName(p)}
                              </option>
                            ),
                        )}
                      </select>
                    </div>

                    <div className="mt-4 flex w-full px-16">
                      <button
                        className="mr-8 w-32  rounded-xl border-2 border-main-400 bg-white p-2"
                        type="button"
                        onClick={() => {
                          reset()
                          setShowModal(false)
                          setCurrentStaff(undefined)
                        }}
                      >
                        戻る
                      </button>
                      <button className="ml-8 w-32  rounded-xl border-2 border-main-400 bg-main-400 p-2 text-white">
                        登録
                      </button>
                    </div>
                  </div>
                </form>
              </div>
            </div>
          </div>
        )}

        <div className="w-full justify-center">
          <Table columns={columns} data={doctors} onRowClick={() => {}} />
        </div>
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

export default StaffList
