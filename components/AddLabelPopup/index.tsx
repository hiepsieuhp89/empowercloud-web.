import type { Label } from '@/gen/proto/v1/reception_pb'
import { labelList } from '@/server/label'
import { useCallback, useEffect, useMemo, useState } from 'react'
import LabelIcon from '../Icons/LabelIcon'

export const useDebounce = (value: string, delay: number) => {
  const [debouncedValue, setDebouncedValue] = useState(value)

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedValue(value)
    }, delay)

    return () => {
      clearTimeout(handler)
    }
  }, [value, delay])

  return debouncedValue
}

type Props = {
  handleAddLabel: (
    receptionId: bigint,
    labelId: bigint,
    name: string,
    color: string,
  ) => Promise<void>
  receptionId: bigint
}

export default function AddLabelPopup({ handleAddLabel, receptionId }: Props) {
  const [labels, setLabels] = useState<Label[]>([])
  const [keyword, setKeyword] = useState<string>('')

  const fetchLabels = async (keyword: string) => {
    const response = await labelList({ keyword, page: 1, size: 10 })
    setLabels(response.labels)
  }

  const debouncedKeyword = useDebounce(keyword, 300)

  useEffect(() => {
    fetchLabels(debouncedKeyword)
  }, [debouncedKeyword])

  const handleInputChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      setKeyword(e.target.value)
    },
    [],
  )

  const renderedLabels = useMemo(() => {
    return labels.map((label) => (
      <div
        key={label.id}
        className="flex cursor-pointer items-center gap-2 px-1 text-[14px] font-medium hover:bg-primary-client"
        onClick={() =>
          handleAddLabel(receptionId, label.id, label.name, label.color)
        }
      >
        <LabelIcon color={label.color} />
        {label.name}
      </div>
    ))
  }, [handleAddLabel, labels, receptionId])

  return (
    <div className="w-42 rounded-md border bg-primary-admin p-2">
      <div className="relative mt-1 flex flex-col">
        <input
          type="text"
          className="mt-1 w-full rounded border border-gray-200 p-1 pl-5 text-black"
          placeholder="ラベル検索"
          value={keyword}
          onChange={handleInputChange}
        />
        <div
          className="pointer-events-none absolute inset-y-0 left-[2px]  
                    flex items-center"
        >
          <LabelIcon color="#777" />
        </div>
      </div>
      <div className="mt-1 flex flex-col gap-1">{renderedLabels}</div>
    </div>
  )
}
