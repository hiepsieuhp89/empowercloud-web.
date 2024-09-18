'use client'

import { useCallback, useEffect, useRef } from 'react'

interface TreatmentDialogComponentProps {
  id: string
  setShowDialog: React.Dispatch<React.SetStateAction<boolean>>
  onClickFunction: () => void
  isNew?: boolean
  showDialog: boolean
}

const TreatmentDialogComponent: React.FC<TreatmentDialogComponentProps> = ({
  setShowDialog,
  isNew = true,
  showDialog,
}) => {
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
      <div className="relative rounded-2xl bg-white shadow-lg" ref={dialogRef}>
        <div className="absolute right-0 top-0 mr-[-4px] mt-[-4px] size-4 rounded-2xl bg-gray-700 text-center text-xs font-bold text-white">
          <button onClick={() => setShowDialog(false)}>X</button>
        </div>
        <div className="flex w-full px-16 pt-4">
          <h1 className="mx-auto text-xl font-bold">
            {' '}
            {isNew ? '施術歴を追加' : '施術歴を編集'}
          </h1>
        </div>
        <div className="mb-4 block min-w-[600px]">
          <div className="block w-full px-16 pt-4">
            <p className="my-2 w-full">施術名</p>
            <input
              className="w-full rounded border border-black p-2"
              placeholder="施術名を入力してください"
            ></input>
          </div>
          <div className="py my-4 block w-full px-16">
            <p className="my-2 w-full">施術期限</p>
            <div className="flex w-full items-center">
              <input
                className="w-1/2 rounded border border-black p-2"
                type="date"
              ></input>
              <p className="px-2">~</p>
              <input
                className="w-1/2 rounded border border-black p-2"
                type="date"
              ></input>
            </div>
          </div>
          {/* <div className="block w-full px-16 py-2">
            <p className="my-2 w-full">労災・自賠責保険の種類</p>
            <select className="w-1/2 rounded border border-black p-2">
              <option>選択してください</option>
              <option value="1">---</option>
            </select>
          </div> */}
        </div>
        <div className="my-4 flex w-full px-16 py-2">
          <div className="mx-auto"></div>
          <button
            className="m-2  w-32 rounded border-2 border-main-400 bg-white p-2"
            onClick={() => setShowDialog(false)}
          >
            キャンセル
          </button>
          <button
            className="m-2 w-32 rounded border-2 border-main-400 bg-main-400 p-2 text-white"
            onClick={() => setShowDialog(false)}
          >
            {isNew ? '追加' : '保存'}
          </button>
        </div>
      </div>
    </div>
  )
}

export default TreatmentDialogComponent
