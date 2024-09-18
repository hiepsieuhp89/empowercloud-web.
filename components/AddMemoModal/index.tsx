'use client'

import { useState } from 'react'
import CommonModal from '../CommonModal'

type Props = {
  isOpen: boolean
  onClose: () => void
  receptionId: bigint
  handleAddMemo: (receptionId: bigint, memoContent: string) => Promise<void>
}

export default function AddMemoModal({
  isOpen,
  onClose,
  receptionId,
  handleAddMemo,
}: Props) {
  const [content, setContent] = useState<string>('')
  const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    if (e.target.value.length > 500) return
    setContent(e.target.value)
  }
  return (
    <CommonModal
      isOpen={isOpen}
      onClose={() => {
        onClose()
        setContent('')
      }}
      className="!bg-primary-admin"
    >
      <div>
        <div className="flex flex-col text-black">
          <textarea
            className="w-[300px] rounded-xl border p-2 text-[14px] text-black"
            rows={6}
            value={content}
            onChange={handleChange}
          />
          <p className="text-[14px]">{content.length}/500</p>
        </div>
        <div className="flex justify-end gap-3">
          <button
            onClick={onClose}
            className="w-[100px] border bg-white px-2 text-[14px] font-bold text-black"
          >
            キャンセル
          </button>
          <button
            onClick={() => {
              handleAddMemo(receptionId, content)
              onClose()
              setContent('')
            }}
            className="w-[60px] border bg-gray-500 px-2 text-[14px] font-bold text-white"
          >
            保存
          </button>
        </div>
      </div>
    </CommonModal>
  )
}
