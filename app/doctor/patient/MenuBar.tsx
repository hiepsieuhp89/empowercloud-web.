'use client'
import CommonModal from '@/components/CommonModal'
import EditableInput from '@/components/EditableInput'
import type { Patient } from '@/gen/proto/v1/patient_pb'
import { detailPatient, storePatient } from '@/server/patient'
import { receptionDetail } from '@/server/reception'
import { calculateAge } from '@/utils/chunks'
import debounce from 'lodash/debounce'
import { usePathname, useSearchParams } from 'next/navigation'
import { useCallback, useEffect, useMemo, useRef, useState } from 'react'

type UserProfileKey =
  | 'firstName'
  | 'lastName'
  | 'firstNameFurigana'
  | 'lastNameFurigana'
  | 'birthYear'
  | 'gender'
  | 'memberId'
  | 'cancelCount'
  | 'lateCount'
  | 'email'

const DoctorPatientMenuBarComponent: React.FC = () => {
  const pathname = usePathname()
  const params = useSearchParams()

  const receiptParam = useMemo(() => {
    return params.get('id') ?? ''
  }, [params])
  const patientId = useMemo(() => {
    return params.get('pid') ?? ''
  }, [params])

  const [patient, setPatient] = useState<Patient>()
  const [errorMessage, setErrorMessage] = useState('')
  const [modalIsOpen, setModalIsOpen] = useState(false)
  const [detailModalIsOpen, setDetailModalIsOpen] = useState(false)

  const handlerValueRef =
    useRef<(key: string, value: string | number) => void>()

  const fetchData = useCallback(async () => {
    try {
      if (receiptParam) {
        const response = await receptionDetail(Number(receiptParam))
        setPatient(response?.patient)
      } else if (patientId) {
        const response = await detailPatient(Number(patientId))
        setPatient(response)
      }
    } catch (error) {
      console.error('Error fetching data:', error)
      setErrorMessage('患者情報が見つかりません')
      setModalIsOpen(true)
    }
  }, [patientId, receiptParam])

  useEffect(() => {
    // Function to fetch data

    fetchData()
  }, [fetchData])

  const closeModal = useCallback(() => {
    setModalIsOpen(false)
    setErrorMessage('')
  }, [setModalIsOpen, setErrorMessage])

  const { years, months } = calculateAge(patient?.birthYear || '')

  const updatePatientHandler = useCallback(
    async (key: string, value: string | number) => {
      if (patient?.id) {
        const data: { [key: string]: string | number } = {
          id: patient?.id || 0,
        }
        if (key == 'gender' || key == 'cancelCount' || key == 'lateCount') {
          data[key] = Number(value)
        } else {
          data[key] = value
          data['gender'] = patient?.gender
        }
        await storePatient(data)
        await fetchData()
      }
    },
    [patient, fetchData],
  )

  useEffect(() => {
    // Set up debounced function with useRef
    handlerValueRef.current = debounce(
      (key: string, value: string | number) => {
        updatePatientHandler(key, value)
      },
      200,
    )
  }, [updatePatientHandler])

  const handleChange = useCallback(
    async (key: UserProfileKey, value: string | number) => {
      if (handlerValueRef.current) {
        handlerValueRef.current(key, value)
      }
    },
    [handlerValueRef],
  )

  return (
    <div className="block w-full border border-gray-300 pt-2 text-black">
      <div className="flex w-full items-start">
        <div className="block w-3/4">
          <div className="mx-4 flex">
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
                d="M2.25 8.25h19.5M2.25 9h19.5m-16.5 5.25h6m-6 2.25h3m-3.75 3h15a2.25 2.25 0 0 0 2.25-2.25V6.75A2.25 2.25 0 0 0 19.5 4.5h-15a2.25 2.25 0 0 0-2.25 2.25v10.5A2.25 2.25 0 0 0 4.5 19.5Z"
              />
            </svg>
            <div>{patient?.memberId || patient?.id}</div>
          </div>

          <div className="mx-4 block min-w-96 bg-white">
            <div className="flex items-end">
              <div
                className={`text-2xl font-bold ${!patient?.lastName || !patient?.firstName ? 'text-red-500' : ''}`}
              >
                {patient?.firstName}
                {patient?.lastName}
              </div>
              <div
                className={`text-md mx-4 ${!patient?.lastNameFurigana || !patient?.firstNameFurigana ? 'text-red-500' : ''}`}
              >
                {patient?.firstNameFurigana}
                {patient?.lastNameFurigana}
              </div>
            </div>

            <div className="flex w-full">
              <div
                className={`border-r-2 border-gray-500 px-1 leading-none ${String(patient?.birthYear) <= '1900-01-01' ? 'text-red-500' : ''}`}
              >
                {patient?.birthYear.substring(0, 4)}年
                {patient?.birthYear.substring(5, 7)}月
                {patient?.birthYear.substring(8, 10)}日
              </div>
              <div className="border-r-2 border-gray-500 px-1 leading-none">
                {years}歳{months}ヶ月
              </div>
              <div
                className={`border-r-2 border-gray-500 px-1 leading-none ${Number(patient?.gender) < 1 ? 'text-red-500' : ''}`}
              >
                {patient?.gender == 1
                  ? '男性'
                  : patient?.gender == 2
                    ? '女性'
                    : 'その他'}
              </div>
              <div className="mx-2 rounded border px-1 leading-none">総合</div>
            </div>
          </div>
        </div>
        <div className="flex w-1/4">
          <div className="mx-auto"></div>
          <button
            className="mx-4 flex w-32 items-center rounded-xl border px-4 py-2 text-center"
            onClick={() => setDetailModalIsOpen(true)}
          >
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
                d="M15.75 6a3.75 3.75 0 1 1-7.5 0 3.75 3.75 0 0 1 7.5 0ZM4.501 20.118a7.5 7.5 0 0 1 14.998 0A17.933 17.933 0 0 1 12 21.75c-2.676 0-5.216-.584-7.499-1.632Z"
              />
            </svg>
            <div className="mx-auto flex">患者情報</div>
          </button>
        </div>
      </div>

      <div className="mt-2 flex w-full items-start bg-main-50 pr-96">
        <ul className="border-white-100 flex w-full justify-between space-x-0 rounded-lg border-0 pr-52 font-medium">
          <li
            className={`max-w-[250px] ${pathname.includes('/doctor/patient/reception') ? 'mr-2 border-t-4 border-main-500 bg-white lg:px-4' : 'lg:px-4'}`}
          >
            <a
              href={`/doctor/patient/reception?pid=${patient?.id}&id=${receiptParam}`}
              className="w-full rounded border-0 p-0 py-2 text-black hover:bg-gray-100 hover:text-blue-700 sm:flex md:block"
            >
              <p>診察</p>
            </a>
          </li>

          {/* <li
            className={`max-w-[250px] ${pathname.includes('/doctor/patient/treatment') ? 'border-t-4 border-main-500 bg-white lg:px-4' : 'lg:px-4'}`}
          >
            <a
              href={`/doctor/patient/treatment?pid=${patient?.id}`}
              className="w-full rounded border-0 p-0 py-2 text-black hover:bg-gray-100 hover:text-blue-700 sm:flex md:block"
            >
              <p>施術記録</p>
            </a>
          </li>

          <li
            className={`max-w-[250px] ${pathname.includes('/doctor/patient/effect') ? 'border-t-4 border-main-500 bg-white lg:px-4' : 'lg:px-4'}`}
          >
            <a
              href={`/doctor/patient/effect?pid=${patient?.id}`}
              className="rounded border-0 p-0 py-2 text-black hover:bg-gray-100 hover:text-blue-700 sm:flex md:block"
            >
              <p>副作用</p>
            </a>
          </li> */}

          {/* <li
            className={`max-w-[250px] ${pathname.includes('/doctor/patient/medicine') ? 'border-t-4 border-main-500 bg-white lg:px-4' : 'lg:px-4'}`}
          >
            <a
              href={`/doctor/patient/medicine?pid=${patient?.id}`}
              className="rounded border-0 p-0 py-2 text-black hover:bg-gray-100 hover:text-blue-700 sm:flex md:block"
            >
              <p>投薬</p>
            </a>
          </li> */}

          {/* <li
            className={`max-w-[250px] ${pathname.includes('/doctor/patient/inspection') ? 'border-t-4 border-main-500 bg-white lg:px-4' : 'lg:px-4'}`}
          >
            <a
              href={`/doctor/patient/inspection?pid=${patient?.id}`}
              className="rounded border-0 p-0 py-2 text-black hover:bg-gray-100 hover:text-blue-700 sm:flex md:block"
            >
              <p>検査</p>
            </a>
          </li> */}

          {/* <li
            className={`max-w-[250px] ${pathname.includes('/doctor/patient/interview') ? 'border-t-4 border-main-500 bg-white lg:px-4' : 'lg:px-4'}`}
          >
            <a
              href={`/doctor/patient/interview?pid=${patient?.id}`}
              className="rounded border-0 p-0 py-2 text-black hover:bg-gray-100 hover:text-blue-700 sm:flex md:block"
            >
              <p>問診</p>
            </a>
          </li> */}

          {/* <li
            className={`max-w-[250px] ${pathname.includes('/doctor/patient/memo') ? 'border-t-4 border-main-500 bg-white lg:px-4' : 'lg:px-4'}`}
          >
            <a
              href={`/doctor/patient/memo?pid=${patient?.id}`}
              className="rounded border-0 p-0 py-2 text-black hover:bg-gray-100 hover:text-blue-700 sm:flex md:block"
            >
              <p>メモ</p>
            </a>
          </li> */}

          <li
            className={`max-w-[250px] ${pathname.includes('/doctor/patient/document') ? 'border-t-4 border-main-500 bg-white lg:px-4' : 'lg:px-4'}`}
          >
            <a
              href={`/doctor/patient/document?pid=${patient?.id}&id=${receiptParam}`}
              className="rounded border-0 p-0 py-2 text-black hover:bg-gray-100 hover:text-blue-700 sm:flex md:block"
            >
              <p>書類</p>
            </a>
          </li>
        </ul>
      </div>
      <CommonModal isOpen={modalIsOpen} onClose={closeModal}>
        <div>{errorMessage}</div>
      </CommonModal>

      <CommonModal
        isOpen={detailModalIsOpen}
        onClose={() => setDetailModalIsOpen(false)}
      >
        <div className="w-full min-w-[800px]">
          <h1 className="pb-4 text-lg font-bold">患者情報</h1>
          <div className="flex w-full">
            <div className="w-1/2">
              <div className="mt-8 flex w-full border-b px-4 py-2">
                <label className="w-32 font-bold">氏名</label>
                <p className="flex w-full text-right">
                  <div className="mx-auto"></div>
                  <EditableInput
                    defaultVal={true}
                    value={patient?.firstName || ''}
                    setValue={(e) => handleChange('firstName', e)}
                  />
                  <EditableInput
                    defaultVal={true}
                    value={patient?.lastName || ''}
                    setValue={(e) => handleChange('lastName', e)}
                  />
                </p>
              </div>
              <div className="flex w-full border-b px-4 py-2">
                <label className="w-32 font-bold">氏名ふりがな</label>
                <p className="flex w-full text-right">
                  <div className="mx-auto"></div>
                  <EditableInput
                    defaultVal={true}
                    value={patient?.firstNameFurigana || ''}
                    setValue={(e) => handleChange('firstNameFurigana', e)}
                  />
                  <EditableInput
                    defaultVal={true}
                    value={patient?.lastNameFurigana || ''}
                    setValue={(e) => handleChange('lastNameFurigana', e)}
                  />
                </p>
              </div>
              <div className="flex w-full border-b px-4 py-2">
                <label className="w-32 font-bold">生年月日</label>
                <p className="flex w-full text-right">
                  <div className="mx-auto"></div>
                  <EditableInput
                    defaultVal={true}
                    inputType="date"
                    value={patient?.birthYear || ''}
                    setValue={(e) => handleChange('birthYear', e)}
                  />
                </p>
              </div>
              <div className="flex w-full border-b px-4 py-2">
                <label className="w-32 font-bold">性別</label>
                <p className="flex w-full text-right">
                  <div className="mx-auto"></div>
                  <select
                    className="w-32 rounded p-2 text-right"
                    value={patient?.gender || ''}
                    onChange={(e) => handleChange('gender', e.target.value)}
                  >
                    <option value={0}>その他</option>
                    <option value={1}>男性</option>
                    <option value={2}>女性</option>
                  </select>
                </p>
              </div>

              <div className="flex w-full border-b px-4 py-2">
                <label className="w-32 font-bold">メール</label>
                <p className="flex w-full text-right">
                  <div className="mx-auto"></div>
                  <EditableInput
                    defaultVal={true}
                    inputType="text"
                    value={patient?.email || ''}
                    setValue={(e) => handleChange('email', e)}
                  />
                </p>
              </div>

              <div className="flex w-full border-b px-4 py-2">
                <label className="w-32 font-bold">会員番号</label>
                <p className="flex w-full text-right">
                  <div className="mx-auto"></div>
                  <EditableInput
                    defaultVal={true}
                    inputType="text"
                    value={patient?.memberId || ''}
                    setValue={(e) => handleChange('memberId', e)}
                  />
                </p>
              </div>

              <div className="flex w-full border-b px-4 py-2">
                <label className="font-bold">初診日</label>
                <div className="mx-auto"></div>
                <p className="text-right">{patient?.firstArrivedTime}</p>
              </div>
            </div>
            <div className="w-1/2 pl-4">
              <div className="w-full">患者メモ</div>
              <div className="w-full">
                <textarea
                  rows={4}
                  cols={15}
                  className="w-full rounded-xl border bg-gray-200 p-2"
                ></textarea>
              </div>
              <div className="flex w-full border-b pb-2 pt-4">
                <div className="w-3/4">遅刻回数</div>
                <div className="w-1/4">
                  <div className="mx-auto border px-2">
                    <EditableInput
                      defaultVal={true}
                      value={patient?.lateCount || '0'}
                      setValue={(e) => handleChange('lateCount', e)}
                    />
                  </div>
                </div>
              </div>
              <div className="flex w-full border-b py-2">
                <div className="w-3/4">無断キャンセル回数</div>
                <div className="w-1/4">
                  <div className="mx-auto border px-2">
                    <EditableInput
                      defaultVal={true}
                      value={patient?.cancelCount || '0'}
                      setValue={(e) => handleChange('cancelCount', e)}
                    />
                  </div>
                </div>
              </div>
              <div className="flex w-full border-b py-2">
                <p className="text-xs text-red-500">
                  {' '}
                  ※遅刻回数が2回、無断キャンセル回数が2回の状態になると、この患者は自動的にLINE予約できなくなります（My
                  EMC経由の予約のみ）
                </p>
              </div>
            </div>
          </div>
        </div>
      </CommonModal>
    </div>
  )
}
export { DoctorPatientMenuBarComponent }
