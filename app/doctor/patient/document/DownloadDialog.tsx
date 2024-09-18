'use client'

import { useCallback, useEffect, useRef } from 'react'

interface DocumentDownloadDialogComponentProps {
  id: string
  setShowDialog: React.Dispatch<React.SetStateAction<boolean>>
  onClickFunction: () => void
  showDialog: boolean
}

const DocumentDownloadDialogComponent: React.FC<
  DocumentDownloadDialogComponentProps
> = ({ setShowDialog, showDialog, id }) => {
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
          <h1 className="mx-auto text-xl font-bold">ダウンロード</h1>
        </div>

        <div className="mt-4 block min-w-[600px]">
          <div className="block w-full px-16 pt-4">
            <p className="py w-full border-b border-black px-4">{id}</p>
          </div>
        </div>

        <div>
          <div className="py block w-full px-16 py-4">
            <p className="w-full text-sm text-gray-500">
              文書内に以下の入力項目があります。必要な項目を選択しダウンロードしてください。選択していない場合未記入で出力されます。
            </p>
          </div>
        </div>

        <div className="flex px-16 pt-4">
          <h1 className="mx-4 font-bold">施術名</h1>
          <select className="w-1/2 border">
            <option>未選択</option>
            <option value="1">---</option>
          </select>
        </div>

        <div className="flex w-full px-16 py-2">
          <div className="mx-auto"></div>
          <button
            className="m-2  w-32 rounded border-2 border-main-500 bg-white p-2"
            onClick={() => setShowDialog(false)}
          >
            キャンセル
          </button>
          <button
            className="m-2 w-32 rounded border-2 border-main-500 bg-main-500 p-2 text-white"
            onClick={() => setShowDialog(false)}
          >
            ダウンロード
          </button>
        </div>
      </div>
    </div>
  )
}

export default DocumentDownloadDialogComponent
