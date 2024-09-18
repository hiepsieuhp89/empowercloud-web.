// components/EditableInput.tsx
import React, { useState } from 'react'

interface InputParams {
  value: string | number
  setValue: (value: string | number) => void
}

const EditableExpiredAfter: React.FC<InputParams> = ({ value, setValue }) => {
  const [editMode, setEditMode] = useState(false)

  const handleClick = () => {
    setEditMode(true)
  }

  const handleBlur = () => {
    setEditMode(false)
  }

  const handleChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    setValue(event.target.value)
  }

  return (
    <div>
      {editMode ? (
        <select
          className="w-full text-center"
          value={value}
          onChange={handleChange}
          onBlur={handleBlur}
          autoFocus
        >
          <option value="">-</option>
          {Array.from({ length: 24 }, (_, index) => index + 1).map((i, _id) => (
            <option key={_id} value={i}>
              {i}ヶ月
            </option>
          ))}
        </select>
      ) : (
        // <input
        //   className="w-full text-center"
        //   type="text"
        //   value={value}
        //   onChange={handleChange}
        //   onBlur={handleBlur}
        //   autoFocus // Auto-focus on input field when clicked
        // />
        <div className="w-full" onClick={handleClick}>
          {value ? `${value}ヶ月` : '-'}
        </div>
      )}
    </div>
  )
}

export default EditableExpiredAfter
