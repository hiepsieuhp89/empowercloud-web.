import React from 'react'

type Option = {
  value: number
  label: string
}

const options: Option[] = [
  { value: 1, label: '受付待ち' },
  { value: 2, label: '診療待ち' },
  { value: 3, label: '診療中' },
  { value: 4, label: '会計待ち' },
  { value: 5, label: '完了' },
  { value: 10, label: 'キャンセル済' },
]

type MultiSelectProps = {
  selectedOptions: number[]
  onChange: (selected: number[]) => void
}

const MultiSelectStatus: React.FC<MultiSelectProps> = ({
  selectedOptions,
  onChange,
}) => {
  const handleOptionToggle = (value: number) => {
    if (selectedOptions.includes(value)) {
      onChange(selectedOptions.filter((option) => option !== value))
    } else {
      onChange([...selectedOptions, value])
    }
  }

  return (
    <div className="grid grid-cols-3">
      {options.map((option) => (
        <label
          key={option.value}
          className="flex items-center space-x-1 rounded"
        >
          <input
            type="checkbox"
            checked={selectedOptions.includes(option.value)}
            onChange={() => handleOptionToggle(option.value)}
            className="form-checkbox size-4"
          />
          <span>{option.label}</span>
        </label>
      ))}
    </div>
  )
}

export default MultiSelectStatus
