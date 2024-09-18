// components/EditableInput.tsx
import type { PositionRole } from '@/utils/reception'
import { PositionRoleList, getPositionName } from '@/utils/reception'
import React, { useState } from 'react'

interface InputParams {
  value: PositionRole
  setValue: (value: string) => void
}

const EditableStaffRole: React.FC<InputParams> = ({ value, setValue }) => {
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
          className="w-full rounded border py-2"
          value={value}
          onBlur={handleBlur}
          onChange={handleChange}
        >
          <option value="">-</option>
          {PositionRoleList.map((p, _i) => (
            <option value={p} key={_i}>
              {getPositionName(p)}
            </option>
          ))}
          {/* <option value="admin">{getRoleName('admin')}</option>
          <option value="doctor">{getRoleName('doctor')}</option>
          <option value="other">{getRoleName('other')}</option> */}
        </select>
      ) : (
        <div className="w-full" onClick={handleClick}>
          {value ? `${getPositionName(value)}` : '-'}
        </div>
      )}
    </div>
  )
}

export default EditableStaffRole
