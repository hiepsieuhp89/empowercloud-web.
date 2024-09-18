'use client'
import Table from '@/components/Table'
import React, { useMemo, useState } from 'react'

const TemplatesList: React.FC = () => {
  // モーダルの表示制御用のステート
  const [showModal, setShowModal] = useState(false)

  // モーダルを開く関数
  const openModal = () => {
    setShowModal(true)
  }

  const columns = useMemo(
    () => [
      {
        title: '会員番号',
        index: 'membership_number',
        render: (value: string) => (
          <p className="w-full text-center">{value}</p>
        ),
        className:
          'text-center max-w-[150px] 3xl:max-w-[190px] 4xl:max-w-[220px] text-sm text-gray-600 border-t border-b',
      },
      {
        title: '患者名',
        index: 'username',
        render: (value: string) => (
          <p className="w-full text-center">{value}</p>
        ),
        className:
          'text-center max-w-[150px] 3xl:max-w-[190px] 4xl:max-w-[220px] text-sm text-gray-600 border-t border-b',
      },
      {
        title: '電話番号',
        index: 'tel',
        render: (value: string) => (
          <p className="w-full text-center">{value}</p>
        ),
        className:
          'max-w-[150px] 3xl:max-w-[190px] 4xl:max-w-[220px] text-sm text-gray-600 border-t border-b',
      },
      {
        title: '生年月日',
        index: 'birthday',
        render: (value: string) => (
          <p className="w-full text-center">{value}</p>
        ),
        className:
          'max-w-[150px] 3xl:max-w-[190px] 4xl:max-w-[220px] text-sm text-gray-600 border-t border-b',
      },
      {
        title: '前回来店日',
        index: 'last_visit_date',
        render: (value: string) => (
          <p className="w-full text-center">{value}</p>
        ),
        className:
          'max-w-[150px] 3xl:max-w-[190px] 4xl:max-w-[220px] text-sm text-gray-600 border-t border-b',
      },
      {
        title: '来店数',
        index: 'visit_count',
        render: (value: string) => (
          <p className="w-full text-center">{value}回</p>
        ),
        className:
          'max-w-[150px] 3xl:max-w-[190px] 4xl:max-w-[220px] text-sm text-gray-600 border-t border-b',
      },
      {
        title: '備考１',
        index: 'note1',
        render: (value: string) => (
          <p className="w-full text-center">{value}</p>
        ),
        className:
          'max-w-[150px] 3xl:max-w-[190px] 4xl:max-w-[220px] text-sm text-gray-600 border-t border-b',
      },
      {
        title: '備考２',
        index: 'note2',
        render: (value: string) => (
          <p className="w-full text-center">{value}</p>
        ),
        className:
          'max-w-[150px] 3xl:max-w-[190px] 4xl:max-w-[220px] text-sm text-gray-600 border-t border-b',
      },
      {
        title: 'ナース備考',
        index: 'nurse_note',
        render: (value: string) => (
          <p className="w-full text-center">{value}</p>
        ),
        className:
          'max-w-[150px] 3xl:max-w-[190px] 4xl:max-w-[220px] text-sm text-gray-600 border-t border-b',
      },

      {
        title: '店舗',
        index: 'clinic_name',
        render: (value: string) => (
          <p className="w-full text-center">{value}</p>
        ),
        className:
          'max-w-[150px] 3xl:max-w-[190px] 4xl:max-w-[220px] text-sm text-gray-600 border-t border-b',
      },
      {
        title: '',
        index: 'doctorLicense',
        render: (_: string) => (
          <div className="flex w-full py-2 text-center">
            <button className="flex rounded-xl border px-2 py-1">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth={1.5}
                stroke="currentColor"
                className="size-6"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="m16.862 4.487 1.687-1.688a1.875 1.875 0 1 1 2.652 2.652L10.582 16.07a4.5 4.5 0 0 1-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 0 1 1.13-1.897l8.932-8.931Zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0 1 15.75 21H5.25A2.25 2.25 0 0 1 3 18.75V8.25A2.25 2.25 0 0 1 5.25 6H10"
                />
              </svg>
              編集
            </button>
            <button className="mx-2 flex rounded-xl border px-2 py-1">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth={1.5}
                stroke="currentColor"
                className="size-6"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="m14.74 9-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 0 1-2.244 2.077H8.084a2.25 2.25 0 0 1-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 0 0-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 0 1 3.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 0 0-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 0 0-7.5 0"
                />
              </svg>
              削除
            </button>
          </div>
        ),
        className:
          'max-w-[150px] 3xl:max-w-[190px] 4xl:max-w-[220px] text-sm text-gray-600 border-t border-b',
      },
    ],
    [],
  )

  return (
    <div className="w-full">
      <div className="my-4 block w-full text-gray-500">
        <div className="flex w-full bg-main-50 p-4 font-bold">
          <h1>患者管理</h1>
          <div className="mx-auto" />
          <div className="w-42 flex items-center">
            <button
              onClick={openModal}
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
              患者を追加
            </button>
          </div>
        </div>
        <div className="w-full justify-center">
          {/* モーダル */}
          {showModal && (
            <div className="fixed inset-0 z-50 overflow-y-auto">
              <div className="flex min-h-screen items-center justify-center">
                <div className="z-50 min-w-[500px] rounded-lg bg-main-200 p-8 text-black">
                  {/* 編集フォーム */}
                  <form>
                    <div className="block">
                      <div className="flex w-full px-16">
                        <h1 className="mx-auto pb-2 text-xl font-bold">
                          新規予約
                        </h1>
                      </div>
                      <div className="mt-2 block w-full  px-16">
                        <label className="w-full py-2">氏名</label>
                        <input
                          className="w-full rounded-xl p-2"
                          name="firstName"
                        />
                      </div>
                      <div className="mt-2 block w-full  px-16">
                        <label className="w-full py-2">ふりがな</label>
                        <input
                          className="w-full rounded-xl p-2"
                          name="firstNameFurigana"
                        />
                      </div>
                      <div className="mt-2 block w-full  px-16">
                        <label className="w-full py-2">生年月日</label>
                        <input
                          className="w-full rounded-xl p-2"
                          type="date"
                          name="birthDay"
                        />
                      </div>
                      <div className="mt-2 block w-full  px-16">
                        <label className="w-full py-2">電話番号</label>
                        <input className="w-full rounded-xl p-2" name="tel" />
                      </div>
                      <div className="mt-2 block w-full px-16">
                        <label className="w-full py-2">診察メニュー</label>
                        <select
                          className="w-full rounded-xl p-2 text-center"
                          name="examination"
                        >
                          <option>-----</option>
                          <option>Examination 1</option>
                          <option>Examination 2</option>
                        </select>
                      </div>
                      <div className="mt-2 block w-full  px-16">
                        <label className="w-full py-2">希望担当医師</label>
                        <select
                          className="w-full rounded-xl p-2 text-center"
                          name="doctor"
                        >
                          <option>-----</option>
                          <option>Doctor 1</option>
                          <option>Doctor 2</option>
                        </select>
                      </div>
                      <div className="mt-2 block w-full  px-16">
                        <label className="w-full py-2">予約日時</label>
                        <input
                          className="w-full rounded-xl p-2"
                          name="appointmentTime"
                          type="date"
                        />
                      </div>
                      <div className="mt-2 block w-full  px-16">
                        <label className="w-full py-2">メモ</label>
                        <textarea
                          className="w-full rounded-xl p-2"
                          defaultValue=""
                        />
                      </div>
                      <div className="mt-4 flex w-full px-16">
                        <button
                          className="mr-8 w-32  rounded-xl border-2 border-main-500 bg-white p-2"
                          //onClick={() => setNewType('0')}
                        >
                          戻る
                        </button>
                        <button
                          className="ml-8 w-32  rounded-xl border-2 border-main-500 bg-main-400 p-2"
                          //onClick={() => setOpenDialog(false)}
                        >
                          登録
                        </button>
                      </div>
                    </div>
                  </form>
                </div>
              </div>
            </div>
          )}
          <Table
            columns={columns}
            data={[
              {
                membership_number: '10000001',
                username: '山田 太呂',
                tel: '03-1234-5678',
                birthday: '2000-01-01',
                last_visit_date: '2000-01-01',
                visit_count: '1',
                note1: '痛みに弱い',
                note2: '痛みに弱い',
                nurse_note: '痛みに弱い',
                clinic_name: 'aクリニック',
              },
            ]}
            onRowClick={() => {}}
          />
        </div>
      </div>
    </div>
  )
}

export default TemplatesList
