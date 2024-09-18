'use client'
// import { useRouter, useSearchParams } from 'next/navigation'
import type { SetStateAction } from 'react'
import { useCallback, useState } from 'react'

const PatientMemoComponent: React.FC = () => {
  const [memoType, setMemoType] = useState('day')
  const [memo, setMemo] = useState('')

  const handleTextChange = useCallback(
    (event: { target: { value: SetStateAction<string> } }) => {
      setMemo(event.target.value)
    },
    [],
  )

  const changeMemoTypeDay = useCallback(() => {
    setMemo('')
    setMemoType('day')
  }, [setMemoType, setMemo])

  const changeMemoTypePatient = useCallback(() => {
    setMemo('')
    setMemoType('patient')
  }, [setMemoType, setMemo])

  return (
    <div className="justify-center text-black">
      <div className="">
        <div className="flex border-b-2 border-gray-100">
          <button
            className={`px-4 py-2 font-bold text-black ${memoType === 'day' ? 'border-b-4 border-main-500' : ''}`}
            onClick={changeMemoTypeDay}
          >
            当日メモ
          </button>
          <button
            className={`px-4 py-2 font-bold text-black ${memoType === 'patient' ? 'border-b-4 border-main-500' : ''}`}
            onClick={changeMemoTypePatient}
          >
            患者メモ
          </button>
        </div>
        <div className="justify-center bg-white">
          <div className="flex w-full">
            <div className="mx-auto"></div>
            <div className="mx-4">診察日: 2023/07/10</div>
          </div>
          <div className="w-full p-2">
            <textarea
              onChange={handleTextChange}
              value={memo}
              rows={10}
              cols={20}
              className="w-full rounded-xl border bg-white p-2"
              placeholder="診察当日のみ利用できるメモです。院内共有にご利用ください。"
            />
          </div>
          <div className="flex w-full p-2">
            <div> {memo.length}/500</div>
            <div className="mx-auto" />
            <button className="py rounded bg-gray-500 px-2 font-bold text-white">
              保存
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

export default PatientMemoComponent
