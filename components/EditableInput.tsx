// components/EditableInput.tsx
import React, { useState } from 'react'

interface InputParams {
  value: string | number
  setValue: (value: string | number) => void
  inputType?: string
  defaultVal?: boolean
}

const EditableInput: React.FC<InputParams> = ({
  value,
  setValue,
  inputType = 'texpt',
  defaultVal = false,
}) => {
  const [editMode, setEditMode] = useState(false)

  const handleClick = () => {
    setEditMode(true)
  }

  const handleBlur = () => {
    setEditMode(false)
  }

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setValue(event.target.value)
  }

  return (
    <div>
      {editMode ? (
        defaultVal == true ? (
          <input
            className="w-full text-center"
            type={inputType}
            defaultValue={value}
            onChange={handleChange}
            onBlur={handleBlur}
            autoFocus // Auto-focus on input field when clicked
          />
        ) : (
          <input
            className="w-full text-center"
            type={inputType}
            value={value}
            onChange={handleChange}
            onBlur={handleBlur}
            autoFocus // Auto-focus on input field when clicked
          />
        )
      ) : (
        <div className="w-full" onClick={handleClick}>
          {value || '-'}
        </div>
      )}
    </div>
  )
}

export default EditableInput
