import CommonModal from '@/components/CommonModal'
import type { Label } from '@/gen/proto/v1/reception_pb'
import { useCallback } from 'react'

type Props = {
  isOpen: boolean
  onClose: () => void
  createLabel?: (e: React.FormEvent<HTMLFormElement>) => void
  updateLabel?: (e: React.FormEvent<HTMLFormElement>) => void
  label?: Label
}

export default function CreateLabelModal({
  isOpen,
  onClose,
  createLabel,
  label,
  updateLabel,
}: Props) {
  const handleSubmit = useCallback(
    (e: React.FormEvent<HTMLFormElement>) => {
      e.preventDefault()
      if (Boolean(label) && updateLabel) updateLabel(e)
      else if (createLabel) createLabel(e)
    },
    [createLabel, label, updateLabel],
  )
  return (
    <CommonModal isOpen={isOpen} onClose={onClose}>
      <form id="createLabelModal" onSubmit={handleSubmit}>
        <h2 className="my-2 text-center text-[16px] font-bold text-gray-700">
          {label ? 'ラベル編集' : 'ラベル追加'}
        </h2>
        <div className="my-2 flex items-center gap-2 text-left font-medium text-gray-700">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            fill="#4d7394"
            className="size-5"
          >
            <path
              fillRule="evenodd"
              d="M5.25 2.25a3 3 0 0 0-3 3v4.318a3 3 0 0 0 .879 2.121l9.58 9.581c.92.92 2.39 1.186 3.548.428a18.849 18.849 0 0 0 5.441-5.44c.758-1.16.492-2.629-.428-3.548l-9.58-9.581a3 3 0 0 0-2.122-.879H5.25ZM6.375 7.5a1.125 1.125 0 1 0 0-2.25 1.125 1.125 0 0 0 0 2.25Z"
              clipRule="evenodd"
            />
          </svg>
          <p className="my-2 text-[14px]">表示サンプル</p>
        </div>
        <div className="flex gap-3">
          <div className="mb-4">
            <label
              className="block text-[14px] font-semibold text-gray-500"
              htmlFor="name"
            >
              ラベル
            </label>
            <input
              type="text"
              name="name"
              className="w-[120px] rounded-md border border-gray-300 px-3 py-1 text-gray-700 focus:border-blue-500 focus:ring focus:ring-blue-200"
              defaultValue={label?.name || ''}
            />
          </div>
          <div className="mb-4">
            <label
              className="block text-[14px] font-semibold text-gray-500"
              htmlFor="description"
            >
              説明
            </label>
            <input
              type="text"
              name="description"
              className="w-full rounded-md border border-gray-300 px-3 py-1 text-gray-700 focus:border-blue-500 focus:ring focus:ring-blue-200"
              defaultValue={label?.description || ''}
            />
          </div>
          <div className="mb-4">
            <label
              className="block text-[14px] font-semibold text-gray-500"
              htmlFor="color"
            >
              カラー
            </label>
            <input
              name="color"
              defaultValue={label?.color || '#ed1849'}
              type="color"
              className="h-[36px] w-full rounded-md border border-gray-300 focus:border-blue-500 focus:ring focus:ring-blue-200"
            />
          </div>
        </div>
        <div className="mt-4 flex items-center justify-end gap-2">
          <button className="w-[80px] rounded-md border-2 border-main-200 py-1 text-[14px] font-bold text-gray-700">
            キャンセル
          </button>
          <button
            type="submit"
            className="w-[60px] rounded-md border-2 border-main-400 bg-main-400 py-1 text-[14px] font-bold text-white"
          >
            保存
          </button>
        </div>
      </form>
    </CommonModal>
  )
}
