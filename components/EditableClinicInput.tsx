// components/EditableInput.tsx
import type { Clinic } from '@/gen/proto/v1/clinic_pb'
import React, { useState } from 'react'
import type { UseFormRegister } from 'react-hook-form'

interface InputParams {
  value: string | number
  setValue: (value: string | number) => void
  inputType?: string
  defaultVal?: boolean
  register: UseFormRegister<Clinic>
  inputName?:
    | 'name'
    | 'area'
    | 'phone'
    | 'storeUrl'
    | 'postalCode'
    | 'prefecture'
    | 'addressLine1'
    | 'addressLine2'
    | 'basicBusinessHours1'
    | 'lineUrl'
    | 'instagramUrl'
    | 'cto'
    | 'googleReviewUrl'
}

const EditableClinicInput: React.FC<InputParams> = ({
  value,
  setValue,
  inputType = 'text',
  defaultVal = false,
  register,
  inputName = 'name',
}) => {
  const [editMode, setEditMode] = useState(false)

  const handleClick = () => {
    setEditMode(true)
  }

  const handleBlur = () => {
    setEditMode(false)
    setValue('')
  }

  return (
    <div className="w-full">
      {editMode ? (
        defaultVal == true ? (
          <input
            className="w-full text-left"
            {...register(inputName)}
            type={inputType}
            // defaultValue={value}
            // onChange={handleChange}
            onBlur={handleBlur}
            autoFocus // Auto-focus on input field when clicked
          />
        ) : (
          <input
            className="w-full text-left"
            // {...register(inputName)}
            {...register(inputName)}
            type={inputType}
            // value={value}
            // onChange={handleChange}
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

export default EditableClinicInput
