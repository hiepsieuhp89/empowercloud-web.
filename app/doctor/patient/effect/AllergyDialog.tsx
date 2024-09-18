'use client'

import { useCallback, useEffect, useRef } from 'react'

interface AllergyDialogComponentProps {
  id: string
  setShowDialog: React.Dispatch<React.SetStateAction<boolean>>
  onClickFunction: () => void
  isNew?: boolean
  showDialog: boolean
}

const AllergyDialogComponent: React.FC<AllergyDialogComponentProps> = ({
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
        <div className="flex w-full px-16 py-4">
          <h1 className="mx-auto text-xl font-bold">
            {' '}
            {isNew ? 'アレルギーを追加' : 'アレルギーを編集'}
          </h1>
        </div>
        <div className="block min-w-[600px]  py-4">
          <div className="block w-full px-16 pt-4">
            <p className="w-full">アレルギー</p>
            <input
              className="w-full rounded border border-black p-2"
              placeholder="アレルギー名を入力してください"
            ></input>
          </div>
        </div>
        <div className="flex w-full px-16 py-2">
          <div className="mx-auto"></div>
          <button
            className="m-2  w-32 rounded border-2 border-other-treatement bg-white p-2"
            onClick={() => setShowDialog(false)}
          >
            キャンセル
          </button>
          <button
            className="m-2 w-32 rounded border-2 border-main-400 bg-main-400 p-2 text-white"
            onClick={() => setShowDialog(false)}
          >
            追加
          </button>
        </div>
      </div>
    </div>
  )
}

export default AllergyDialogComponent
